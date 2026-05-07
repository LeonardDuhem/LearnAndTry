import { notFound } from "next/navigation";
import { getFiche } from "@/lib/queries";
import FicheViewer from "@/components/FicheViewer";
import { createClient } from "@/lib/supabase/server";

export default async function FichePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fiche = await getFiche(id);
  if (!fiche) return notFound();

  // Cherche un QCM lié au même import pour le bouton "Lancer le QCM"
  const supabase = await createClient();
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id")
    .eq("import_id", fiche.content as unknown as string)
    .single();

  // On récupère le quiz_id lié au même import
  const { data: ficheRow } = await supabase
    .from("fiches")
    .select("import_id")
    .eq("id", id)
    .single();

  const { data: linkedQuiz } = ficheRow
    ? await supabase
        .from("quizzes")
        .select("id")
        .eq("import_id", ficheRow.import_id)
        .single()
    : { data: null };

  return <FicheViewer fiche={fiche} quizId={linkedQuiz?.id} />;
}