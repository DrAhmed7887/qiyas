/** Fixed decimals, with a true minus sign and no "-0.00". */
export function fixed(n: number, digits: number): string {
  const s = n.toFixed(digits);
  if (Number(s) === 0) return s.replace('-', '');
  return s.startsWith('-') ? `−${s.slice(1)}` : s;
}

/** Like fixed(), but positive numbers get an explicit plus sign. */
export function signed(n: number, digits: number): string {
  const s = fixed(n, digits);
  return n > 0 && !s.startsWith('−') && Number(s) !== 0 ? `+${s}` : s;
}
