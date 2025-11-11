"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserById, login } from "@/services/database/users";
import { AIInteraction } from "@/components/ui/ai-interaction";

type Status = "idle" | "listening" | "processing" | "speaking";

const AIPage = () => {
  const [status, setStatus] = useState<Status>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startRecording = async () => {
    isCancelledRef.current = false;
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
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const submitRecording = async (blob: Blob) => {
    setStatus("processing");
    try {
      // Wait 1 second before playing the first audio
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const fetchPromise = fetch("/api/ai-workflow", {
        method: "POST",
        headers: { "Content-Type": "audio/webm" },
        body: blob,
      }).then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.blob();
      });

      const immediateAudio = new Audio("/audios/immediate_response_audio.mp3");
      const immediateAudioPromise = new Promise<void>((resolve) => {
        immediateAudio.onended = () => resolve();
        immediateAudio.play().catch((e) => {
          console.error("Immediate audio playback failed", e);
          resolve(); // Resolve even if playback fails
        });
        setStatus("speaking");
      });

      const [audioBlob] = await Promise.all([
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
        audioRef.current.play();
      } else {
        setStatus("idle");
      }
    } catch (err) {
      console.error("Submit recording error", err);
      setStatus("idle");
    }
  };

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleAudioEnd = () => setStatus("idle");
    audio.addEventListener("ended", handleAudioEnd);

    return () => {
      audio.removeEventListener("ended", handleAudioEnd);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">AI Assistant</h1>
        <p className="text-gray-500">
          Click the microphone to start a conversation.
        </p>
      </div>
      <AIInteraction
        status={status}
        onStart={startRecording}
        onStop={stopRecording}
        onCancel={cancelRecording}
      />
    </div>
  );
};

export default AIPage;

