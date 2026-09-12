export type TokenKey = "background" | "primary" | "secondary" | "card" | "text";
export type Color = { hex: string; rgb: string; count?: number };
export type SavedPalette = { id: string; name: string; colors: string[]; createdAt: string };

export type EyeDropperResult = { sRGBHex: string };
export type EyeDropperLike = { open: () => Promise<EyeDropperResult> };
export type EyeDropperConstructor = new () => EyeDropperLike;

declare global {
  interface Window {
    EyeDropper?: EyeDropperConstructor;
  }
}