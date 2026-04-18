"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Upload, FileQuestion, FileText, Calendar, BarChart3, Search } from "lucide-react";
import { MOCK_SUBJECTS } from "@/lib/mock-data";
import { subjectColor } from "@/lib/colors";

const nav = [
  { href: "/", label: "Accueil", icon: Home, badge: "⌘1" },
  { href: "/import", label: "Importer", icon: Upload, badge: "⌘2" },
  { href: "/qcm", label: "QCM en cours", icon: FileQuestion, badge: "⌘3" },
  { href: "/fiches", label: "Fiches", icon: FileText, badge: "⌘4" },
];

const space = [
  { href: "/planning", label: "Planning", icon: Calendar },
  { href: "/stats", label: "Statistiques", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[248px] shrink-0 h-screen sticky top-0 border-r border-stroke-1 bg-gradient-to-b from-[#0c0c0e] to-bg-0 flex flex-col p-[14px_10px] z-10">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2.5 px-2 py-1.5 mb-3.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[oklch(0.78_0.14_265)] to-[oklch(0.74_0.17_330)] grid place-items-center text-bg-0 font-mono font-bold text-sm shadow-[0_2px_10px_rgba(120,120,255,0.25)]">
          L
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight text-text-1">LearnAndTry</div>
          <div className="text-[10.5px] text-text-3 font-mono mt-px">RÉVISIONS</div>
        </div>
      </Link>

      {/* Search (placeholder, pas encore fonctionnel) */}
      <div className="flex items-center gap-2 h-8 px-2.5 mx-1 mb-3 bg-bg-1 border border-stroke-1 rounded-lg text-text-3 text-[12.5px] cursor-text">
        <Search size={13} />
        <span className="flex-1">Rechercher un cours…</span>
        <span className="font-mono font-medium text-[10px] text-text-2 bg-bg-2 border border-stroke-1 border-b-2 rounded px-1.5 py-0.5">⌘K</span>
      </div>

      {/* Navigation principale */}
      <div>
        {nav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 h-[30px] px-2.5 mx-1 my-px rounded-md text-[13px] transition-colors ${
                active
                  ? "bg-bg-2 text-text-1 font-medium"
                  : "text-text-2 hover:bg-bg-2 hover:text-text-1"
              }`}
            >
              <Icon size={15} />
              <span>{item.label}</span>
              <span className="ml-auto font-mono text-[10.5px] text-text-3">{item.badge}</span>
            </Link>
          );
        })}
      </div>

      {/* Section Matières */}
      <div className="flex justify-between items-center text-[10.5px] uppercase tracking-[0.08em] text-text-3 font-medium px-3 pt-3.5 pb-1.5">
        <span>Mes matières</span>
      </div>
      <div className="max-h-[260px] overflow-y-auto">
        {MOCK_SUBJECTS.map((s) => (
          <Link
            key={s.id}
            href={`/matieres/${s.id}`}
            className="flex items-center gap-2.5 h-7 px-2.5 mx-1 my-px rounded-md text-[12.5px] text-text-2 hover:bg-bg-2 hover:text-text-1 transition-colors"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                background: subjectColor(s.hue),
                boxShadow: `0 0 0 2px color-mix(in oklab, ${subjectColor(s.hue)} 20%, transparent)`,
              }}
            />
            <span className="flex-1 truncate">{s.name}</span>
            <span className="font-mono text-[10.5px] text-text-4">
              {s.chaptersCount}
            </span>
          </Link>
        ))}
      </div>

      {/* Section Espace */}
      <div className="text-[10.5px] uppercase tracking-[0.08em] text-text-3 font-medium px-3 pt-3.5 pb-1.5">
        Espace
      </div>
      {space.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 h-[28px] px-2.5 mx-1 my-px rounded-md text-[12.5px] transition-colors ${
              active
                ? "bg-bg-2 text-text-1"
                : "text-text-2 hover:bg-bg-2 hover:text-text-1"
            }`}
          >
            <Icon size={14} />
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* Footer user */}
      <div className="mt-auto pt-2.5 px-2 border-t border-stroke-1">
        <div className="flex items-center gap-2.5 p-2 rounded-md cursor-pointer hover:bg-bg-2">
          <div className="w-[26px] h-[26px] rounded-md bg-gradient-to-br from-[oklch(0.74_0.17_150)] to-[oklch(0.74_0.17_195)] grid place-items-center text-bg-0 font-mono font-bold text-[11px]">
            ?
          </div>
          <div>
            <div className="text-[12.5px] font-medium text-text-1">Non connecté</div>
            <div className="text-[10.5px] text-text-3">Se connecter</div>
          </div>
        </div>
      </div>
    </aside>
  );
}