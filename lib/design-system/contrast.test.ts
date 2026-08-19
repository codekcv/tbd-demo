import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Both themes are maintained independently, and a light-theme fix does not imply the dark
// one is fine. This pins that: change a colour token so a pairing drops below WCAG AA and
// the build fails here rather than on someone's screen.

const AA_NORMAL_TEXT = 4.5;

type Hsl = [number, number, number];

function readTheme(theme: "light" | "dark"): Record<string, Hsl> {
  const css = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
  const pattern = theme === "light" ? /:root\s*\{([\s\S]*?)\n\}/ : /\.dark\s*\{([\s\S]*?)\n\}/;
  const body = css.match(pattern)?.[1];
  if (!body) throw new Error(`Could not find the ${theme} token block in globals.css`);

  const tokens: Record<string, Hsl> = {};
  for (const match of body.matchAll(/--([\w-]+):\s*hsl\(([^)]+)\)/g)) {
    const parts = match[2].trim().split(/\s+/).map(parseFloat);
    tokens[match[1]] = [parts[0], parts[1], parts[2]];
  }
  return tokens;
}

function toRgb([h, s, l]: Hsl): [number, number, number] {
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = light - c / 2;
  const sector = Math.floor(h / 60) % 6;
  const table: [number, number, number][] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ];
  const [r, g, b] = table[sector];
  return [r + m, g + m, b + m];
}

function luminance(hsl: Hsl): number {
  const [r, g, b] = toRgb(hsl).map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground: Hsl, background: Hsl): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

// Editorial, not exhaustive: which foreground belongs on which background is a judgement
// about how the UI is composed, so it is maintained by hand. Add a pairing when you use one.
const PAIRINGS: [string, string][] = [
  ["foreground", "background"],
  ["ink", "background"],
  ["muted-foreground", "background"],
  ["muted-foreground", "muted"],
  ["primary", "background"],
  ["primary", "card"],
  ["primary-foreground", "primary"],
  ["accent-foreground", "accent"],
  ["success", "card"],
  ["success-foreground", "success"],
  ["warning", "card"],
  ["warning-foreground", "warning"],
  ["destructive", "card"],
];

describe.each(["light", "dark"] as const)("%s theme", (theme) => {
  const tokens = readTheme(theme);

  it.each(PAIRINGS)("%s on %s meets WCAG AA", (foreground, background) => {
    expect(
      tokens[foreground],
      `--${foreground} is missing from the ${theme} block`,
    ).toBeDefined();
    expect(
      tokens[background],
      `--${background} is missing from the ${theme} block`,
    ).toBeDefined();
    expect(contrast(tokens[foreground], tokens[background])).toBeGreaterThanOrEqual(
      AA_NORMAL_TEXT,
    );
  });
});
