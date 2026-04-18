// Couleur principale d'une matière (pour textes, dots, borders)
export function subjectColor(hue: number): string {
  return `oklch(0.74 0.17 ${hue})`;
}

// Couleur mélangée avec le fond (pour backgrounds subtils)
export function subjectMix(hue: number, percent: number): string {
  return `color-mix(in oklab, oklch(0.74 0.17 ${hue}) ${percent}%, var(--bg-1))`;
}