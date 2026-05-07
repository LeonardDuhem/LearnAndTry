"use client";

import { useState } from "react";
import { Check, X, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import type { QuizWithQuestions } from "@/lib/queries";
import { subjectColor, subjectMix } from "@/lib/colors";
import Link from "next/link";

export default function QuizPlayer({ quiz }: { quiz: QuizWithQuestions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = quiz.questions.length;
  const question = quiz.questions[currentIndex];
  const color = subjectColor(quiz.subjectHue);
  const progress = ((currentIndex + (revealed ? 1 : 0)) / total) * 100;

  function handleSelect(choiceIndex: number) {
    if (revealed) return;
    setSelected(choiceIndex);
  }

  function handleValidate() {
    if (selected === null) return;
    setRevealed(true);
    if (selected === question.correctIndex) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= total) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
  }

  // Écran de fin
  if (finished) {
    const percent = Math.round((score / total) * 100);
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <div className="w-16 h-16 rounded-2xl grid place-items-center mx-auto mb-4" style={{ background: subjectMix(quiz.subjectHue, 16), color }}>
          <Trophy size={32} />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mb-1">Quiz terminé !</h2>
        <div className="text-text-2 text-sm mb-6">{quiz.title}</div>

        <div className="text-5xl font-bold font-mono mb-2" style={{ color }}>
          {score}/{total}
        </div>
        <div className="text-text-3 text-sm mb-8">{percent}% de bonnes réponses</div>

        <div className="flex gap-3 justify-center">
          <button onClick={handleRestart} className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-bg-2 border border-stroke-1 hover:bg-bg-3 text-[13px] font-medium transition-colors">
            <RotateCcw size={14} /> Recommencer
          </button>
          <Link href="/" className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-text-1 text-bg-0 hover:bg-white text-[13px] font-medium transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header : progression */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] uppercase tracking-widest text-text-3 font-mono">
          Question {currentIndex + 1}/{total}
        </div>
        <div className="font-mono text-sm" style={{ color }}>
          {score} pt{score > 1 ? "s" : ""}
        </div>
      </div>
      <div className="h-1 bg-bg-2 rounded overflow-hidden mb-8">
        <div className="h-full rounded transition-all duration-300" style={{ width: `${progress}%`, background: color }} />
      </div>

      {/* Question */}
      <h2 className="text-lg font-semibold tracking-tight mb-6 leading-relaxed">
        {question.question}
      </h2>

      {/* Choix */}
      <div className="flex flex-col gap-2.5 mb-6">
        {question.choices.map((choice, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.correctIndex;

          let borderColor = "var(--stroke-1)";
          let bg = "var(--bg-1)";
          let textColor = "var(--text-1)";

          if (revealed) {
            if (isCorrect) {
              borderColor = "oklch(0.74 0.17 150)";
              bg = "color-mix(in oklab, oklch(0.74 0.17 150) 12%, var(--bg-1))";
            } else if (isSelected && !isCorrect) {
              borderColor = "oklch(0.70 0.19 25)";
              bg = "color-mix(in oklab, oklch(0.70 0.19 25) 12%, var(--bg-1))";
              textColor = "var(--text-2)";
            } else {
              textColor = "var(--text-3)";
            }
          } else if (isSelected) {
            borderColor = color;
            bg = subjectMix(quiz.subjectHue, 10);
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(i)}
              disabled={revealed}
              className="flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all text-[13.5px]"
              style={{ borderColor, background: bg, color: textColor }}
            >
              <div
                className="w-7 h-7 rounded-md grid place-items-center shrink-0 font-mono text-xs font-semibold"
                style={{
                  background: revealed && isCorrect
                    ? "oklch(0.74 0.17 150)"
                    : revealed && isSelected && !isCorrect
                    ? "oklch(0.70 0.19 25)"
                    : isSelected
                    ? color
                    : "var(--bg-2)",
                  color: (revealed && (isCorrect || isSelected)) || isSelected
                    ? "var(--bg-0)"
                    : "var(--text-2)",
                }}
              >
                {revealed && isCorrect ? <Check size={14} /> : revealed && isSelected ? <X size={14} /> : String.fromCharCode(65 + i)}
              </div>
              <span className="flex-1">{choice}</span>
            </button>
          );
        })}
      </div>

      {/* Explication (après validation) */}
      {revealed && question.explanation && (
        <div
          className="px-4 py-3 rounded-lg border text-[12.5px] leading-relaxed mb-6"
          style={{
            borderColor: "color-mix(in oklab, oklch(0.74 0.17 150) 30%, var(--stroke-1))",
            background: "color-mix(in oklab, oklch(0.74 0.17 150) 6%, var(--bg-1))",
          }}
        >
          <div className="font-medium text-[11px] uppercase tracking-wider mb-1" style={{ color: "oklch(0.74 0.17 150)" }}>
            Explication
          </div>
          <div className="text-text-2">{question.explanation}</div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex justify-end">
        {!revealed ? (
          <button
            onClick={handleValidate}
            disabled={selected === null}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-text-1 text-bg-0 hover:bg-white text-[13px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Valider
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-text-1 text-bg-0 hover:bg-white text-[13px] font-medium transition-colors"
          >
            {currentIndex + 1 >= total ? "Voir le résultat" : "Suivante"}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}