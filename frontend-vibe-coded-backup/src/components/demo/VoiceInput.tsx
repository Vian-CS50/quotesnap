"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

interface VoiceInputProps {
  transcript: string;
  onTranscriptChange: (val: string) => void;
  isListening: boolean;
  onListeningChange: (val: boolean) => void;
  error: string | null;
  onError: (err: string | null) => void;
}

export default function VoiceInput({
  transcript,
  onTranscriptChange,
  isListening,
  onListeningChange,
  error,
  onError,
}: VoiceInputProps) {
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-AU";

    rec.onresult = (event: any) => {
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + " ";
        }
      }
      onTranscriptChange((transcript + " " + final).trim());
    };

    rec.onerror = (event: any) => {
      if (event.error === "no-speech") return;
      onError(`Speech error: ${event.error}`);
      onListeningChange(false);
    };

    rec.onend = () => {
      onListeningChange(false);
    };

    setRecognition(rec);
  }, []);

  const toggleListening = useCallback(() => {
    onError(null);
    if (!recognition) {
      onError("Speech recognition not supported. Try Chrome or Safari.");
      return;
    }
    if (isListening) {
      recognition.stop();
      onListeningChange(false);
    } else {
      recognition.start();
      onListeningChange(true);
    }
  }, [recognition, isListening]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder="Describe the job here... or tap the mic and talk for 30 seconds."
          className="w-full h-40 p-4 text-sm resize-none border-2 focus:outline-none transition-colors font-mono"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: error ? "var(--danger)" : "var(--border)",
            color: "var(--foreground)",
            borderRadius: "0px",
          }}
        />
        {error && (
          <p className="text-xs mt-2 font-mono" style={{ color: "var(--danger)" }}>
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleListening}
          className="h-12 px-6 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors border-2"
          style={{
            backgroundColor: isListening ? "var(--danger)" : "var(--primary)",
            color: "white",
            borderColor: isListening ? "var(--danger)" : "var(--primary)",
            borderRadius: "0px",
          }}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Tap & Talk
            </>
          )}
        </motion.button>

        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "var(--danger)" }} />
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: "var(--danger)" }} />
            </span>
            <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              Listening...
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
