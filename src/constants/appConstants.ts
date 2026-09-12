import type { Color, TokenKey } from "../types/appTypes";

export const DEFAULT_COLORS = ["#0D1B2A", "#2DD4BF", "#7DD3FC", "#F59E0B", "#172B4D", "#F8FAFC", "#A7F3D0"];
export const TOKEN_LABELS: Record<TokenKey, { label: string; detail: string }> = {
  background: { label: "Background", detail: "Base canvas" },
  primary: { label: "Primary", detail: "CTA + active" },
  secondary: { label: "Secondary", detail: "Supporting tone" },
  card: { label: "Card", detail: "Surfaces" },
  text: { label: "Text", detail: "Content" },
};
export const TOKEN_KEYS: TokenKey[] = ["background", "primary", "secondary", "card", "text"];

export const encodeSvg = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;


export const hexToRgb = (hex: string) => {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
  const number = Number.parseInt(normalized, 16);
  return { r: (number >> 16) & 255, g: (number >> 8) & 255, b: number & 255 };
};

export const rgbLabel = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
};

export const toHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0")).join("").toUpperCase()}`;

export const contrastRatio = (foreground: string, background: string) => {
  const luminance = (hex: string) => {
    const values = Object.values(hexToRgb(hex)).map((value) => value / 255).map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
    return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
  };
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
};

export const readableText = (background: string) => (contrastRatio("#FFFFFF", background) >= 4.5 ? "#FFFFFF" : "#000000");
export const accessibleText = (backgrounds: string[]) => {
  const candidates = ["#FFFFFF", "#000000"];
  return candidates.sort((a, b) => {
    const aScore = Math.min(...backgrounds.map((background) => contrastRatio(a, background)));
    const bScore = Math.min(...backgrounds.map((background) => contrastRatio(b, background)));
    return bScore - aScore;
  })[0];
};
export const colorDistance = (a: Color, b: Color) => {
  const rgbA = hexToRgb(a.hex);
  const rgbB = hexToRgb(b.hex);
  return Math.sqrt((rgbA.r - rgbB.r) ** 2 + (rgbA.g - rgbB.g) ** 2 + (rgbA.b - rgbB.b) ** 2);
};
