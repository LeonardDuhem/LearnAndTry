import Link from "next/link";
import { FileText, Type, Camera, Sparkles, ChevronRight } from "lucide-react";
import type { CourseImport, Subject } from "@/lib/types";
import { subjectColor, subjectMix } from "@/lib/colors";

// Map des icônes selon le type d'import
const TYPE_ICONS = {
  pdf: FileText,
  text: Type,
  photo: Camera,
} as const;

interface RecentImportRowProps {
  recent: CourseImport;
  subject: Subject;
  isFirst?: boolean;
}

export default function RecentImportRow({ recent, subject, isFirst }: RecentImportRowProps) {
  const Icon = TYPE_ICONS[recent.type];
  const color = subjectColor(subject.hue);

  return (
    <Link
      href={`/matieres/${subject.id}`}
      className={`grid items-center gap-3.5 px-3.5 py-2.5 hover:bg-bg-2 transition-colors ${
        isFirst ? "" : "border-t border-stroke-1"
      }`}
      style={{
        gridTemplateColumns: "32px 1fr 140px 120px 80px 20px",
      }}
    >
      {/* Icône colorée selon la matière */}
      <div
        className="w-7 h-7 rounded-md grid place-items-center"
        style={{
          background: subjectMix(subject.hue, 16),
          border: `1px solid ${subjectMix(subject.hue, 28)}`,
          color,
        }}
      >
        <Icon size={13} />
      </div>

      {/* Titre + sous-titre */}
      <div className="min-w-0">
        <div className="text-[13.5px] font-medium truncate text-text-1">
          {recent.title}
        </div>
        <div className="text-[11.5px] text-text-3">
          {subject.name} · {recent.pagesCount} pages
        </div>
      </div>

      {/* Chip du type */}
      <div>
        <span
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-2 py-1 rounded-full border"
          style={{
            color,
            borderColor: subjectMix(subject.hue, 22),
            background: subjectMix(subject.hue, 10),
          }}
        >
          {recent.type}
        </span>
      </div>

      {/* Stats générées */}
      <div className="text-[11.5px] text-text-3 font-mono flex items-center gap-1.5">
        <Sparkles size={11} />
        <span>24 QCM · 8 fiches</span>
      </div>

      {/* Date */}
      <div className="text-[11.5px] text-text-3">{recent.when}</div>

      {/* Chevron */}
      <ChevronRight size={14} className="text-text-4" />
    </Link>
  );
}