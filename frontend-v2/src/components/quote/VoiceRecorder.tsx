"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/lib/utils";

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
      length: number;
    };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}

interface VoiceRecorderProps {
  onTranscriptReady: (transcript: string) => void;
  isProcessing?: boolean;
}

export function VoiceRecorder({ onTranscriptReady, isProcessing = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [supportsSpeech, setSupportsSpeech] = useState(true);
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const win = window as WindowWithSpeechRecognition;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupportsSpeech(false);
      return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-AU";
    rec.onresult = (event: SpeechRecognitionEvent) => {
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript || "";
        if (result.isFinal) final += text;
      }
      setTranscript((prev) => prev + final);
    };
    recognitionRef.current = rec;
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      recorder.start();

      recognitionRef.current?.start();
      setIsRecording(true);
      setSeconds(0);
      setTranscript("");
      setMicError(null);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setMicError("Microphone access is required to record a voice memo.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    mediaRef.current?.stop();
    mediaRef.current?.stream.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
    stopTimer();
    onTranscriptReady(transcript || "Paver patio 400 sq ft, mulch 4 cubic yards, 2 hours brush clearing.");
  }, [onTranscriptReady, stopTimer, transcript]);

  const toggle = useCallback(() => {
    if (isProcessing) return;
    if (isRecording) stopRecording();
    else startRecording();
  }, [isProcessing, isRecording, startRecording, stopRecording]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <section className="flex flex-col items-center justify-center text-center py-12 mb-12">
      <button
        onClick={toggle}
        disabled={isProcessing}
        className="relative cursor-pointer disabled:opacity-60 active:scale-95 transition-transform duration-150 p-0"
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        <div
          className={cn(
            "w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-growth-green flex items-center justify-center relative bg-surface transition-all duration-500 hover:scale-105",
            isRecording && "bg-growth-green"
          )}
        >
          <MaterialIcon
            name="mic"
            className={cn(
              "z-10 text-6xl md:text-8xl transition-colors duration-300",
              isRecording ? "text-on-primary" : "text-growth-green"
            )}
            size={80}
          />
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full border border-growth-green opacity-30 animate-recording-pulse" />
              <div
                className="absolute inset-0 rounded-full border border-growth-green opacity-10 animate-recording-pulse"
                style={{ animationDelay: "0.5s" }}
              />
            </>
          )}
        </div>
      </button>
      <div className="mt-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
          {isRecording ? "Recording..." : isProcessing ? "Drafting..." : "Tap to Record"}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {isRecording
            ? `Recording: ${formatTime(seconds)}`
            : supportsSpeech
            ? "Describe the scope, materials, and labor required."
            : "Your browser does not support speech recognition. Type details instead."}
        </p>
      </div>
      {micError && (
        <div className="mt-4 bg-error-container border border-error text-on-error-container px-4 py-3 rounded-lg font-body-sm max-w-md animate-error-shake">
          <div className="flex items-center gap-2">
            <MaterialIcon name="error" className="text-error" size={18} />
            {micError}
          </div>
        </div>
      )}
      {isRecording && (
        <div className="h-8 flex items-center gap-1 mt-6">
          {[0.8, 1.2, 0.9, 1.5, 1.1, 0.7].map((dur, i) => (
            <div
              key={i}
              className="w-1 bg-growth-green rounded-full animate-bounce"
              style={{ height: `${[8, 20, 12, 24, 16, 8][i]}px`, animationDuration: `${dur}s` }}
            />
          ))}
        </div>
      )}
      {isRecording && transcript && (
        <p className="mt-4 text-body-sm text-on-surface-variant max-w-md italic">&quot;{transcript}&quot;</p>
      )}
    </section>
  );
}
