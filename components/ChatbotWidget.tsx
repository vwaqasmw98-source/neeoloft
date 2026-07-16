'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from '@/components/MotionWrapper';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Loader2,
  CheckCircle2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Phone,
} from 'lucide-react';
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';
import {
  isSTTSupported,
  isTTSSupported,
  startListening,
  speak,
  stopSpeaking,
  pickBestVoice,
  listVoices,
  SUPPORTED_LANGS,
  type STTHandle,
} from '@/lib/speech';

type Msg = { role: 'user' | 'assistant'; content: string; ts: number };

const SESSION_KEY = 'neeoloft_chat_session';
const STORAGE_KEY = 'neeoloft_chat_history';
const VOICE_ENABLED_KEY = 'neeoloft_voice_enabled';
const AUTOSPEAK_KEY = 'neeoloft_autospeak';
const LANG_KEY = 'neeoloft_lang';

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [leadCaptured, setLeadCaptured] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Voice state
  const [voiceEnabled, setVoiceEnabled] = useState(false); // mic on
  const [autoSpeak, setAutoSpeak] = useState(true); // auto-speak Aria's replies
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [lang, setLang] = useState('en-US');
  const [showSettings, setShowSettings] = useState(false);
  const sttRef = useRef<STTHandle | null>(null);
  const interimRef = useRef('');

  // Init session + history
  useEffect(() => {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = uuid();
      localStorage.setItem(SESSION_KEY, sid);
    }
    setSessionId(sid);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setMessages(JSON.parse(stored));
      const v = localStorage.getItem(VOICE_ENABLED_KEY);
      if (v) setVoiceEnabled(v === '1');
      const a = localStorage.getItem(AUTOSPEAK_KEY);
      if (a) setAutoSpeak(a === '1');
      const l = localStorage.getItem(LANG_KEY);
      if (l) setLang(l);
    } catch {
      /* noop */
    }
  }, []);

  // Load voices (some browsers populate async)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const load = () => listVoices();
    load();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = load;
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
    } catch {
      /* noop */
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(VOICE_ENABLED_KEY, voiceEnabled ? '1' : '0');
    } catch {
      /* noop */
    }
  }, [voiceEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTOSPEAK_KEY, autoSpeak ? '1' : '0');
    } catch {
      /* noop */
    }
  }, [autoSpeak]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* noop */
    }
  }, [lang]);

  // Stop TTS when chat closes
  useEffect(() => {
    if (!open) {
      stopSpeaking();
      sttRef.current?.stop();
      setListening(false);
    }
  }, [open]);

  // ─── Mic controls ─────────────────────────────────────────────────
  function startMic() {
    if (!isSTTSupported()) {
      toast.error('Voice input not supported in this browser. Try Chrome/Edge/Safari.');
      return;
    }
    if (listening) return;
    interimRef.current = '';
    setListening(true);
    sttRef.current = startListening({
      lang,
      continuous: false,
      interimResults: true,
      onResult: (text, isFinal) => {
        if (isFinal) {
          interimRef.current = '';
          // Append final to input and auto-send
          setInput(text.trim());
          setListening(false);
          // Auto-send after small delay
          setTimeout(() => {
            const el = document.getElementById('neeoloft-chat-send');
            el?.click();
          }, 100);
        } else {
          interimRef.current = text;
          setInput(text);
        }
      },
      onError: (err) => {
        setListening(false);
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          toast.error('Microphone access denied. Check browser permissions.');
        } else if (err !== 'no-speech' && err !== 'aborted') {
          toast.error(`Mic error: ${err}`);
        }
      },
      onEnd: () => {
        setListening(false);
      },
    });
  }

  function stopMic() {
    sttRef.current?.stop();
    setListening(false);
  }

  function toggleMic() {
    if (listening) stopMic();
    else startMic();
  }

  // ─── TTS for Aria's reply ─────────────────────────────────────────
  function speakReply(text: string) {
    if (!isTTSSupported() || !autoSpeak) return;
    setSpeaking(true);
    const voice = pickBestVoice(lang);
    speak(text, {
      voice,
      rate: 1.0,
      pitch: 1.0,
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  }

  function toggleAutoSpeak() {
    if (autoSpeak) {
      stopSpeaking();
      setSpeaking(false);
    }
    setAutoSpeak((v) => !v);
  }

  function stopTTS() {
    stopSpeaking();
    setSpeaking(false);
  }

  // ─── Send message ─────────────────────────────────────────────────
  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    // Stop any ongoing speech
    stopTTS();
    sttRef.current?.stop();
    setListening(false);

    const userMsg: Msg = { role: 'user', content: text, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          voice: voiceEnabled,
          lang,
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error('Chat failed');
      const data = (await res.json()) as { reply: string; leadCaptured?: boolean };

      setMessages((m) => [
        ...m,
        { role: 'assistant', content: data.reply, ts: Date.now() },
      ]);
      if (data.leadCaptured) {
        setLeadCaptured(true);
        toast.success("Thanks! We'll be in touch shortly 🚀");
      }
      // Speak the reply
      if (voiceEnabled) {
        // Small delay so chat UI renders first
        setTimeout(() => speakReply(data.reply), 200);
      }
    } catch {
      toast.error('Hmm, having trouble connecting. Try again?');
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: "Sorry, I'm having a small hiccup. Try again in a sec?",
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    if (!confirm('Start a new conversation?')) return;
    setMessages([]);
    setLeadCaptured(false);
    stopTTS();
    sttRef.current?.abort();
    setListening(false);
    localStorage.removeItem(STORAGE_KEY);
    const sid = uuid();
    localStorage.setItem(SESSION_KEY, sid);
    setSessionId(sid);
  }

  const voiceAvailable = isSTTSupported() || isTTSSupported();
  const ttsAvailable = isTTSSupported();
  const sttAvailable = isSTTSupported();

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-brand-gradient text-white shadow-glow grid place-items-center"
        aria-label="Open chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && !leadCaptured && messages.length === 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 z-50 w-[min(400px,calc(100vw-2rem))] h-[min(640px,calc(100vh-7rem))] card !p-0 flex flex-col overflow-hidden"
            style={{ boxShadow: '0 20px 60px -20px rgba(0,0,0,0.3)' }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-200/70 dark:border-slate-800 bg-brand-gradient text-white">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 grid place-items-center rounded-full bg-white/20">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">Aria · Neeoloft AI</p>
                  <p className="text-[11px] text-white/85 inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    {speaking
                      ? '🔊 Speaking…'
                      : listening
                        ? '🎤 Listening…'
                        : 'Online · replies in seconds'}
                  </p>
                </div>
                <button
                  onClick={() => setShowSettings((s) => !s)}
                  className="text-white/80 hover:text-white p-1.5 rounded hover:bg-white/10"
                  title="Voice settings"
                  aria-label="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={reset}
                  className="text-[11px] text-white/80 hover:text-white px-2 py-1 rounded hover:bg-white/10"
                  title="Reset"
                >
                  Reset
                </button>
              </div>

              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-white/20 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span>Voice input (mic)</span>
                    <button
                      onClick={() => setVoiceEnabled((v) => !v)}
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        voiceEnabled ? 'bg-emerald-400 text-emerald-900' : 'bg-white/20 text-white/80'
                      }`}
                      disabled={!sttAvailable}
                    >
                      {voiceEnabled ? 'On' : 'Off'}
                      {!sttAvailable && ' (unsupported)'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Auto-speak replies</span>
                    <button
                      onClick={toggleAutoSpeak}
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        autoSpeak ? 'bg-emerald-400 text-emerald-900' : 'bg-white/20 text-white/80'
                      }`}
                      disabled={!ttsAvailable}
                    >
                      {autoSpeak ? 'On' : 'Off'}
                      {!ttsAvailable && ' (unsupported)'}
                    </button>
                  </div>
                  <div className="text-xs">
                    <label className="block mb-1">Language</label>
                    <select
                      value={lang}
                      onChange={(e) => setLang(e.target.value)}
                      className="w-full rounded-lg bg-white/10 border border-white/20 px-2 py-1 text-xs text-white"
                    >
                      {SUPPORTED_LANGS.map((l) => (
                        <option key={l.code} value={l.code} className="text-slate-900">
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!voiceAvailable && (
                    <p className="text-[10px] text-amber-200 pt-1">
                      ⚠️ Your browser doesn't fully support voice. Use Chrome/Edge/Safari for best experience.
                    </p>
                  )}
                  
                </motion.div>
              )}
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 no-scrollbar"
            >
              {messages.length === 0 && (
                <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8 space-y-3">
                  <div className="h-12 w-12 mx-auto rounded-full bg-brand-500/10 text-brand-500 grid place-items-center">
                    <Bot className="h-6 w-6" />
                  </div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">
                    Hi! I'm Aria 👋
                  </p>
                  <p>
                    Tell me about your business — what are you trying to build, automate, or grow?
                    {voiceEnabled && ' Or just hit the mic and talk to me.'}
                  </p>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'rounded-tr-sm bg-brand-500 text-white'
                        : 'rounded-tl-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-slate-800 px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                  </div>
                </div>
              )}

              {listening && (
                <div className="flex items-center gap-2 text-[11px] text-rose-500 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                  </span>
                  Listening — speak now
                </div>
              )}

              {leadCaptured && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Got your details — our team will reach out shortly.
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-slate-200/70 dark:border-slate-800 p-3 flex gap-2">
              {voiceEnabled && sttAvailable && (
                <button
                  onClick={toggleMic}
                  className={`btn-primary !px-3 !py-2.5 ${
                    listening ? '!bg-rose-500' : ''
                  }`}
                  aria-label={listening ? 'Stop listening' : 'Start voice input'}
                  title={listening ? 'Stop listening' : 'Tap to speak'}
                >
                  {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              )}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={listening ? 'Listening…' : voiceEnabled ? 'Type or tap mic to speak' : 'Type a message…'}
                className="input !py-2.5 text-sm"
                disabled={loading || listening}
              />
              {ttsAvailable && (
                <button
                  onClick={speaking ? stopTTS : toggleAutoSpeak}
                  className={`p-2.5 rounded-full transition ${
                    speaking
                      ? 'bg-rose-500 text-white'
                      : autoSpeak
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                  aria-label={speaking ? 'Stop speaking' : 'Toggle auto-speak'}
                  title={speaking ? 'Stop speaking' : autoSpeak ? 'Auto-speak: on' : 'Auto-speak: off'}
                >
                  {speaking ? (
                    <VolumeX className="h-4 w-4" />
                  ) : autoSpeak ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </button>
              )}
              <button
                id="neeoloft-chat-send"
                onClick={send}
                disabled={loading || !input.trim()}
                className="btn-primary !px-3 !py-2.5"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
