export const DEFAULT_THEME = "#14e12e";

export function getThemeVars(color) {
  return {
    "--theme": color,
    "--theme-darken": darken(color, 0.1),
    "--theme-lighten": lighten(color, 0.2),
  };
}

function darken(hex, amount) {
  return adjust(hex, -amount);
}

function lighten(hex, amount) {
  return adjust(hex, amount);
}

function adjust(hex, amount) {
  const num = parseInt(hex.replace("#", ""), 16);

  let r = (num >> 16) + Math.round(255 * amount);
  let g = ((num >> 8) & 0xff) + Math.round(255 * amount);
  let b = (num & 0xff) + Math.round(255 * amount);

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return `rgb(${r}, ${g}, ${b})`;
}
