// Une matière créée par l'utilisateur
export interface Subject {
  id: string;
  name: string;
  hue: number;            // 0–360, pour générer la couleur oklch
  chaptersCount: number;
  cardsCount: number;
  quizzesCount: number;
  progress: number;       // 0–100 (% de maîtrise)
  lastTouched?: string;   // "il y a 2h", etc. (on fera mieux plus tard)
}

// Un import de cours
export interface CourseImport {
  id: string;
  subjectId: string;
  title: string;
  type: "pdf" | "text" | "photo";
  pagesCount: number;
  when: string;
}