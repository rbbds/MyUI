// Demo products for stories. Images are generated SVGs (no photos, no external requests).
const svg = (bg: string, fg: string, shape: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="${bg}"/>${shape.split('FG').join(fg)}</svg>`)}`;

const SHAPES = {
  sweater: '<path d="M140 90l60 25 60-25 70 45-25 60-35-15v150H130V180l-35 15-25-60z" fill="FG"/><path d="M175 102c8 18 42 18 50 0" stroke="#0002" stroke-width="6" fill="none"/>',
  mug: '<rect x="120" y="130" width="130" height="160" rx="18" fill="FG"/><path d="M250 165h22a30 30 0 010 60h-22" stroke="FG" stroke-width="18" fill="none"/>',
  bag: '<rect x="110" y="150" width="180" height="170" rx="16" fill="FG"/><path d="M155 150v-25a45 45 0 0190 0v25" stroke="FG" stroke-width="14" fill="none"/>',
  lamp: '<path d="M150 110h100l35 100H115z" fill="FG"/><rect x="193" y="210" width="14" height="90" fill="FG"/><rect x="150" y="295" width="100" height="16" rx="8" fill="FG"/>',
  plant: '<path d="M150 250h100l-12 70h-76z" fill="FG"/><path d="M200 250c0-60-50-90-70-100 10 50 30 80 70 100zm0 0c0-70 40-110 70-120-5 60-30 100-70 120z" fill="#3f8f5a"/>',
  shoe: '<path d="M80 250c20-10 60-60 90-70l40 40c30 10 90 15 120 25 20 7 20 35 0 35H90c-15 0-25-20-10-30z" fill="FG"/><rect x="80" y="280" width="250" height="14" rx="7" fill="#0003"/>',
};

export const img = (shape: keyof typeof SHAPES, bg = '#eef0f4', fg = '#4f46e0') => svg(bg, fg, SHAPES[shape]);

export const products = [
  { id: 'trui', title: 'Wool crew neck sweater', meta: 'Northlight', price: 79.95, compareAt: 99.95, rating: 4.5, reviewCount: 128, image: img('sweater', '#eef2f7', '#3b5b8c'), swatches: ['#3b5b8c', '#b5473a', '#e6dccb', '#2f2f2f', '#6b8f71'], badge: 'Sale' },
  { id: 'mok', title: 'Stoneware mug, 350 ml', meta: 'Clay Studio', price: 14.5, rating: 4.8, reviewCount: 64, image: img('mug', '#f6efe6', '#c9774c'), swatches: ['#c9774c', '#e8e2d6', '#2f4858'] },
  { id: 'tas', title: 'Canvas shopper', meta: 'Carry Co', price: 34.95, rating: 4.2, reviewCount: 23, image: img('bag', '#eef4ef', '#5c7d5f'), badge: 'New' },
  { id: 'lamp', title: 'Brass desk lamp', meta: 'Light & Co', price: 129, rating: 4.6, reviewCount: 41, image: img('lamp', '#f7f3e8', '#b8902f'), stock: 'low' as const },
  { id: 'plant', title: 'Plant pot with saucer', meta: 'Greenhouse', price: 24.95, compareAt: 29.95, rating: 3.9, reviewCount: 12, image: img('plant', '#f2efe9', '#d6c3a5') },
  { id: 'schoen', title: 'Leather sneaker', meta: 'Stride', price: 119.95, rating: 4.4, reviewCount: 210, image: img('shoe', '#eef0f4', '#2f2f2f'), stock: 'out' as const },
];
