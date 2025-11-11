"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserById, login } from "@/services/database/users";

const page = () => {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["user"],
//     queryFn: () => getUserById("user_001"),
//   });

//   const {
//     data: loginData,
//     error: loginError,
//     isLoading: loginLoading,
//   } = useQuery({
//     queryKey: ["loginStatus"],
//     queryFn: () =>
//       login("sarah.mitchell@techventure.com", "hashed_password_456"),
//   });

  // Recording state
  const [recording, setRecording] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [loading, setLoading] = useState(false);
  const [finalAudioUrl, setFinalAudioUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  // immediate response audio path (public folder)
  const immediateAudioPath = "/audios/immediate_response_audio.mp3";

  useEffect(() => {
    return () => {
      // cleanup streams
      mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      mediaStreamRef.current = stream;
      const options: MediaRecorderOptions = { mimeType: "audio/webm" } as any;
      const mr = new MediaRecorder(stream, options);
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        // Submit automatically on stop
        await submitRecording(blob);
      };

      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone permission error", err);
      setPermissionGranted(false);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    // stop tracks
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== "inactive")
        mediaRecorderRef.current.stop();
    }
    chunksRef.current = [];
    setRecording(false);
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
  };

  const submitRecording = async (blob: Blob) => {
    try {
      setLoading(true);

      // Play immediate response audio (user initiated -> should be allowed by browser autoplay rules)
      try {
        const immediateAudio = new Audio(immediateAudioPath);
        // try/catch because some browsers might block autoplay in some contexts
        await immediateAudio.play().catch(() => {
          // ignore play errors
        });
      } catch (e) {
        // ignore
      }

      // send blob to server API which will run the workflow
      const res = await fetch("/api/ai-workflow", {
        method: "POST",
        headers: {
          "Content-Type": blob.type || "application/octet-stream",
        },
        body: blob,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server error: ${res.status} - ${txt}`);
      }

      // response is audio bytes
      const arrayBuffer = await res.arrayBuffer();
      const audioBlob = new Blob([arrayBuffer], {
        type: res.headers.get("content-type") || "audio/mpeg",
      });
      const url = URL.createObjectURL(audioBlob);
      setFinalAudioUrl(url);

      // play the final audio
      try {
        const a = new Audio(url);
        await a.play().catch(() => {});
      } catch (e) {
        // ignore
      }

      setLoading(false);
    } catch (err: any) {
      console.error("Submit recording error", err);
      setLoading(false);
    }
  };

//   if (isLoading || loginLoading) return <div>Loading...</div>;
//   if (error || loginError) return <div>Error loading user data</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Assistant</h1>
      <p>
        {/* Logged user: {(data as any)?.email ?? (data as any)?.id ?? "user_001"} */}
        Logged user: user_001
      </p>

      <div style={{ marginTop: 12 }}>
        {!recording ? (
          <button
            onClick={startRecording}
            style={{ padding: "8px 12px", marginRight: 8 }}
            aria-pressed={recording}
          >
            Start Recording
          </button>
        ) : (
          <>
            <button
              onClick={stopRecording}
              style={{ padding: "8px 12px", marginRight: 8 }}
            >
              Stop & Submit
            </button>
            <button onClick={cancelRecording} style={{ padding: "8px 12px" }}>
              Cancel
            </button>
          </>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        {loading && <div>Processing...</div>}
        {finalAudioUrl && (
          <div>
            <p>Assistant response:</p>
            <audio controls src={finalAudioUrl} />
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
