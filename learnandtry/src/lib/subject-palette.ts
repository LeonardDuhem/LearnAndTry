// Palette fidèle au design (hues oklch)
export const SUBJECT_PALETTE = [
  { hue: 260, name: "Bleu" },
  { hue: 195, name: "Cyan" },
  { hue: 150, name: "Vert" },
  { hue: 110, name: "Lime" },
  { hue: 60,  name: "Ambre" },
  { hue: 30,  name: "Orange" },
  { hue: 10,  name: "Rouge" },
  { hue: 330, name: "Rose" },
  { hue: 295, name: "Violet" },
] as const;

export type SubjectHue = (typeof SUBJECT_PALETTE)[number]["hue"];