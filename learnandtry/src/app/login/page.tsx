import AuthForm from "@/components/AuthForm";
import { login } from "./actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="mb-8 text-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.78_0.14_265)] to-[oklch(0.74_0.17_330)] grid place-items-center text-bg-0 font-mono font-bold text-lg mx-auto mb-4">
          L
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">LearnAndTry</h1>
        <div className="text-[13px] text-text-3 mt-1">Connecte-toi pour continuer</div>
      </div>
      <AuthForm mode="login" action={login} />
    </div>
  );
}