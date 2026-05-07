"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateQuiz, generateFiche } from "@/lib/ai";
import { extractTextFromPDF } from "@/lib/pdf";

export async function createImport(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non connecté.");

  const title = String(formData.get("title") ?? "").trim();
  const mode = String(formData.get("mode") ?? "");
  const importType = String(formData.get("importType") ?? "text"); // "text" | "pdf"

  if (!title) throw new Error("Le titre est obligatoire.");

  // 1. Récupérer le contenu selon le type d'import
  let content = "";
  let pdfStoragePath: string | null = null;

  if (importType === "pdf") {
    const file = formData.get("pdfFile") as File | null;
    if (!file || file.size === 0) throw new Error("Aucun fichier PDF sélectionné.");
    if (!file.name.toLowerCase().endsWith(".pdf")) throw new Error("Le fichier doit être un PDF.");

    // Extraire le texte
    content = await extractTextFromPDF(file);

    // Uploader le PDF dans Supabase Storage
    const fileName = `${user.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error: uploadError } = await supabase.storage
      .from("course-files")
      .upload(fileName, file, { contentType: "application/pdf" });

    if (!uploadError) {
      pdfStoragePath = fileName;
    } else {
      console.error("Erreur upload PDF:", uploadError);
      // On continue quand même — le texte est extrait, le stockage est bonus
    }
  } else {
    content = String(formData.get("content") ?? "").trim();
  }

  if (!content) throw new Error("Le contenu du cours est vide.");

  // 2. Récupérer ou créer la matière
  let subjectId: string;
  let subjectName: string;

  if (mode === "existing") {
    subjectId = String(formData.get("subjectId") ?? "");
    if (!subjectId) throw new Error("Aucune matière sélectionnée.");
    const { data: subject } = await supabase
      .from("subjects").select("name").eq("id", subjectId).single();
    subjectName = subject?.name ?? "Matière";
  } else {
    subjectName = String(formData.get("subjectName") ?? "").trim();
    const subjectHue = Number(formData.get("subjectHue") ?? 260);
    if (!subjectName) throw new Error("Nom de matière requis.");

    const { data: newSubject, error: subjectError } = await supabase
      .from("subjects")
      .insert({ name: subjectName, hue: subjectHue, user_id: user.id })
      .select("id").single();

    if (subjectError || !newSubject)
      throw new Error("Impossible de créer la matière : " + subjectError?.message);
    subjectId = newSubject.id;
  }

  // 3. Créer l'import
  const pagesCount = Math.max(1, Math.round(content.length / 2000));
  const { data: newImport, error: importError } = await supabase
    .from("course_imports")
    .insert({
      subject_id: subjectId,
      title,
      type: importType === "pdf" ? "pdf" : "text",
      content,
      pages_count: pagesCount,
      user_id: user.id,
      ...(pdfStoragePath && { pdf_path: pdfStoragePath }),
    })
    .select("id").single();

  if (importError || !newImport)
    throw new Error("Impossible de sauvegarder le cours : " + importError?.message);

  // 4. Génération IA en parallèle
  let quizId: string | null = null;
  let ficheId: string | null = null;

  try {
    const [questions, ficheContent] = await Promise.all([
      generateQuiz(content, subjectName),
      generateFiche(content, subjectName, title),
    ]);

    const { data: quiz } = await supabase
      .from("quizzes")
      .insert({ user_id: user.id, import_id: newImport.id, subject_id: subjectId, title: `QCM — ${title}` })
      .select("id").single();

    if (quiz) {
      quizId = quiz.id;
      await supabase.from("quiz_questions").insert(
        questions.map((q, i) => ({
          quiz_id: quiz.id,
          question: q.question,
          choices: q.choices,
          correct_index: q.correctIndex,
          explanation: q.explanation,
          sort_order: i,
        }))
      );
    }

    const { data: fiche } = await supabase
      .from("fiches")
      .insert({
        user_id: user.id,
        import_id: newImport.id,
        subject_id: subjectId,
        title: `Fiche — ${title}`,
        content: ficheContent,
      })
      .select("id").single();

    if (fiche) ficheId = fiche.id;

  } catch (err) {
    console.error("Erreur génération IA:", err);
    throw new Error(
      "Import sauvé, mais erreur de génération : " +
        (err instanceof Error ? err.message : String(err))
    );
  }

  revalidatePath("/");
  if (ficheId) {
    redirect(`/fiches/${ficheId}`);
  } else if (quizId) {
    redirect(`/qcm/${quizId}`);
  } else {
    redirect("/");
  }
}