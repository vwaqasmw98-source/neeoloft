/**
 * Browser-side voice utilities — wraps Web Speech API.
 *
 * Provides:
 *  - startListening(onResult, onError): Speech-to-text in user's language
 *  - speak(text, lang): Text-to-speech, auto-detected language
 *  - detectLanguage(text): lightweight client-side language guess
 *  - isVoiceSupported(): feature detection
 *
 * Browsers supported (Web Speech API):
 *  - Chrome / Edge / Opera: full support (STT + TTS)
 *  - Safari: TTS only (no STT)
 *  - Firefox: neither (UI still works in text mode)
 */

export type VoiceLang = 'en' | 'ur' | 'hi' | 'ar' | 'es' | 'fr' | 'de' | 'zh' | 'pt' | 'ru' | 'tr' | 'id' | 'ja' | 'ko' | 'unknown';

const LANG_BCP: Record<VoiceLang, string> = {
  en: 'en-US',
  ur: 'ur-PK',
  hi: 'hi-IN',
  ar: 'ar-SA',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  zh: 'zh-CN',
  pt: 'pt-BR',
  ru: 'ru-RU',
  tr: 'tr-TR',
  id: 'id-ID',
  ja: 'ja-JP',
  ko: 'ko-KR',
  unknown: 'en-US',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

export function isVoiceSupported(): { stt: boolean; tts: boolean } {
  if (typeof window === 'undefined') return { stt: false, tts: false };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
  return {
    stt: Boolean(SpeechRecognition),
    tts: Boolean(w.speechSynthesis),
  };
}

/**
 * Lightweight language guess from a text sample.
 * Used to pick the right TTS voice when the user replies in their native language.
 */
export function detectLanguage(text: string): VoiceLang {
  if (!text) return 'unknown';
  const t = text.trim();

  // Urdu / Arabic script
  if (/[\u0600-\u06FF]/.test(t)) {
    // Urdu-specific letters (ڑ، ٹ، ہ، ی، ے) - rough heuristic
    if (/[ٹڈڑہیے]/.test(t)) return 'ur';
    return 'ar';
  }
  // Devanagari (Hindi)
  if (/[\u0900-\u097F]/.test(t)) return 'hi';
  // CJK
  if (/[\u4E00-\u9FFF]/.test(t)) return 'zh';
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(t)) return 'ja';
  if (/[\uAC00-\uD7AF]/.test(t)) return 'ko';
  // Cyrillic
  if (/[\u0400-\u04FF]/.test(t)) return 'ru';

  // Latin-script heuristics
  const lower = t.toLowerCase();
  // Common English words
  if (/\b(the|is|are|i want|i need|please|hello|hi|thanks|how|what|can you|do you)\b/.test(lower)) return 'en';
  // Common Spanish
  if (/\b(hola|gracias|quiero|necesito|por favor|cómo|qué)\b/.test(lower)) return 'es';
  // French
  if (/\b(bonjour|merci|je veux|j'ai besoin|comment|pourquoi)\b/.test(lower)) return 'fr';
  // German
  if (/\b(hallo|danke|ich möchte|bitte|wie|was)\b/.test(lower)) return 'de';
  // Portuguese
  if (/\b(olá|obrigado|quero|por favor|como)\b/.test(lower)) return 'pt';
  // Turkish
  if (/\b(merhaba|teşekkürler|istiyorum|lütfen)\b/.test(lower)) return 'tr';
  // Indonesian
  if (/\b(halo|terima kasih|saya ingin|tolong)\b/.test(lower)) return 'id';

  return 'en'; // safe default
}

let activeRecognition: unknown = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

export function startListening(
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (err: string) => void,
  onEnd: () => void,
  langHint: VoiceLang = 'en',
): () => void {
  if (typeof window === 'undefined') return () => {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    onError('STT not supported in this browser');
    return () => {};
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognition: any = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = LANG_BCP[langHint] || LANG_BCP.en;
  recognition.maxAlternatives = 1;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const res = event.results[i];
      if (res.isFinal) final += res[0].transcript;
      else interim += res[0].transcript;
    }
    if (final) onResult(final.trim(), true);
    else if (interim) onResult(interim.trim(), false);
  };

  recognition.onerror = (event: { error?: string }) => {
    onError(event.error || 'voice error');
  };
  recognition.onend = () => {
    activeRecognition = null;
    onEnd();
  };

  try {
    recognition.start();
    activeRecognition = recognition;
  } catch (e) {
    onError((e as Error).message);
  }

  // returns a stop function
  return () => {
    try {
      recognition.stop();
    } catch {
      /* noop */
    }
    activeRecognition = null;
  };
}

export function speak(text: string, lang: VoiceLang = 'en'): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as Window;
  if (!w.speechSynthesis) return;

  // Cancel anything currently being said
  stopSpeaking();

  // Strip markdown & code-fences for cleaner speech
  const clean = text
    .replace(/```[\s\S]*?```/g, ' code block ')
    .replace(/[*_`#>]/g, ' ')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  // Split long responses into sentence-sized utterances (better cadence)
  const chunks = chunkForSpeech(clean, 220);
  chunks.forEach((chunk, idx) => {
    const utter = new SpeechSynthesisUtterance(chunk);
    utter.lang = LANG_BCP[lang] || LANG_BCP.en;
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    // Try to find a matching voice
    const voice = pickBestVoice(utter.lang);
    if (voice) utter.voice = voice;
    if (idx === 0) activeUtterance = utter;
    w.speechSynthesis.speak(utter);
  });
}

export function stopSpeaking(): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as Window;
  if (w.speechSynthesis) {
    w.speechSynthesis.cancel();
  }
  activeUtterance = null;
}

function chunkForSpeech(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];
  const sentences = text.split(/(?<=[.!?।۔])\s+/);
  const chunks: string[] = [];
  let current = '';
  for (const s of sentences) {
    if ((current + ' ' + s).trim().length > maxLen && current) {
      chunks.push(current.trim());
      current = s;
    } else {
      current = (current + ' ' + s).trim();
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function pickBestVoice(lang: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined') return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // 1) exact match
  const exact = voices.find((v: SpeechSynthesisVoice) => v.lang === lang);
  if (exact) return exact;
  // 2) language family match (e.g. ur-PK -> ur)
  const prefix = lang.split('-')[0];
  const family = voices.find((v: SpeechSynthesisVoice) => v.lang.startsWith(prefix));
  if (family) return family;
  // 3) fall back to default
  return voices.find((v: SpeechSynthesisVoice) => v.default) || voices[0];
}

// Helper: get a friendly label for the language code
export function languageLabel(lang: VoiceLang): string {
  const map: Record<VoiceLang, string> = {
    en: 'English',
    ur: 'اردو',
    hi: 'हिन्दी',
    ar: 'العربية',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    zh: '中文',
    pt: 'Português',
    ru: 'Русский',
    tr: 'Türkçe',
    id: 'Bahasa',
    ja: '日本語',
    ko: '한국어',
    unknown: 'Auto',
  };
  return map[lang] || 'Auto';
}
