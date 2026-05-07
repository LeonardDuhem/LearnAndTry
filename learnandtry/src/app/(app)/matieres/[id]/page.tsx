import { notFound } from "next/navigation";
import Link from "next/link";
import { FileText, FileQuestion, BookOpen, Upload, Type } from "lucide-react";
import { getSubjectDetail } from "@/lib/queries";
import { subjectColor, subjectMix } from "@/lib/colors";

const TYPE_ICONS = { pdf: FileText, text: Type, photo: FileText } as const;

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getSubjectDetail(id);

  if (!detail) return notFound();

  const { subject, imports, quizzes, fiches } = detail;
  const color = subjectColor(subject.hue);

  return (
    <div>
      {/* Header coloré */}
      <header
        className="px-10 pt-7 pb-5 border-b border-stroke-1"
        style={{
          background: `linear-gradient(135deg, ${subjectMix(subject.hue, 8)} 0%, transparent 60%)`,
        }}
      >
        <div
          className="text-[11px] uppercase tracking-widest font-mono mb-1.5"
          style={{ color }}
        >
          Matière
        </div>
        <h1 className="text-[28px] font-semibold tracking-tight m-0">
          {subject.name}
        </h1>
        <div className="flex items-center gap-4 mt-3 text-[12.5px] text-text-3 font-mono">
          <span>{imports.length} cours</span>
          <span>·</span>
          <span>{quizzes.length} QCM</span>
          <span>·</span>
          <span>{fiches.length} fiches</span>
        </div>
        <div className="mt-4">
          <Link
            href="/import"
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-md bg-bg-2 border border-stroke-1 hover:bg-bg-3 text-[13px] font-medium transition-colors"
          >
            <Upload size={13} /> Importer un cours dans cette matière
          </Link>
        </div>
      </header>

      <div className="px-10 py-6 flex flex-col gap-8">
        {/* Cours importés */}
        <section>
          <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-widest text-text-3 font-medium mb-3">
            <span>Cours importés</span>
            <div className="flex-1 h-px bg-stroke-1" />
            <span className="font-mono text-text-4">{imports.length}</span>
          </div>
          {imports.length === 0 ? (
            <div className="text-[12px] text-text-4 italic">Aucun cours pour l'instant.</div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {imports.map((imp) => {
                const Icon = TYPE_ICONS[imp.type] ?? FileText;
                return (
                  <div
                    key={imp.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-bg-1 border border-stroke-1"
                  >
                    <div
                      className="w-8 h-8 rounded-md grid place-items-center shrink-0"
                      style={{
                        background: subjectMix(subject.hue, 14),
                        color,
                      }}
                    >
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium truncate text-text-1">
                        {imp.title}
                      </div>
                      <div className="text-[11.5px] text-text-3">
                        {imp.type} · {imp.pagesCount} pages
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* QCM */}
        <section>
          <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-widest text-text-3 font-medium mb-3">
            <span>QCM générés</span>
            <div className="flex-1 h-px bg-stroke-1" />
            <span className="font-mono text-text-4">{quizzes.length}</span>
          </div>
          {quizzes.length === 0 ? (
            <div className="text-[12px] text-text-4 italic">Aucun QCM pour l'instant.</div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {quizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/qcm/${quiz.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-bg-1 border border-stroke-1 hover:bg-bg-2 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-md grid place-items-center shrink-0"
                    style={{ background: subjectMix(subject.hue, 14), color }}
                  >
                    <FileQuestion size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate text-text-1">
                      {quiz.title}
                    </div>
                    <div className="text-[11.5px] text-text-3">
                      {quiz.questionsCount} questions
                    </div>
                  </div>
                  <div
                    className="text-[11.5px] px-2 py-0.5 rounded font-mono"
                    style={{ color, background: subjectMix(subject.hue, 12) }}
                  >
                    Jouer →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Fiches */}
        <section>
          <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-widest text-text-3 font-medium mb-3">
            <span>Fiches de révision</span>
            <div className="flex-1 h-px bg-stroke-1" />
            <span className="font-mono text-text-4">{fiches.length}</span>
          </div>
          {fiches.length === 0 ? (
            <div className="text-[12px] text-text-4 italic">Aucune fiche pour l'instant.</div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {fiches.map((fiche) => (
                <Link
                  key={fiche.id}
                  href={`/fiches/${fiche.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-bg-1 border border-stroke-1 hover:bg-bg-2 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-md grid place-items-center shrink-0"
                    style={{ background: subjectMix(subject.hue, 14), color }}
                  >
                    <BookOpen size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate text-text-1">
                      {fiche.title}
                    </div>
                    <div className="text-[11.5px] text-text-3">
                      {fiche.sectionsCount} sections
                    </div>
                  </div>
                  <div
                    className="text-[11.5px] px-2 py-0.5 rounded font-mono"
                    style={{ color, background: subjectMix(subject.hue, 12) }}
                  >
                    Lire →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}