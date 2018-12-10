export function convert(v: number): string {
  let r: string = "";
  if (v == 0) return "0";
  while (v > 0) {
    r = String.fromCharCode((v % 64) + 48) + r;
    v = Math.floor(v / 64);
  }
  return r;
}

export function deconvert(v: string): number {
  let r: number = 0;
  let p: number = 1;
  for (let i = 0; i < v.length; i++) {
    r += (v.charCodeAt(i) - 48) * p;
    p *= 64;
  }
  return r;
}
