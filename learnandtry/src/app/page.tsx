import { Upload, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import SubjectCard from "@/components/SubjectCard";
import RecentImportRow from "@/components/RecentImportRow";
import { MOCK_SUBJECTS, MOCK_RECENT } from "@/lib/mock-data";
import { subjectColor } from "@/lib/colors";

export default function HomePage() {
  // Construit un index { id → matière } pour retrouver facilement la matière d'un import
  const subjectsById = Object.fromEntries(
    MOCK_SUBJECTS.map((s) => [s.id, s])
  );

  // Une matière "recommandée" pour le hero (la moins maîtrisée, par exemple)
  const recommended = [...MOCK_SUBJECTS].sort((a, b) => a.progress - b.progress)[0];

  return (
    <div>
      {/* Header */}
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
        {/* Hero : recommandation IA */}
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
              — ta maîtrise est à {recommended.progress}%.
            </div>
            <div className="text-[12.5px] text-text-2 mt-1.5">
              Session recommandée · {recommended.chaptersCount} chapitres à revoir.
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

        {/* Section matières */}
        <section>
          <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-widest text-text-3 font-medium mb-3">
            <span>Matières</span>
            <div className="flex-1 h-px bg-stroke-1" />
            <span className="font-mono text-text-4">{MOCK_SUBJECTS.length}</span>
          </div>
          <div className="grid grid-cols-4 gap-3.5">
            {MOCK_SUBJECTS.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </section>

        {/* Section imports récents */}
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
          <div className="border border-stroke-1 rounded-xl overflow-hidden bg-bg-1">
            {MOCK_RECENT.map((recent, i) => (
              <RecentImportRow
                key={recent.id}
                recent={recent}
                subject={subjectsById[recent.subjectId]}
                isFirst={i === 0}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}