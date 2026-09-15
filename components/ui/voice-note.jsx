"use client";

import React, { useRef, useEffect } from "react";
import { Mic, Square, Volume2, Trash2 } from "lucide-react";

export default function VoiceNoteAction({
  isRecording,
  audioBase64,
  recordingTime,
  formatTime,
  startRecording,
  stopRecording,
  cancelRecording,
  saveButtonText = "Save Note",
}) {
  const popAudioRef = useRef(null);

  // Client-side Audio setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      popAudioRef.current = new Audio(
        "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"
      );
    }
  }, []);

  const handleStartRecording = (e) => {
    if (e) e.preventDefault();
    if (popAudioRef.current) {
      popAudioRef.current.currentTime = 0;
      popAudioRef.current.play().catch(() => {});
    }
    if (startRecording) startRecording();
  };

  const handleStopRecording = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (stopRecording) stopRecording();
  };

  const handleCancelRecording = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (cancelRecording) cancelRecording();
  };

  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* State 1: Idle Mic Button */}
        {!isRecording && !audioBase64 && (
          <button
            type="button"
            onClick={handleStartRecording}
            className="flex items-center gap-2 px-2.5 py-2 rounded-full font-semibold bg-slate-100 dark:bg-emerald-300 hover:opacity-90 text-slate-700 dark:text-slate-950 text-[.9rem] font-Manrope transition-all cursor-pointer active:scale-95"
          >
            <Mic size={16} className="w-5 h-5 text-black" />
            
          </button>
        )}

        {/* State 2: Active Recording Bar (WhatsApp Style) */}
        {isRecording && (
          <div className="flex items-center justify-between flex-1 max-w-xs px-3.5 py-1.5 rounded-full bg-red-500/10 dark:bg-red-500/20 border border-red-500/20">
            <div className="flex items-center gap-2">
              {/* Animated Blinking Red Dot */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-xs font-mono font-medium text-red-600 dark:text-red-400">
                {formatTime ? formatTime(recordingTime) : recordingTime}
              </span>
            </div>

            <button
              type="button"
              onClick={handleStopRecording}
              className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all cursor-pointer shadow-sm active:scale-90"
              title="Stop Recording"
            >
              <Square className="w-3 h-3 fill-current" />
            </button>
          </div>
        )}

        {/* State 3: Attached Audio Badge */}
        {audioBase64 && !isRecording && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-black dark:text-emerald-300 text-xs font-medium">
            <div className="p-1 rounded-full bg-emerald-500 text-white">
              <Volume2 className="w-3 h-3" />
            </div>
            <span>Voice Note Attached</span>
            <button
              type="button"
              onClick={handleCancelRecording}
              className="ml-1 p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all cursor-pointer"
              title="Delete Voice Note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Save Action Button */}
      <button
        type="submit"
        className="flex items-center gap-1.5 px-5 py-4 rounded-full bg-emerald-500 hover:opacity-85 text-black text-xs font-bold font-montserrat hover:shadow transition-all cursor-pointer active:scale-95 shrink-0"
      >
        <span>{saveButtonText}</span>
      </button>
    </div>
  );
}