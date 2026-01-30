import { GoogleGenAI } from "@google/genai";

interface Language {
  code: string;
  name: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "nl", name: "Dutch" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turkish" },
  { code: "pl", name: "Polish" },
  { code: "uk", name: "Ukrainian" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
];

function getApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return apiKey;
}

async function translate(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  const apiKey = getApiKey();
  const AI = new GoogleGenAI({ apiKey });

  const sourceLangName =
    SUPPORTED_LANGUAGES.find((l) => l.code === sourceLanguage)?.name ||
    sourceLanguage;
  const targetLangName =
    SUPPORTED_LANGUAGES.find((l) => l.code === targetLanguage)?.name ||
    targetLanguage;

  const prompt = `Translate the following text from ${sourceLangName} to ${targetLangName}. Only return the translated text, nothing else.

Text to translate: "${text}"`;

  const response = await AI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const translatedText = response.text;
  if (!translatedText) {
    throw new Error("Failed to generate translation");
  }

  return translatedText.trim();
}

async function detectLanguage(text: string): Promise<string> {
  const apiKey = getApiKey();
  const AI = new GoogleGenAI({ apiKey });

  const prompt = `Detect the language of the following text. Return only the ISO 639-1 language code (e.g., "en", "es", "fr").

Text: "${text}"`;

  const response = await AI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const detectedCode = response.text;
  if (!detectedCode) {
    throw new Error("Failed to detect language");
  }

  // Validate the detected language code
  const code = detectedCode.trim().toLowerCase();
  const isValid = SUPPORTED_LANGUAGES.some((l) => l.code === code);

  return isValid ? code : "unknown";
}

function getSupportedLanguages(): Language[] {
  return SUPPORTED_LANGUAGES;
}

export const translationService = {
  translate,
  detectLanguage,
  getSupportedLanguages,
};
