import { colorDistance, rgbLabel, toHex } from "../constants/appConstants";
import type { Color } from "../types/appTypes";

export const extractPalette = (data: ImageData): Color[] => {
  const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();
  const step = Math.max(4, Math.floor((data.width * data.height) / 90000));
  for (let pixel = 0; pixel < data.data.length; pixel += step * 4) {
    const alpha = data.data[pixel + 3];
    if (alpha < 150) continue;
    const r = Math.floor(data.data[pixel] / 32) * 32 + 16;
    const g = Math.floor(data.data[pixel + 1] / 32) * 32 + 16;
    const b = Math.floor(data.data[pixel + 2] / 32) * 32 + 16;
    const key = `${r}-${g}-${b}`;
    const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, count: 0 };
    bucket.r += data.data[pixel];
    bucket.g += data.data[pixel + 1];
    bucket.b += data.data[pixel + 2];
    bucket.count += 1;
    buckets.set(key, bucket);
  }
  const candidates = Array.from(buckets.values()).sort((a, b) => b.count - a.count).map((bucket) => {
    const hex = toHex(bucket.r / bucket.count, bucket.g / bucket.count, bucket.b / bucket.count);
    return { hex, rgb: rgbLabel(hex), count: bucket.count };
  });
  const selected: Color[] = [];
  candidates.forEach((candidate) => {
    if (selected.length >= 7) return;
    if (selected.every((color) => colorDistance(color, candidate) > 28)) selected.push(candidate);
  });
  candidates.forEach((candidate) => {
    if (selected.length >= 5 && selected.length >= 7) return;
    if (!selected.some((color) => color.hex === candidate.hex)) selected.push(candidate);
  });
  return selected.slice(0, 7);
};