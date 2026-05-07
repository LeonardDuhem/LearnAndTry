import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";
import { getFiches } from "@/lib/queries";
import { subjectColor, subjectMix } from "@/lib/colors";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return "à l'instant";
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${days} jour${days > 1 ? "s" : ""}`;
}

export default async function FichesPage() {
  const fiches = await getFiches();

  return (
    <div>
      <header className="px-10 pt-7 pb-3">
        <div className="text-[11px] uppercase tracking-widest text-text-3 font-mono mb-1.5">
          LearnAndTry · Fiches
        </div>
        <h1 className="text-[28px] font-semibold tracking-tight m-0">Mes fiches</h1>
        <div className="text-[13.5px] text-text-2 mt-1.5">
          {fiches.length} fiche{fiches.length > 1 ? "s" : ""} générées
        </div>
      </header>

      <div className="border-b border-stroke-1 mx-10 mt-4" />

      <div className="px-10 py-6">
        {fiches.length === 0 ? (
          <div className="border border-dashed border-stroke-1 rounded-xl p-12 text-center">
            <BookOpen size={32} className="text-text-4 mx-auto mb-3" />
            <div className="text-[13px] text-text-2 mb-1">Aucune fiche pour l'instant</div>
            <div className="text-[12px] text-text-3 mb-4">
              Importe un cours pour générer ta première fiche automatiquement.
            </div>
            <Link
              href="/import"
              className="inline-flex items-center gap-2 h-9 px-3.5 rounded-md bg-bg-2 border border-stroke-1 hover:bg-bg-3 text-[13px] font-medium transition-colors"
            >
              Importer un cours
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3.5">
            {fiches.map((fiche) => {
              const color = subjectColor(fiche.subjectHue);
              return (
                <Link
                  key={fiche.id}
                  href={`/fiches/${fiche.id}`}
                  className="group flex flex-col gap-3 p-4 rounded-xl border transition-all hover:-translate-y-0.5"
                  style={{
                    background: subjectMix(fiche.subjectHue, 6),
                    borderColor: subjectMix(fiche.subjectHue, 20),
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="w-9 h-9 rounded-lg grid place-items-center"
                      style={{ background: subjectMix(fiche.subjectHue, 18), color }}
                    >
                      <BookOpen size={16} />
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-text-3">
                      <Clock size={11} /> {timeAgo(fiche.createdAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13.5px] font-medium text-text-1 leading-snug">
                      {fiche.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color }}>
                        {fiche.subjectName}
                      </span>
                      <span className="text-[11px] text-text-3">
                        · {fiche.sectionsCount} sections
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}