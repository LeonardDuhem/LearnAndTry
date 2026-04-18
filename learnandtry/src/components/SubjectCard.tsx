import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import type { Subject } from "@/lib/types";
import { subjectColor, subjectMix } from "@/lib/colors";

interface SubjectCardProps {
  subject: Subject;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  const color = subjectColor(subject.hue);

  return (
    <Link
      href={`/matieres/${subject.id}`}
      className="group relative flex flex-col gap-3 p-[18px_18px_16px] rounded-xl overflow-hidden min-h-[170px] transition-all"
      style={{
        background: `linear-gradient(160deg, ${subjectMix(subject.hue, 10)} 0%, var(--bg-1) 55%)`,
        border: `1px solid ${subjectMix(subject.hue, 22)}`,
      }}
    >
      {/* Glow décoratif en coin */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(80% 60% at 100% 0%, ${subjectMix(subject.hue, 14)}, transparent 60%)`,
        }}
      />

      {/* Header : chip avec couleur + menu */}
      <div className="flex items-center justify-between relative">
        <div
          className="font-mono text-[10.5px] tracking-wider uppercase px-2 py-0.5 rounded border"
          style={{
            color,
            background: subjectMix(subject.hue, 14),
            borderColor: subjectMix(subject.hue, 22),
          }}
        >
          {subject.name.slice(0, 4).toUpperCase()}
        </div>
        <MoreHorizontal size={14} className="text-text-3" />
      </div>

      {/* Titre + méta */}
      <div className="flex-1 relative">
        <div className="text-base font-semibold tracking-tight text-text-1">
          {subject.name}
        </div>
        <div className="text-xs text-text-3 mt-0.5">
          {subject.chaptersCount} chapitres
        </div>
      </div>

      {/* Barre de progression */}
      <div className="relative">
        <div className="flex justify-between text-[11px] mb-1.5 text-text-2">
          <span>Maîtrise</span>
          <span className="font-mono" style={{ color }}>
            {subject.progress}%
          </span>
        </div>
        <div className="h-1 bg-bg-2 rounded overflow-hidden">
          <div
            className="h-full rounded"
            style={{ width: `${subject.progress}%`, background: color }}
          />
        </div>
      </div>

      {/* Footer : stats + dernière activité */}
      <div className="flex gap-3 text-[11px] text-text-3 font-mono relative">
        <span>{subject.cardsCount} fiches</span>
        <span>·</span>
        <span>{subject.quizzesCount} QCM</span>
        {subject.lastTouched && (
          <span className="ml-auto">{subject.lastTouched}</span>
        )}
      </div>
    </Link>
  );
}