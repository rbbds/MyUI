// Color helpers for the Brand builder: hex <-> OKLCH, a 12-step brand scale and WCAG contrast.
// No dependencies. OKLCH keeps steps perceptually even, so every brand color gets a similar-feeling scale.

export const STEPS = ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
export type Step = (typeof STEPS)[number];

/* Target lightness per step (OKLCH L). Taken from the Iris scale, so generated scales feel the same. */
const L: Record<Step, number> = { '25': 0.985, '50': 0.965, '100': 0.93, '200': 0.87, '300': 0.78, '400': 0.68, '500': 0.6, '600': 0.53, '700': 0.47, '800': 0.4, '900': 0.35, '950': 0.25 };
/* Chroma factor per step relative to the input color: light and very dark steps carry less color. */
const C: Record<Step, number> = { '25': 0.08, '50': 0.16, '100': 0.3, '200': 0.55, '300': 0.8, '400': 0.95, '500': 1, '600': 1, '700': 0.92, '800': 0.78, '900': 0.66, '950': 0.5 };

type RGB = [number, number, number];
const toLin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGam = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function hexToRgb(hex: string): RGB | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
}
export const rgbToHex = (rgb: RGB) => '#' + rgb.map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0')).join('');

function rgbToOklch([r, g, b]: RGB): [number, number, number] {
  const [lr, lg, lb] = [toLin(r), toLin(g), toLin(b)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L_ = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const b2 = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L_, Math.hypot(a, b2), (Math.atan2(b2, a) * 180) / Math.PI];
}
function oklchToRgb(Lv: number, Cv: number, H: number): RGB {
  const a = Cv * Math.cos((H * Math.PI) / 180);
  const b = Cv * Math.sin((H * Math.PI) / 180);
  const l = (Lv + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (Lv - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (Lv - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    toGam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toGam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toGam(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}
const inGamut = (rgb: RGB) => rgb.every((c) => c >= -0.0005 && c <= 1.0005);
/* Reduce chroma until the color fits in sRGB (keeps hue and lightness). */
function fit(Lv: number, Cv: number, H: number): RGB {
  let c = Cv;
  let rgb = oklchToRgb(Lv, c, H);
  while (!inGamut(rgb) && c > 0.001) { c *= 0.95; rgb = oklchToRgb(Lv, c, H); }
  return rgb;
}

/**
 * 12-step scale from one brand color. The input color is placed on the step whose lightness is closest
 * (usually 500 to 700) and kept exactly; the other steps are generated around it.
 */
export function brandScale(hex: string): { scale: Record<Step, string>; anchor: Step } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [l0, c0, h0] = rgbToOklch(rgb);
  const anchor = STEPS.reduce((best, s) => (Math.abs(L[s] - l0) < Math.abs(L[best] - l0) ? s : best), '600' as Step);
  const shift = l0 - L[anchor];
  const scale = {} as Record<Step, string>;
  for (const s of STEPS) {
    // shift the curve a bit towards the input so neighbours stay close, fading out to the ends
    const w = 1 - Math.min(1, Math.abs(STEPS.indexOf(s) - STEPS.indexOf(anchor)) / 4);
    scale[s] = s === anchor ? rgbToHex(rgb) : rgbToHex(fit(Math.min(0.99, L[s] + shift * w), c0 * C[s], h0));
  }
  return { scale, anchor };
}

const lum = (rgb: RGB) => { const [r, g, b] = rgb.map(toLin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export function contrast(a: string, b: string): number {
  const A = hexToRgb(a), B = hexToRgb(b);
  if (!A || !B) return 0;
  const [x, y] = [lum(A), lum(B)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
