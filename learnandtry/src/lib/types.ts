export interface Subject {
  id: string;
  name: string;
  hue: number;
  createdAt: string;
  // Champs calculés — optionnels tant qu'on n'a pas les tables liées
  chaptersCount?: number;
  cardsCount?: number;
  quizzesCount?: number;
  progress?: number;
  lastTouched?: string;
}

export interface CourseImport {
  id: string;
  subjectId: string;
  title: string;
  type: "pdf" | "text" | "photo";
  pagesCount: number;
  createdAt: string;
}

// Types pour le contenu structuré d'une fiche
export type SectionKind = "text" | "list" | "table" | "callouts" | "flashcards";

export interface SectionBase {
  id: string;
  title: string;
  kind: SectionKind;
}

export interface TextSection extends SectionBase {
  kind: "text";
  body: string;
}

export interface ListSection extends SectionBase {
  kind: "list";
  items: [string, string][]; // [nom, valeur/formule]
}

export interface TableSection extends SectionBase {
  kind: "table";
  rows: string[][]; // première ligne = en-têtes
}

export interface CalloutSection extends SectionBase {
  kind: "callouts";
  items: { tone: "info" | "warn" | "danger"; text: string }[];
}

export interface FlashcardsSection extends SectionBase {
  kind: "flashcards";
  cards: [string, string][]; // [recto, verso]
}

export type FicheSection =
  | TextSection
  | ListSection
  | TableSection
  | CalloutSection
  | FlashcardsSection;

export interface FicheContent {
  summary: string[];     // 3 points clés pour le résumé IA
  readTime: string;      // "8 min de lecture"
  sections: FicheSection[];
}

export interface Fiche {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  subjectHue: number;
  importTitle: string;
  content: FicheContent;
  createdAt: string;
}

export interface FicheSummary {
  id: string;
  title: string;
  subjectName: string;
  subjectHue: number;
  sectionsCount: number;
  createdAt: string;
}