import { Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  onTranscript: (text: string) => void;
  className?: string;
};

interface MinimalRecognitionEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

export function VoiceSearchButton({ onTranscript, className }: Props) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR =
      (window as unknown as { SpeechRecognition?: new () => unknown }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;
    if (!SR) return;
    setSupported(true);
    const rec = new SR() as unknown as {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onresult: (e: MinimalRecognitionEvent) => void;
      onend: () => void;
      onerror: () => void;
      start: () => void;
      stop: () => void;
    };
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      const text = e.results[0]?.[0]?.transcript ?? "";
      if (text) onTranscript(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    return () => {
      try {
        rec.stop();
      } catch {
        // ignore
      }
    };
  }, [onTranscript]);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (!recRef.current) return;
        if (listening) {
          recRef.current.stop();
          setListening(false);
        } else {
          try {
            recRef.current.start();
            setListening(true);
          } catch {
            setListening(false);
          }
        }
      }}
      className={
        className ??
        `grid h-9 w-9 place-items-center rounded-full border border-border transition ${
          listening ? "bg-rose-500 text-white" : "bg-white text-muted-foreground hover:text-foreground"
        }`
      }
      aria-label={listening ? "Stop voice search" : "Start voice search"}
      title="Voice search"
    >
      {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </button>
  );
}
