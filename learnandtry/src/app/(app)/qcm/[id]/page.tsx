import { notFound } from "next/navigation";
import QuizPlayer from "@/components/QuizPlayer";
import { getQuiz } from "@/lib/queries";
import { subjectColor } from "@/lib/colors";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quiz = await getQuiz(id);

  if (!quiz) return notFound();

  return (
    <div>
      <header className="px-10 pt-7 pb-3">
        <div className="text-[11px] uppercase tracking-widest text-text-3 font-mono mb-1.5">
          LearnAndTry · QCM
        </div>
        <h1 className="text-[28px] font-semibold tracking-tight m-0">
          {quiz.title}
        </h1>
        <div className="text-[13.5px] mt-1.5" style={{ color: subjectColor(quiz.subjectHue) }}>
          {quiz.subjectName} · {quiz.questions.length} questions
        </div>
      </header>

      <div className="border-b border-stroke-1 mx-10 mt-4" />

      <div className="px-10 py-6">
        <QuizPlayer quiz={quiz} />
      </div>
    </div>
  );
}