"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AIInteraction } from "@/components/ui/ai-interaction";
import { useUserStore } from "@/hooks/use-user-store";
import { useI18n, translations } from "@/app/context/i18n";
type Status = "idle" | "listening" | "processing" | "speaking";

export default function AIPage() {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [messages, setMessages] = useState<any[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isCancelledRef = useRef(false);
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startRecording = async () => {
    isCancelledRef.current = false;
    setMessages([]);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        if (isCancelledRef.current) return;
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        submitRecording(blob);
      };

      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.start();
      setStatus("listening");
    } catch (err) {
      console.error("Microphone permission error", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const cancelRecording = () => {
    isCancelledRef.current = true;
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    chunksRef.current = [];
    setStatus("idle");
    setMessages([]);
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const submitRecording = async (blob: Blob) => {
    setStatus("processing");
    try {
      // First, get the language and transcription
      const langResponse = await fetch("/api/ai-workflow/start", {
        method: "POST",
        headers: { "Content-Type": "audio/webm" },
        body: blob,
      });
      if (!langResponse.ok) throw new Error("Language detection failed");
      const { language, transcription } = await langResponse.json();

      // Now we know the language, play the immediate response
      const immediateAudioFile = language.toLowerCase().includes('french') 
        ? "/audios/immediate_response_audio_francais.mp3"
        : "/audios/immediate_response_audio_english.mp3";
      
      const immediateMessage = language.toLowerCase().includes('french')
        ? translations.fr.checkingCalendar
        : translations.en.checkingCalendar;

      const immediateAudio = new Audio(immediateAudioFile);
      const immediateAudioPromise = new Promise<void>((resolve) => {
        immediateAudio.onended = () => resolve();
        immediateAudio.play().catch((e) => {
          console.error("Immediate audio playback failed", e);
          resolve();
        });
        setStatus("speaking");
        setMessages([{ id: 1, text: immediateMessage }]);
      });

      // In parallel, get the final response from the workflow
      const fetchPromise = fetch("/api/ai-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Sending JSON now
        body: JSON.stringify({ transcription, userId: user?.id }), // Sending transcription and userId
      }).then(async (res) => {
        if (!res.ok) throw new Error("Server error");
        const formData = await res.formData();
        const audioBlob = formData.get("audio") as Blob;
        const text = formData.get("text") as string;
        return { audioBlob, text };
      });

      const [{ audioBlob, text }] = await Promise.all([
        fetchPromise,
        immediateAudioPromise,
      ]);

      setStatus("processing");

      // Wait 2 seconds between audios
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const url = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = url;
        setStatus("speaking");
        setMessages((prev) => [...prev, { id: 2, text }]);
        audioRef.current.play();
      } else {
        setStatus("idle");
      }

      await queryClient.invalidateQueries({ queryKey: ["calendarEvents", user?.id] });
    } catch (err) {
      console.error("Submit recording error", err);
      setStatus("idle");
    }
  };

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleAudioEnd = () => {
      setStatus("idle");
    };
    audio.addEventListener("ended", handleAudioEnd);

    return () => {
      audio.removeEventListener("ended", handleAudioEnd);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t('aiAssistantTitle')}</h1>
        <p className="text-gray-500">
          {t('aiAssistantDescription')}
        </p>
      </div>
      <AIInteraction
        status={status}
        onStart={startRecording}
        onStop={stopRecording}
        onCancel={cancelRecording}
        messages={messages}
      />
    </div>
  );
};