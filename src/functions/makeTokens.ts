import { contrastRatio, DEFAULT_COLORS, rgbLabel } from "../constants/appConstants";
import type { Color, TokenKey } from "../types/appTypes";

export const makeTokens = (colors: Color[]) => {
  const safe = colors.length ? colors : DEFAULT_COLORS.map((hex) => ({ hex, rgb: rgbLabel(hex) }));
  return {
    background: safe[0]?.hex ?? DEFAULT_COLORS[0],
    primary: safe[1]?.hex ?? DEFAULT_COLORS[1],
    secondary: safe[2]?.hex ?? DEFAULT_COLORS[2],
    card: safe[4]?.hex ?? safe[0]?.hex ?? DEFAULT_COLORS[4],
    text: safe.find((color) => contrastRatio("#FFFFFF", color.hex) < 4.5)?.hex ?? safe[5]?.hex ?? DEFAULT_COLORS[5],
  } satisfies Record<TokenKey, string>;
};