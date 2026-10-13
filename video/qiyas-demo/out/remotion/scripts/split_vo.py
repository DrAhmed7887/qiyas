"""Split one TTS narration take into public/vo/<shot-id>.wav, one file per storyboard shot.

Usage: python3 -I scripts/split_vo.py <narration.wav> <ggml-model.bin>

1. whisper-cli gives word timestamps for the whole take.
2. The storyboard's <voiceover> words are matched to them (difflib), giving each line's first word.
3. Each cut snaps to the nearest silence (ffmpeg silencedetect), so no word is clipped.
4. Each segment is cut with atrim *inside* the filter chain (an output -ss would run after the fades
   and silence everything), then every segment is transcribed again and printed for a human check.
Needs ffmpeg and whisper-cli on PATH. Writes nothing outside public/vo and a temp folder.
"""
import difflib
import json
import re
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
STORYBOARD = HERE.parent.parent / 'storyboard.xml'
VO = HERE / 'public' / 'vo'


def norm(word: str) -> str:
    return re.sub(r'[^a-z0-9]', '', word.lower().replace('w.h.o.', 'who'))


def run(*args: str) -> str:
    return subprocess.run(args, capture_output=True, text=True, check=True).stderr


def shots() -> list[tuple[str, str]]:
    root = ET.parse(STORYBOARD).getroot()
    return [(s.get('id'), s.findtext('voiceover').strip()) for s in root.iter('shot')]


def whisper_words(wav16: Path, model: str, tmp: Path) -> list[tuple[float, str]]:
    subprocess.run(['whisper-cli', '-m', model, '-f', str(wav16), '-ml', '1', '-sow', '-oj',
                    '-of', str(tmp / 'full'), '-np'], capture_output=True, check=True)
    data = json.loads((tmp / 'full.json').read_text())
    return [(t['offsets']['from'] / 1000, norm(t['text'])) for t in data['transcription'] if norm(t['text'])]


def silences(wav: Path) -> list[tuple[float, float]]:
    log = run('ffmpeg', '-hide_banner', '-i', str(wav), '-af', 'silencedetect=noise=-40dB:d=0.25', '-f', 'null', '-')
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
    return list(zip(starts, ends))


def line_starts(lines: list[tuple[str, str]], words: list[tuple[float, str]]) -> list[float]:
    script, owner = [], []
    for i, (_, vo) in enumerate(lines):
        for w in vo.split():
            if norm(w):
                script.append(norm(w))
                owner.append(i)
    matcher = difflib.SequenceMatcher(None, script, [w for _, w in words], autojunk=False)
    s2w = {a + k: b + k for a, b, n in matcher.get_matching_blocks() for k in range(n)}
    first: dict[int, float] = {}
    for si, i in enumerate(owner):
        if i not in first and si in s2w:
            first[i] = words[s2w[si]][0]
    missing = [lines[i][0] for i in range(len(lines)) if i not in first]
    if missing:
        sys.exit(f'could not find the first word of: {missing}')
    return [first[i] for i in range(len(lines))]


def segments(starts: list[float], sil: list[tuple[float, float]], total: float) -> list[tuple[float, float]]:
    cuts = []
    for t in starts[1:]:
        near = [(abs((s + e) / 2 - t), s, e) for s, e in sil if abs((s + e) / 2 - t) < 1.2]
        cuts.append((min(near)[1] + 0.05, min(near)[2] - 0.05) if near else (t - 0.1, t - 0.1))
    bounds, a = [], max(0.0, starts[0] - 0.2)
    for i in range(len(starts)):
        b = cuts[i][0] if i < len(cuts) else total - 0.2
        bounds.append((a, b))
        if i < len(cuts):
            a = cuts[i][1]
    return bounds


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, model = Path(sys.argv[1]), sys.argv[2]
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        clean, wav16 = VO / 'narration-clean.wav', tmp / 'full16.wav'
        run('ffmpeg', '-y', '-v', 'error', '-i', str(src), '-c:a', 'pcm_s16le', str(clean))
        run('ffmpeg', '-y', '-v', 'error', '-i', str(clean), '-ar', '16000', '-ac', '1', str(wav16))
        total = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0',
                                      str(clean)], capture_output=True, text=True).stdout)
        lines = shots()
        bounds = segments(line_starts(lines, whisper_words(wav16, model, tmp)), silences(clean), total)
        for (sid, vo), (a, b) in zip(lines, bounds):
            fade = f'afade=t=out:st={max(0, b - a - 0.05):.3f}:d=0.05'
            out = VO / f'{sid}.wav'
            run('ffmpeg', '-y', '-v', 'error', '-i', str(clean), '-af',
                f'atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.03,{fade}', str(out))
            check = tmp / f'{sid}-16.wav'
            run('ffmpeg', '-y', '-v', 'error', '-i', str(out), '-ar', '16000', '-ac', '1', str(check))
            heard = subprocess.run(['whisper-cli', '-m', model, '-f', str(check), '-nt', '-np'],
                                   capture_output=True, text=True).stdout.split()
            print(f'{sid:8} {b - a:5.2f}s | {" ".join(heard)}')


if __name__ == '__main__':
    main()
