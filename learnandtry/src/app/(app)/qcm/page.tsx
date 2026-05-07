import Link from "next/link";
import { FileQuestion, Play, Clock } from "lucide-react";
import { getQuizzes } from "@/lib/queries";
import { subjectColor, subjectMix } from "@/lib/colors";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `il y a ${minutes} min`;
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${days} jour${days > 1 ? "s" : ""}`;
}

export default async function QcmPage() {
  const quizzes = await getQuizzes();

  return (
    <div>
      <header className="px-10 pt-7 pb-3">
        <div className="text-[11px] uppercase tracking-widest text-text-3 font-mono mb-1.5">
          LearnAndTry · QCM
        </div>
        <h1 className="text-[28px] font-semibold tracking-tight m-0">
          Mes QCM
        </h1>
        <div className="text-[13.5px] text-text-2 mt-1.5">
          {quizzes.length} quiz générés · clique pour rejouer
        </div>
      </header>

      <div className="border-b border-stroke-1 mx-10 mt-4" />

      <div className="px-10 py-6">
        {quizzes.length === 0 ? (
          <div className="border border-dashed border-stroke-1 rounded-xl p-12 text-center">
            <FileQuestion size={32} className="text-text-4 mx-auto mb-3" />
            <div className="text-[13px] text-text-2 mb-1">
              Aucun QCM pour l'instant
            </div>
            <div className="text-[12px] text-text-3 mb-4">
              Importe un cours pour générer ton premier QCM automatiquement.
            </div>
            <Link
              href="/import"
              className="inline-flex items-center gap-2 h-9 px-3.5 rounded-md bg-bg-2 border border-stroke-1 hover:bg-bg-3 text-[13px] font-medium transition-colors"
            >
              Importer un cours
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {quizzes.map((quiz) => {
              const color = subjectColor(quiz.subjectHue);
              return (
                <Link
                  key={quiz.id}
                  href={`/qcm/${quiz.id}`}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-stroke-1 bg-bg-1 hover:bg-bg-2 hover:border-stroke-2 transition-all"
                >
                  {/* Icône colorée */}
                  <div
                    className="w-10 h-10 rounded-lg grid place-items-center shrink-0"
                    style={{
                      background: subjectMix(quiz.subjectHue, 16),
                      color,
                    }}
                  >
                    <FileQuestion size={18} />
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-medium text-text-1 truncate">
                      {quiz.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-[11px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          color,
                          background: subjectMix(quiz.subjectHue, 12),
                        }}
                      >
                        {quiz.subjectName}
                      </span>
                      <span className="text-[11.5px] text-text-3">
                        {quiz.questionsCount} questions
                      </span>
                    </div>
                  </div>

                  {/* Date + bouton */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5 text-[11.5px] text-text-3">
                      <Clock size={12} />
                      {timeAgo(quiz.createdAt)}
                    </div>
                    <div
                      className="flex items-center gap-1.5 h-8 px-3 rounded-md text-[12.5px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: subjectMix(quiz.subjectHue, 16),
                        color,
                      }}
                    >
                      <Play size={12} /> Jouer
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