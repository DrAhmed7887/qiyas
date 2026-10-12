# WHO Child Growth Standards: data source

Public WHO data, values unmodified. SD4neg and SD4 columns dropped; converted from the WHO .xlsx files to JSON. Downloaded 2026-10-12. WHO's own expanded z-score tables were used (no fallback source, no computed values).

Each JSON file is the first worksheet of the .xlsx listed below (L, M, S and SD3neg..SD3 copied as-is; the WHO files round SD values to 3 decimals). Key is the integer day (wfa, lhfa; 0-1856) or round(cm*10) (wfl 450-1100, wfh 650-1200).

| File | Source URL (query string `?sfvrsn=` is a WHO cache tag and is not needed) |
|---|---|
| wfa_boys.json | https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/weight-for-age/expanded-tables/wfa-boys-zscore-expanded-tables.xlsx |
| wfa_girls.json | https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/weight-for-age/expanded-tables/wfa-girls-zscore-expanded-tables.xlsx |
| lhfa_boys.json | https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/length-height-for-age/expandable-tables/lhfa-boys-zscore-expanded-tables.xlsx |
| lhfa_girls.json | https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/length-height-for-age/expandable-tables/lhfa-girls-zscore-expanded-tables.xlsx |
| wfl_boys.json | https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/weight-for-length-height/expanded-tables/wfl-boys-zscore-expanded-table.xlsx |
| wfl_girls.json | https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/weight-for-length-height/expanded-tables/wfl-girls-zscore-expanded-table.xlsx |
| wfh_boys.json | https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/weight-for-length-height/expanded-tables/wfh-boys-zscore-expanded-tables.xlsx |
| wfh_girls.json | https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/weight-for-length-height/expanded-tables/wfh-girls-zscore-expanded-tables.xlsx |

Index pages: https://www.who.int/tools/child-growth-standards/standards (weight-for-age, length-height-for-age, weight-for-length-height).

## Citation

WHO Multicentre Growth Reference Study Group. WHO Child Growth Standards: Length/height-for-age, weight-for-age, weight-for-length, weight-for-height and body mass index-for-age: Methods and development. Geneva: World Health Organization, 2006.

## Conversion script

Run as `python3 -I convert.py <raw_dir_with_{ind}-{sex}.xlsx> <out_dir> <urls.txt>` (urls.txt = the 8 URLs above, one per line; the script appends the user site-packages path because `-I` hides openpyxl).

```python
import sys, json, os
sys.path.append("/Users/ahmedzayed/Library/Python/3.9/lib/python/site-packages")
import openpyxl
raw, out, urlfile = sys.argv[1:4]
urls = {}
for u in open(urlfile).read().split():
    n = os.path.basename(u.split("?")[0]); urls[tuple(n.split("-")[:2])] = u
COLS = ["key","L","M","S","SD3neg","SD2neg","SD1neg","SD0","SD1","SD2","SD3"]
for ind in ("wfa","lhfa","wfl","wfh"):
    for sex in ("boys","girls"):
        ws = openpyxl.load_workbook(f"{raw}/{ind}-{sex}.xlsx", data_only=True).worksheets[0]
        rows = list(ws.iter_rows(values_only=True))
        is_day = ind in ("wfa","lhfa"); res = []
        for r in rows[1:]:
            if r[0] is None: continue
            k = int(r[0]) if is_day else round(float(r[0])*10)
            res.append([k] + [r[i] for i in range(1, 4)] + [r[i] for i in range(5, 12)])  # drops SD4neg (col 4) and SD4 (col 12)
        doc = {"indicator": ind, "sex": sex, "key": "day" if is_day else "length_mm",
               "source": urls[(ind, sex)].split("?")[0], "columns": COLS, "rows": res}
        json.dump(doc, open(f"{out}/{ind}_{sex}.json", "w"), separators=(",", ":"))
```
