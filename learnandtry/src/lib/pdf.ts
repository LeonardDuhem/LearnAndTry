import { extractText } from "unpdf";

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { text } = await extractText(buffer, { mergePages: true });

  const cleaned = text.trim();

  if (!cleaned || cleaned.length < 50) {
    throw new Error(
      "Le PDF semble vide ou ne contient pas de texte extractible. " +
      "Essaie un PDF avec du texte sélectionnable (pas une image scannée)."
    );
  }

  return cleaned.slice(0, 15000);
}