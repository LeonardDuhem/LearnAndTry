"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";

interface AuthFormProps {
  mode: "login" | "signup";
  action: (formData: FormData) => Promise<void>;
}

export default function AuthForm({ mode, action }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      await action(formData);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] uppercase tracking-widest text-text-3 font-medium">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="h-10 px-3 bg-bg-1 border border-stroke-1 rounded-lg text-[13px] text-text-1 placeholder:text-text-4 focus:border-stroke-2 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] uppercase tracking-widest text-text-3 font-medium">
          Mot de passe
        </label>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="h-10 px-3 bg-bg-1 border border-stroke-1 rounded-lg text-[13px] text-text-1 placeholder:text-text-4 focus:border-stroke-2 focus:outline-none"
        />
      </div>

      {error && (
        <div className="px-3 py-2 rounded-md border border-danger/30 bg-danger/10 text-[12.5px] text-danger">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-text-1 text-bg-0 border border-text-1 hover:bg-white text-[13px] font-medium transition-colors disabled:opacity-60 disabled:cursor-wait"
      >
        <Sparkles size={14} />
        {pending
          ? "Connexion…"
          : mode === "login"
          ? "Se connecter"
          : "Créer mon compte"}
      </button>

      <div className="text-[12px] text-text-3 text-center">
        {mode === "login" ? (
          <>
            Pas encore de compte ?{" "}
            <Link href="/signup" className="text-text-1 hover:underline">
              Créer un compte
            </Link>
          </>
        ) : (
          <>
            Déjà un compte ?{" "}
            <Link href="/login" className="text-text-1 hover:underline">
              Se connecter
            </Link>
          </>
        )}
      </div>
    </form>
  );
}