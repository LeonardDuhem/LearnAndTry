"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown, ChevronRight, Sparkles,
  AlertTriangle, Info, X
} from "lucide-react";
import type { Fiche, FicheSection } from "@/lib/types";
import { subjectColor, subjectMix } from "@/lib/colors";

// ─── Flashcard recto/verso avec flip CSS ───────────────────────────────────
function Flashcard({ front, back, color }: { front: string; back: string; color: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      className="cursor-pointer"
      style={{ perspective: 1000, height: 130 }}
    >
      <div
        style={{
          position: "relative", width: "100%", height: "100%",
          transition: "transform .5s",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "none",
        }}
      >
        {/* Recto */}
        <div
          className="absolute inset-0 grid place-items-center p-4 rounded-xl text-[13.5px] text-center"
          style={{
            backfaceVisibility: "hidden",
            background: "var(--bg-1)",
            border: "1px solid var(--stroke-1)",
            color: "var(--text-1)",
          }}
        >
          {front}
        </div>
        {/* Verso */}
        <div
          className="absolute inset-0 grid place-items-center p-4 rounded-xl text-[13.5px] text-center font-medium"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `color-mix(in oklab, ${color} 14%, var(--bg-2))`,
            border: `1px solid color-mix(in oklab, ${color} 30%, var(--stroke-1))`,
            color,
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}

// ─── Section collapsible ───────────────────────────────────────────────────
function Section({ section, index, color }: { section: FicheSection; index: number; color: string }) {
  const [open, setOpen] = useState(true);

  const kindLabel: Record<string, string> = {
    text: "texte",
    list: `${(section as { items?: unknown[] }).items?.length ?? 0} éléments`,
    table: `${((section as { rows?: unknown[][] }).rows?.length ?? 1) - 1} lignes`,
    callouts: `${(section as { items?: unknown[] }).items?.length ?? 0} points`,
    flashcards: `${(section as { cards?: unknown[] }).cards?.length ?? 0} cartes`,
  };

  return (
    <section className="border-t border-stroke-1">
      {/* En-tête cliquable */}
      <div
        className="flex items-center gap-3 py-[18px] cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        {open
          ? <ChevronDown size={14} className="text-text-3 shrink-0" />
          : <ChevronRight size={14} className="text-text-3 shrink-0" />}
        <span className="font-mono text-[11px] tracking-wider w-7" style={{ color }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-[19px] font-semibold tracking-tight flex-1">
          {section.title}
        </span>
        <span className="text-[11px] text-text-3 font-mono">
          {kindLabel[section.kind]}
        </span>
      </div>

      {/* Contenu */}
      {open && (
        <div className="pb-6 pl-10 text-[14.5px] leading-[1.7] text-text-1">

          {/* Texte */}
          {section.kind === "text" && (
            <p className="m-0">{section.body}</p>
          )}

          {/* Liste formules */}
          {section.kind === "list" && (
            <div>
              {section.items.map(([name, value], i) => (
                <div
                  key={i}
                  className="grid gap-5 py-2.5"
                  style={{
                    gridTemplateColumns: "140px 1fr",
                    borderBottom: "1px dashed var(--stroke-1)",
                  }}
                >
                  <div className="text-[13px] text-text-2 font-medium">{name}</div>
                  <div className="font-mono text-[14px] text-text-1">{value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tableau */}
          {section.kind === "table" && (
            <div className="rounded-xl overflow-hidden border border-stroke-1">
              <table className="w-full border-collapse bg-bg-1">
                <tbody>
                  {section.rows.map((row, i) => (
                    <tr key={i} style={{ background: i === 0 ? "var(--bg-2)" : "transparent" }}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className="px-3.5 py-2.5 font-mono text-[13.5px]"
                          style={{
                            borderBottom: i < section.rows.length - 1 ? "1px solid var(--stroke-1)" : "none",
                            borderRight: j < row.length - 1 ? "1px solid var(--stroke-1)" : "none",
                            color: i === 0 ? "var(--text-3)" : "var(--text-1)",
                            textTransform: i === 0 ? "uppercase" : "none",
                            letterSpacing: i === 0 ? "0.06em" : 0,
                            fontSize: i === 0 ? 11 : 13.5,
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Callouts */}
          {section.kind === "callouts" && (
            <div className="flex flex-col gap-2">
              {section.items.map((item, i) => {
                const toneColor = {
                  danger: "oklch(0.70 0.19 25)",
                  warn: "oklch(0.78 0.15 80)",
                  info: "oklch(0.74 0.17 260)",
                }[item.tone];
                const ToneIcon = item.tone === "danger" ? X : item.tone === "warn" ? AlertTriangle : Info;
                return (
                  <div
                    key={i}
                    className="grid gap-3 p-3.5 rounded-xl text-[13.5px]"
                    style={{
                      gridTemplateColumns: "22px 1fr",
                      background: `color-mix(in oklab, ${toneColor} 8%, var(--bg-1))`,
                      border: `1px solid color-mix(in oklab, ${toneColor} 22%, var(--stroke-1))`,
                    }}
                  >
                    <ToneIcon size={14} style={{ color: toneColor, marginTop: 2 }} />
                    <div>{item.text}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Flashcards */}
          {section.kind === "flashcards" && (
            <div className="grid grid-cols-3 gap-3">
              {section.cards.map(([front, back], i) => (
                <Flashcard key={i} front={front} back={back} color={color} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────
export default function FicheViewer({ fiche, quizId }: { fiche: Fiche; quizId?: string }) {
  const [activeSection, setActiveSection] = useState(
    fiche.content.sections[0]?.id ?? ""
  );
  const color = subjectColor(fiche.subjectHue);

  return (
    <div>
      {/* Topbar sticky */}
      <div className="sticky top-0 z-10 bg-bg-0 border-b border-stroke-1 px-10 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 text-[12px] text-text-3 font-mono">
          <Link href="/" className="hover:text-text-1 transition-colors">Accueil</Link>
          <ChevronRight size={12} />
          <span style={{ color }}>{fiche.subjectName}</span>
          <ChevronRight size={12} />
          <span className="text-text-2">{fiche.title}</span>
        </div>
        <div className="flex-1" />
        {quizId && (
          <Link
            href={`/qcm/${quizId}`}
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-md text-bg-0 text-[13px] font-medium transition-colors"
            style={{ background: color, borderColor: color }}
          >
            <Sparkles size={13} /> Réviser avec QCM
          </Link>
        )}
      </div>

      {/* Layout principal : article + TOC */}
      <div
        className="grid gap-10 px-10 py-8 mx-auto"
        style={{ gridTemplateColumns: "1fr 260px", maxWidth: 1200 }}
      >
        {/* Article */}
        <article>
          {/* Hero */}
          <div className="pb-6 border-b border-stroke-1 mb-5">
            <div
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-mono px-2.5 py-1 rounded-full border mb-3"
              style={{
                color,
                background: `color-mix(in oklab, ${color} 12%, transparent)`,
                borderColor: `color-mix(in oklab, ${color} 24%, transparent)`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: color }}
              />
              {fiche.subjectName}
            </div>
            <h1 className="text-[36px] font-semibold tracking-[-0.025em] leading-[1.15] my-3.5">
              {fiche.title}
            </h1>
            <div className="flex items-center gap-3.5 text-[12.5px] text-text-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} style={{ color }} />
                {fiche.content.readTime}
              </span>
              <span>·</span>
              <span>{fiche.content.sections.length} sections</span>
              <span>·</span>
              <span>
                Généré à partir de{" "}
                <span className="text-text-2">{fiche.importTitle}</span>
              </span>
            </div>

            {/* Résumé IA */}
            <div
              className="mt-4 p-4 rounded-xl text-[13.5px] leading-[1.6]"
              style={{
                background: `color-mix(in oklab, ${color} 6%, var(--bg-1))`,
                border: `1px solid color-mix(in oklab, ${color} 18%, var(--stroke-1))`,
              }}
            >
              <div
                className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-mono mb-2"
                style={{ color }}
              >
                <Sparkles size={12} /> Résumé en 3 points
              </div>
              <ul className="m-0 pl-5 text-text-1 flex flex-col gap-1">
                {fiche.content.summary.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sections */}
          {fiche.content.sections.map((section, i) => (
            <Section
              key={section.id}
              section={section}
              index={i}
              color={color}
            />
          ))}

          {/* Call-to-action bas de page */}
          <div className="mt-10 p-6 bg-bg-1 border border-stroke-1 rounded-2xl text-center">
            <div
              className="text-[11px] uppercase tracking-widest font-mono mb-1.5"
              style={{ color }}
            >
              Teste-toi maintenant
            </div>
            <div className="text-[18px] font-semibold tracking-tight mb-1.5">
              Prêt·e pour le QCM ?
            </div>
            <div className="text-[13px] text-text-2 mb-4">
              Questions générées à partir de cette fiche · ~8 minutes.
            </div>
            {quizId ? (
              <Link
                href={`/qcm/${quizId}`}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-md text-bg-0 text-[13px] font-medium"
                style={{ background: color }}
              >
                <Sparkles size={14} /> Lancer le QCM
              </Link>
            ) : (
              <Link
                href="/import"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-bg-2 border border-stroke-1 hover:bg-bg-3 text-[13px] font-medium transition-colors"
              >
                Importer un cours pour générer le QCM
              </Link>
            )}
          </div>
        </article>

        {/* TOC sticky */}
        <aside className="py-2" style={{ position: "sticky", top: 84, alignSelf: "start" }}>
          <div className="text-[10.5px] uppercase tracking-widest text-text-3 font-mono mb-2.5">
            Sommaire
          </div>
          <div className="flex flex-col gap-0.5">
            {fiche.content.sections.map((section, i) => {
              const active = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left text-[12.5px] transition-colors"
                  style={{
                    color: active ? "var(--text-1)" : "var(--text-2)",
                    background: active ? "var(--bg-2)" : "transparent",
                    borderLeft: `2px solid ${active ? "var(--text-1)" : "transparent"}`,
                  }}
                >
                  <span className="font-mono text-[11px] text-text-4 w-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 truncate">{section.title}</span>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}