"use client";

import { Mic, Send, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type Status = "idle" | "listening" | "processing" | "speaking";

interface AIInteractionProps {
  status: Status;
  onStart: () => void;
  onStop: () => void;
  onCancel: () => void;
  className?: string;
}

export function AIInteraction({
  status,
  onStart,
  onStop,
  onCancel,
  className,
}: AIInteractionProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const Circle = () => {
    switch (status) {
      case "listening":
        return (
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-blue-500/30 animate-pulse delay-200" />
            <div className="absolute inset-4 rounded-full bg-blue-500 flex items-center justify-center">
              <Mic className="w-12 h-12 text-white" />
            </div>
          </div>
        );
      case "processing":
        return (
          <div className="relative w-40 h-40">
            <div className="w-full h-full rounded-full border-4 border-gray-300 border-t-4 border-t-purple-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm font-semibold text-purple-500">Processing</p>
            </div>
          </div>
        );
      case "speaking":
        return (
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-green-500/30 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-green-500 flex items-center justify-center">
                <p className="text-sm font-semibold text-white">Speaking</p>
            </div>
          </div>
        );
      case "idle":
      default:
        return (
          <button
            onClick={onStart}
            className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <Mic className="w-12 h-12 text-gray-500" />
          </button>
        );
    }
  };

  return (
    <div className={cn("w-full flex flex-col items-center gap-8", className)}>
      <Circle />
      <div className="flex items-center gap-4">
        {status === "listening" && (
          <>
            <button
              onClick={onStop}
              className="px-6 py-2 rounded-full bg-green-500 text-white font-semibold flex items-center gap-2 hover:bg-green-600"
            >
              <Send className="w-5 h-5" />
              Submit
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-2 rounded-full bg-red-500 text-white font-semibold flex items-center gap-2 hover:bg-red-600"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
