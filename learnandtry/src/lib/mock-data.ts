import type { Subject, CourseImport } from "./types";

export const MOCK_SUBJECTS: Subject[] = [
  { id: "s1", name: "Mathématiques",  hue: 260, chaptersCount: 8, cardsCount: 42, quizzesCount: 12, progress: 64, lastTouched: "il y a 2h" },
  { id: "s2", name: "Biologie",       hue: 150, chaptersCount: 5, cardsCount: 28, quizzesCount: 7,  progress: 78, lastTouched: "hier" },
  { id: "s3", name: "Histoire",       hue: 60,  chaptersCount: 6, cardsCount: 35, quizzesCount: 9,  progress: 52, lastTouched: "il y a 3 jours" },
  { id: "s4", name: "Anglais",        hue: 330, chaptersCount: 4, cardsCount: 22, quizzesCount: 8,  progress: 71, lastTouched: "il y a 1h" },
];

export const MOCK_RECENT: CourseImport[] = [
  { id: "i1", subjectId: "s1", title: "Chapitre 4 — Dérivées",     type: "pdf",   pagesCount: 12, when: "il y a 2h" },
  { id: "i2", subjectId: "s2", title: "La respiration cellulaire", type: "text",  pagesCount: 4,  when: "hier" },
  { id: "i3", subjectId: "s3", title: "La Révolution française",   type: "photo", pagesCount: 8,  when: "il y a 3 jours" },
];