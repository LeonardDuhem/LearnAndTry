import { Upload, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import SubjectCard from "@/components/SubjectCard";
import RecentImportRow from "@/components/RecentImportRow";
import { getSubjects, getRecentImports } from "@/lib/queries";
import { subjectColor } from "@/lib/colors";

export default async function HomePage() {
  // Fetch en parallèle — Promise.all = les 2 requêtes partent en même temps
  const [subjects, recent] = await Promise.all([
    getSubjects(),
    getRecentImports(5),
  ]);

  const subjectsById = Object.fromEntries(subjects.map((s) => [s.id, s]));
  const recommended = subjects.length > 0 ? subjects[0] : null;

  return (
    <div>
      <header className="px-10 pt-7 pb-3 flex items-end justify-between gap-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-text-3 font-mono mb-1.5">
            LearnAndTry
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight m-0">
            Bonsoir.
          </h1>
          <div className="text-[13.5px] text-text-2 mt-1.5">
            Prêt·e à réviser ? Importe un cours ou reprends là où tu t'étais arrêté·e.
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/import"
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-md bg-bg-2 border border-stroke-1 hover:bg-bg-3 hover:border-stroke-2 text-[13px] font-medium transition-colors"
          >
            <Upload size={14} /> Importer un cours
          </Link>
          <Link
            href="/qcm"
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-md bg-text-1 text-bg-0 border border-text-1 hover:bg-white text-[13px] font-medium transition-colors"
          >
            <Sparkles size={14} /> Lancer une révision
          </Link>
        </div>
      </header>

      <div className="border-b border-stroke-1 mx-10 mt-4" />

      <div className="px-10 py-6">
        {/* Hero affiché seulement s'il y a une matière */}
        {recommended && (
          <div
            className="mb-7 p-[22px_26px] rounded-xl border border-stroke-1 flex items-center gap-7"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--accent) 10%, var(--bg-1)) 0%, var(--bg-1) 60%)",
            }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-text-3 font-mono mb-2">
                <Sparkles size={12} /> Recommandation IA
              </div>
              <div className="text-[19px] font-semibold tracking-tight leading-snug text-text-1">
                Reprends{" "}
                <span style={{ color: subjectColor(recommended.hue) }}>
                  {recommended.name}
                </span>{" "}
                — c'est le moment de t'y remettre.
              </div>
              <div className="text-[12.5px] text-text-2 mt-1.5">
                Lance une session de révision personnalisée.
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/qcm"
                className="inline-flex items-center gap-2 h-10 px-3.5 rounded-md bg-text-1 text-bg-0 border border-text-1 hover:bg-white text-[13px] font-medium transition-colors"
              >
                <Sparkles size={14} /> Démarrer la session
              </Link>
              <Link
                href="/fiches"
                className="inline-flex items-center gap-2 h-10 px-3.5 rounded-md bg-bg-2 border border-stroke-1 hover:bg-bg-3 text-[13px] font-medium transition-colors"
              >
                Voir les fiches <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* Matières */}
        <section>
          <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-widest text-text-3 font-medium mb-3">
            <span>Matières</span>
            <div className="flex-1 h-px bg-stroke-1" />
            <span className="font-mono text-text-4">{subjects.length}</span>
          </div>
          {subjects.length === 0 ? (
            <div className="border border-dashed border-stroke-1 rounded-xl p-10 text-center">
              <div className="text-[13px] text-text-2 mb-1">Aucune matière pour l'instant</div>
              <div className="text-[12px] text-text-3">Importe ton premier cours pour créer une matière.</div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3.5">
              {subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          )}
        </section>

        {/* Imports récents */}
        <section className="mt-9">
          <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-widest text-text-3 font-medium mb-3">
            <span>Imports récents</span>
            <div className="flex-1 h-px bg-stroke-1" />
            <Link
              href="/import"
              className="text-text-2 text-[11px] normal-case tracking-normal hover:text-text-1"
            >
              Tout voir →
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="border border-dashed border-stroke-1 rounded-xl p-8 text-center">
              <div className="text-[13px] text-text-2 mb-1">Aucun import encore</div>
              <div className="text-[12px] text-text-3">Tes imports récents apparaîtront ici.</div>
            </div>
          ) : (
            <div className="border border-stroke-1 rounded-xl overflow-hidden bg-bg-1">
              {recent.map((r, i) => {
                const subject = subjectsById[r.subjectId];
                if (!subject) return null;
                return (
                  <RecentImportRow
                    key={r.id}
                    recent={r}
                    subject={subject}
                    isFirst={i === 0}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}