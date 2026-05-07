import { createClient } from "./supabase/server";
import type { Subject, CourseImport, FicheSummary } from "./types";

export async function getSubjects(): Promise<Subject[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subjects")
    .select("id, name, hue, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Erreur getSubjects:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    hue: row.hue,
    createdAt: row.created_at,
  }));
}

export async function getRecentImports(limit = 5): Promise<CourseImport[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("course_imports")
    .select("id, subject_id, title, type, pages_count, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Erreur getRecentImports:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    subjectId: row.subject_id,
    title: row.title,
    type: row.type as CourseImport["type"],
    pagesCount: row.pages_count ?? 0,
    createdAt: row.created_at,
  }));
}

export interface QuizWithQuestions {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  subjectHue: number;
  createdAt: string;
  questions: {
    id: string;
    question: string;
    choices: string[];
    correctIndex: number;
    explanation: string;
    sortOrder: number;
  }[];
}

export async function getQuiz(quizId: string): Promise<QuizWithQuestions | null> {
  const supabase = await createClient();

  const { data: quiz, error } = await supabase
    .from("quizzes")
    .select(`
      id, title, subject_id, created_at,
      subjects ( name, hue ),
      quiz_questions ( id, question, choices, correct_index, explanation, sort_order )
    `)
    .eq("id", quizId)
    .single();

  if (error || !quiz) {
    console.error("Erreur getQuiz:", error);
    return null;
  }

  const subject = quiz.subjects as unknown as { name: string; hue: number };
  const questions = (quiz.quiz_questions as unknown as Array<{
    id: string;
    question: string;
    choices: string[];
    correct_index: number;
    explanation: string;
    sort_order: number;
  }>) ?? [];

  return {
    id: quiz.id,
    title: quiz.title,
    subjectId: quiz.subject_id,
    subjectName: subject.name,
    subjectHue: subject.hue,
    createdAt: quiz.created_at,
    questions: questions
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((q) => ({
        id: q.id,
        question: q.question,
        choices: q.choices,
        correctIndex: q.correct_index,
        explanation: q.explanation,
        sortOrder: q.sort_order,
      })),
  };
}

export interface QuizSummary {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  subjectHue: number;
  questionsCount: number;
  createdAt: string;
}

export async function getQuizzes(): Promise<QuizSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quizzes")
    .select(`
      id, title, subject_id, created_at,
      subjects ( name, hue ),
      quiz_questions ( id )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur getQuizzes:", error);
    return [];
  }

  return data.map((row) => {
    const subject = row.subjects as unknown as { name: string; hue: number };
    const questions = row.quiz_questions as unknown as { id: string }[];
    return {
      id: row.id,
      title: row.title,
      subjectId: row.subject_id,
      subjectName: subject.name,
      subjectHue: subject.hue,
      questionsCount: questions?.length ?? 0,
      createdAt: row.created_at,
    };
  });
}

export async function getFiches(): Promise<import("./types").FicheSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fiches")
    .select("id, title, created_at, subjects(name, hue), content")
    .order("created_at", { ascending: false });

  if (error) { console.error("Erreur getFiches:", error); return []; }

  return data.map((row) => {
    const subject = row.subjects as unknown as { name: string; hue: number };
    const content = row.content as unknown as import("./types").FicheContent;
    return {
      id: row.id,
      title: row.title,
      subjectName: subject.name,
      subjectHue: subject.hue,
      sectionsCount: content?.sections?.length ?? 0,
      createdAt: row.created_at,
    };
  });
}

export async function getFiche(ficheId: string): Promise<import("./types").Fiche | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fiches")
    .select("id, title, subject_id, import_id, created_at, content, subjects(name, hue), course_imports(title)")
    .eq("id", ficheId)
    .single();

  if (error || !data) { console.error("Erreur getFiche:", error); return null; }

  const subject = data.subjects as unknown as { name: string; hue: number };
  const courseImport = data.course_imports as unknown as { title: string };

  return {
    id: data.id,
    title: data.title,
    subjectId: data.subject_id,
    subjectName: subject.name,
    subjectHue: subject.hue,
    importTitle: courseImport?.title ?? "",
    content: data.content as unknown as import("./types").FicheContent,
    createdAt: data.created_at,
  };
}

export interface SubjectDetail {
  subject: Subject;
  imports: CourseImport[];
  quizzes: QuizSummary[];
  fiches: FicheSummary[];
}

export async function getSubjectDetail(
  subjectId: string
): Promise<SubjectDetail | null> {
  const supabase = await createClient();

  const [
    { data: subject, error: subjectError },
    { data: importsRaw },
    { data: quizzesRaw },
    { data: fichesRaw },
  ] = await Promise.all([
    supabase
      .from("subjects")
      .select("id, name, hue, created_at")
      .eq("id", subjectId)
      .single(),
    supabase
      .from("course_imports")
      .select("id, subject_id, title, type, pages_count, created_at")
      .eq("subject_id", subjectId)
      .order("created_at", { ascending: false }),
    supabase
      .from("quizzes")
      .select("id, title, subject_id, created_at, quiz_questions(id)")
      .eq("subject_id", subjectId)
      .order("created_at", { ascending: false }),
    supabase
      .from("fiches")
      .select("id, title, created_at, content")
      .eq("subject_id", subjectId)
      .order("created_at", { ascending: false }),
  ]);

  if (subjectError || !subject) return null;

  return {
    subject: {
      id: subject.id,
      name: subject.name,
      hue: subject.hue,
      createdAt: subject.created_at,
    },
    imports: (importsRaw ?? []).map((row) => ({
      id: row.id,
      subjectId: row.subject_id,
      title: row.title,
      type: row.type as CourseImport["type"],
      pagesCount: row.pages_count ?? 0,
      createdAt: row.created_at,
    })),
    quizzes: (quizzesRaw ?? []).map((row) => {
      const questions = row.quiz_questions as unknown as { id: string }[];
      return {
        id: row.id,
        title: row.title,
        subjectId: row.subject_id,
        subjectName: subject.name,
        subjectHue: subject.hue,
        questionsCount: questions?.length ?? 0,
        createdAt: row.created_at,
      };
    }),
    fiches: (fichesRaw ?? []).map((row) => {
      const content = row.content as unknown as import("./types").FicheContent;
      return {
        id: row.id,
        title: row.title,
        subjectName: subject.name,
        subjectHue: subject.hue,
        sectionsCount: content?.sections?.length ?? 0,
        createdAt: row.created_at,
      };
    }),
  };
}