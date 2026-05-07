"use client";

import { useState, useRef } from "react";
import { Sparkles, Plus, Check, Type, FileText, Upload } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { createImport } from "@/app/(app)/import/actions";
import { SUBJECT_PALETTE } from "@/lib/subject-palette";
import { subjectColor, subjectMix } from "@/lib/colors";
import type { Subject } from "@/lib/types";

interface ImportFormProps {
  subjects: Subject[];
}

type ImportType = "text" | "pdf";

export default function ImportForm({ subjects }: ImportFormProps) {
  const [importType, setImportType] = useState<ImportType>("text");
  const [mode, setMode] = useState<"existing" | "new">(
    subjects.length > 0 ? "existing" : "new"
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id ?? ""
  );
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectHue, setNewSubjectHue] = useState<number>(260);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      await createImport(formData);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="importType" value={importType} />

      {/* ==== SECTION 0 : Type d'import ==== */}
      <section>
        <label className="text-[11px] uppercase tracking-widest text-text-3 font-medium mb-2.5 block">
          Type d'import
        </label>
        <div className="inline-flex bg-bg-1 border border-stroke-1 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setImportType("text")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[12.5px] transition-colors ${
              importType === "text"
                ? "bg-bg-3 text-text-1"
                : "text-text-2 hover:text-text-1"
            }`}
          >
            <Type size={13} /> Texte
          </button>
          <button
            type="button"
            onClick={() => setImportType("pdf")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[12.5px] transition-colors ${
              importType === "pdf"
                ? "bg-bg-3 text-text-1"
                : "text-text-2 hover:text-text-1"
            }`}
          >
            <FileText size={13} /> PDF
          </button>
        </div>
      </section>

      {/* ==== SECTION 1 : Matière ==== */}
      <section>
        <label className="text-[11px] uppercase tracking-widest text-text-3 font-medium mb-2.5 block">
          Matière
        </label>
        <div className="inline-flex bg-bg-1 border border-stroke-1 rounded-lg p-1 mb-3">
          <button
            type="button"
            onClick={() => setMode("existing")}
            disabled={subjects.length === 0}
            className={`px-3 py-1.5 rounded-md text-[12.5px] transition-colors ${
              mode === "existing"
                ? "bg-bg-3 text-text-1"
                : "text-text-2 hover:text-text-1 disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
          >
            Matière existante
          </button>
          <button
            type="button"
            onClick={() => setMode("new")}
            className={`px-3 py-1.5 rounded-md text-[12.5px] transition-colors flex items-center gap-1.5 ${
              mode === "new" ? "bg-bg-3 text-text-1" : "text-text-2 hover:text-text-1"
            }`}
          >
            <Plus size={13} /> Nouvelle matière
          </button>
        </div>

        {mode === "existing" && (
          <>
            <input type="hidden" name="subjectId" value={selectedSubjectId} />
            <div className="grid grid-cols-4 gap-2">
              {subjects.map((s) => {
                const active = selectedSubjectId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSubjectId(s.id)}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg border transition-all text-left"
                    style={{
                      background: active ? subjectMix(s.hue, 14) : "var(--bg-1)",
                      borderColor: active ? subjectMix(s.hue, 45) : "var(--stroke-1)",
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: subjectColor(s.hue) }}
                    />
                    <span className="text-[13px] truncate text-text-1">{s.name}</span>
                    {active && (
                      <Check size={13} className="ml-auto" style={{ color: subjectColor(s.hue) }} />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {mode === "new" && (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              name="subjectName"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="Ex : Mathématiques, SVT…"
              required
              className="h-10 px-3 bg-bg-1 border border-stroke-1 rounded-lg text-[13px] text-text-1 placeholder:text-text-4 focus:border-stroke-2 focus:outline-none"
            />
            <input type="hidden" name="subjectHue" value={newSubjectHue} />
            <div>
              <div className="text-[11px] text-text-3 mb-2">Couleur</div>
              <div className="flex gap-2 flex-wrap">
                {SUBJECT_PALETTE.map((c) => {
                  const active = newSubjectHue === c.hue;
                  return (
                    <button
                      key={c.hue}
                      type="button"
                      onClick={() => setNewSubjectHue(c.hue)}
                      title={c.name}
                      className="w-8 h-8 rounded-lg grid place-items-center transition-all"
                      style={{
                        background: subjectMix(c.hue, 22),
                        border: `1.5px solid ${active ? subjectColor(c.hue) : subjectMix(c.hue, 22)}`,
                      }}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ background: subjectColor(c.hue) }} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ==== SECTION 2 : Cours ==== */}
      <section className="flex flex-col gap-3">
        <label className="text-[11px] uppercase tracking-widest text-text-3 font-medium block">
          Cours
        </label>

        <input
          type="text"
          name="title"
          placeholder="Titre (ex : Chapitre 4 — Les dérivées)"
          required
          className="h-10 px-3 bg-bg-1 border border-stroke-1 rounded-lg text-[13px] text-text-1 placeholder:text-text-4 focus:border-stroke-2 focus:outline-none"
        />

        {/* Zone texte */}
        {importType === "text" && (
          <textarea
            name="content"
            placeholder="Colle ici le contenu de ton cours…"
            required
            rows={10}
            className="px-3 py-2.5 bg-bg-1 border border-stroke-1 rounded-lg text-[13px] text-text-1 placeholder:text-text-4 focus:border-stroke-2 focus:outline-none resize-y font-mono leading-relaxed"
          />
        )}

        {/* Zone PDF */}
        {importType === "pdf" && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              name="pdfFile"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 p-10 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                pdfFile
                  ? "border-stroke-2 bg-bg-2"
                  : "border-stroke-1 bg-bg-1 hover:border-stroke-2 hover:bg-bg-2"
              }`}
            >
              {pdfFile ? (
                <>
                  <FileText size={28} className="text-text-2" />
                  <div className="text-center">
                    <div className="text-[13.5px] font-medium text-text-1">
                      {pdfFile.name}
                    </div>
                    <div className="text-[12px] text-text-3 mt-0.5">
                      {(pdfFile.size / 1024).toFixed(0)} Ko · clique pour changer
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={28} className="text-text-3" />
                  <div className="text-center">
                    <div className="text-[13.5px] text-text-2">
                      Clique pour sélectionner un PDF
                    </div>
                    <div className="text-[12px] text-text-3 mt-0.5">
                      PDF avec texte sélectionnable uniquement · max ~15 000 mots
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {error && (
        <div className="px-3 py-2 rounded-md border border-danger/30 bg-danger/10 text-[12.5px] text-danger">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending || (importType === "pdf" && !pdfFile)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-text-1 text-bg-0 border border-text-1 hover:bg-white text-[13px] font-medium transition-colors disabled:opacity-60 disabled:cursor-wait"
        >
          <Sparkles size={14} />
          {pending ? "Import en cours…" : "Importer le cours"}
        </button>
      </div>
    </form>
  );
}