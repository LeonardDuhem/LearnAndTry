import ImportForm from "@/components/ImportForm";
import { getSubjects } from "@/lib/queries";

export default async function ImportPage() {
  const subjects = await getSubjects();

  return (
    <div>
      <header className="px-10 pt-7 pb-3">
        <div className="text-[11px] uppercase tracking-widest text-text-3 font-mono mb-1.5">
          LearnAndTry · Import
        </div>
        <h1 className="text-[28px] font-semibold tracking-tight m-0">
          Importer un cours
        </h1>
        <div className="text-[13.5px] text-text-2 mt-1.5">
          Colle le contenu de ton cours. Tu pourras ajouter des PDF et des photos plus tard.
        </div>
      </header>

      <div className="border-b border-stroke-1 mx-10 mt-4" />

      <div className="px-10 py-6 max-w-3xl">
        <ImportForm subjects={subjects} />
      </div>
    </div>
  );
}