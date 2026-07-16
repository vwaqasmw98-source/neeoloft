/**
 * Browser-native speech helpers (FREE — no API keys needed).
 *
 * Uses the Web Speech API:
 *   - SpeechRecognition (webkitSpeechRecognition) for STT
 *   - speechSynthesis for TTS
 *
 * Supported in: Chrome, Edge, Safari, Opera, Samsung Internet.
 * Not supported in: Firefox (only in dev flags), some iOS versions < 14.5.
 *
 * For premium voice quality, swap TTS to ElevenLabs (see lib/elevenlabs.ts
 * — left as future enhancement, current implementation is free).
 */

export type STTState = 'idle' | 'listening' | 'processing' | 'error';
export type TTSState = 'idle' | 'speaking' | 'paused';

export function isSTTSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
  );
}

export function isTTSSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(window.speechSynthesis);
}

export function getRecognitionClass(): SpeechRecognitionStatic | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export type STTOptions = {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (err: string) => void;
  onEnd?: () => void;
  onStart?: () => void;
};

export type STTHandle = {
  stop: () => void;
  abort: () => void;
};

export function startListening(opts: STTOptions = {}): STTHandle | null {
  const Cls = getRecognitionClass();
  if (!Cls) return null;
  const recognition: SpeechRecognition = new Cls();
  recognition.lang = opts.lang || 'en-US';
  recognition.continuous = opts.continuous ?? false;
  recognition.interimResults = opts.interimResults ?? true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => opts.onStart?.();
  recognition.onerror = (e: Event) => opts.onError?.((e as SpeechRecognitionErrorEvent).error);
  recognition.onend = () => opts.onEnd?.();
  recognition.onresult = (e: Event) => {
    const event = e as SpeechRecognitionEvent;
    let final = '';
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const r = event.results[i];
      if (r.isFinal) final += r[0].transcript;
      else interim += r[0].transcript;
    }
    if (interim) opts.onResult?.(interim, false);
    if (final) opts.onResult?.(final, true);
  };

  try {
    recognition.start();
  } catch (err) {
    opts.onError?.((err as Error).message);
    return null;
  }

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch {
        /* noop */
      }
    },
    abort: () => {
      try {
        recognition.abort();
      } catch {
        /* noop */
      }
    },
  };
}

export function listVoices(): SpeechSynthesisVoice[] {
  if (!isTTSSupported()) return [];
  return window.speechSynthesis.getVoices();
}

export function pickBestVoice(lang = 'en-US'): SpeechSynthesisVoice | null {
  const voices = listVoices();
  if (!voices.length) return null;
  // Prefer high-quality voices in this priority order
  const exact = voices.find((v) => v.lang === lang);
  if (exact) return exact;
  const prefix = voices.find((v) => v.lang.startsWith(lang.split('-')[0]));
  if (prefix) return prefix;
  // Look for "premium" / "neural" / "natural" tagged voices
  const premium = voices.find((v) =>
    /premium|neural|natural|enhanced|google|wavenet/i.test(v.name)
  );
  return premium || voices[0];
}

export type TTSOptions = {
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
  onStart?: () => void;
  onError?: (err: string) => void;
};

export function speak(text: string, opts: TTSOptions = {}): void {
  if (!isTTSSupported()) {
    opts.onError?.('TTS not supported');
    return;
  }
  // Cancel any in-flight speech first
  window.speechSynthesis.cancel();

  // Strip markdown for natural TTS (Aria's replies sometimes have **bold** etc.)
  const clean = text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/#{1,6}\s?/g, '')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/[•·]/g, '')
    .replace(/\n+/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (!clean) return;

  const utter = new SpeechSynthesisUtterance(clean);
  utter.lang = opts.voice?.lang || 'en-US';
  if (opts.voice) utter.voice = opts.voice;
  utter.rate = opts.rate ?? 1.0;
  utter.pitch = opts.pitch ?? 1.0;
  utter.volume = opts.volume ?? 1.0;
  utter.onstart = () => opts.onStart?.();
  utter.onend = () => opts.onEnd?.();
  utter.onerror = (e: SpeechSynthesisErrorEvent) => opts.onError?.(e.error);

  window.speechSynthesis.speak(utter);
}

export function stopSpeaking(): void {
  if (!isTTSSupported()) return;
  window.speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  if (!isTTSSupported()) return false;
  return window.speechSynthesis.speaking;
}

// Common voice languages to expose in the UI
export const SUPPORTED_LANGS = [
  { code: 'en-US', label: '🇺🇸 English (US)' },
  { code: 'en-GB', label: '🇬🇧 English (UK)' },
  { code: 'es-ES', label: '🇪🇸 Spanish' },
  { code: 'fr-FR', label: '🇫🇷 French' },
  { code: 'de-DE', label: '🇩🇪 German' },
  { code: 'pt-BR', label: '🇧🇷 Portuguese (BR)' },
  { code: 'ar-SA', label: '🇸🇦 Arabic' },
  { code: 'hi-IN', label: '🇮🇳 Hindi' },
  { code: 'ur-PK', label: '🇵🇰 Urdu' },
  { code: 'zh-CN', label: '🇨🇳 Chinese (Mandarin)' },
  { code: 'ja-JP', label: '🇯🇵 Japanese' },
];
