import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface GeneratedQuestion {
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export async function generateQuiz(
  courseContent: string,
  subjectName: string,
  numberOfQuestions = 8
): Promise<GeneratedQuestion[]> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: `Tu es un professeur expert en ${subjectName}. À partir du cours suivant, génère exactement ${numberOfQuestions} questions de QCM.

RÈGLES :
- Chaque question a exactement 4 choix (A, B, C, D)
- Une seule bonne réponse par question
- Les questions doivent couvrir les points clés du cours
- Les mauvaises réponses doivent être plausibles
- Fournis une explication courte pour chaque bonne réponse
- Varie la difficulté (facile, moyen, difficile)

COURS :
${courseContent}

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ou après, sans backticks. Format :
[
  {
    "question": "...",
    "choices": ["choix A", "choix B", "choix C", "choix D"],
    "correctIndex": 0,
    "explanation": "..."
  }
]`,
  });

  const raw = (response.text ?? "")
    .replace(/^```json\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("La réponse n'est pas un tableau");

  return parsed.map((q: Record<string, unknown>) => ({
    question: String(q.question ?? ""),
    choices: (q.choices as string[]) ?? [],
    correctIndex: Number(q.correctIndex ?? 0),
    explanation: String(q.explanation ?? ""),
  }));
}

export async function generateFiche(
  courseContent: string,
  subjectName: string,
  courseTitle: string
): Promise<import("./types").FicheContent> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: `Tu es un professeur expert en ${subjectName}. À partir du cours suivant, génère une fiche de révision structurée.

COURS : "${courseTitle}"
${courseContent}

Génère un JSON avec cette structure exacte (sans backticks, sans texte autour) :
{
  "summary": ["point clé 1", "point clé 2", "point clé 3"],
  "readTime": "X min de lecture",
  "sections": [
    {
      "id": "s1",
      "title": "Titre de la section",
      "kind": "text",
      "body": "Paragraphe explicatif de cette notion..."
    },
    {
      "id": "s2",
      "title": "Formules clés",
      "kind": "list",
      "items": [["Nom de la formule", "f(x) = ..."], ["Autre formule", "..."]]
    },
    {
      "id": "s3",
      "title": "Comparatif / Tableau",
      "kind": "table",
      "rows": [["Colonne A", "Colonne B", "Colonne C"], ["val1", "val2", "val3"]]
    },
    {
      "id": "s4",
      "title": "Points de vigilance",
      "kind": "callouts",
      "items": [
        {"tone": "danger", "text": "Erreur fréquente à éviter..."},
        {"tone": "warn", "text": "Attention à..."},
        {"tone": "info", "text": "À retenir..."}
      ]
    },
    {
      "id": "s5",
      "title": "Flashcards",
      "kind": "flashcards",
      "cards": [["Question recto", "Réponse verso"], ["Notion", "Définition"]]
    }
  ]
}

RÈGLES :
- Génère 4 à 6 sections au total
- Varie les types (pas que du texte)
- summary = exactement 3 phrases courtes et percutantes
- Utilise les types les plus adaptés au contenu du cours
- Les sections "list" sont pour les formules, règles, propriétés
- Les sections "callouts" pour les pièges classiques ou points importants
- Les sections "flashcards" pour les définitions à mémoriser (4-6 cartes max)
- Réponds UNIQUEMENT avec le JSON, aucun texte avant ou après`,
  });

  const raw = (response.text ?? "")
    .replace(/^```json\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const parsed = JSON.parse(raw);
  return parsed as import("./types").FicheContent;
}