"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Notebook,
  Plus,
  Trash2,
  StickyNote,
  PenLine,
  Mic,
  Square,
  Volume2,
  Play,
  Pause,
} from "lucide-react";
import DashboardLayout from "@/layout/user";
import VoiceNoteAction from "@/components/ui/voice-note";

export default function CookingNotesPage() {
  const [notes, setNotes] = useState([]);
  const [recipeNameInput, setRecipeNameInput] = useState("");
  const [noteTextInput, setNoteTextInput] = useState("");

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBase64, setAudioBase64] = useState(null);
  const [playingNoteId, setPlayingNoteId] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  // Load saved notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("cooking_notes");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error("Error loading notes from localStorage:", error);
      }
    } else {
      const defaultNotes = [
        {
          id: "1",
          recipeName: "Beef Kala Bhuna",
          noteText:
            "Add an extra dash of mustard oil at the very end for a rich aroma.",
          audio: null,
          date: "2026-09-02",
        },
      ];
      setNotes(defaultNotes);
      localStorage.setItem("cooking_notes", JSON.stringify(defaultNotes));
    }
  }, []);

  // Handle start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioBase64(reader.result); // Save base64 string
        };

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Microphone access denied or not supported in this browser.");
      console.error("Error accessing microphone:", err);
    }
  };

  // Handle stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  // Cancel current voice recording
  const cancelRecording = () => {
    if (isRecording) {
      stopRecording();
    }
    setAudioBase64(null);
    setRecordingTime(0);
  };

  // Save new note to state and localStorage
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!recipeNameInput.trim() && !noteTextInput.trim() && !audioBase64)
      return;

    const newNote = {
      id: Date.now().toString(),
      recipeName: recipeNameInput.trim() || "Untitled Note",
      noteText: noteTextInput,
      audio: audioBase64,
      date: new Date().toISOString().split("T")[0],
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem("cooking_notes", JSON.stringify(updatedNotes));

    // Reset input states
    setRecipeNameInput("");
    setNoteTextInput("");
    setAudioBase64(null);
    setRecordingTime(0);
  };

  // Delete note handler
  const handleDeleteNote = (id) => {
    if (playingNoteId === id && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setPlayingNoteId(null);
    }
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem("cooking_notes", JSON.stringify(updatedNotes));
  };

  // Toggle voice playback for a note
  const togglePlayAudio = (id, audioSrc) => {
    if (playingNoteId === id) {
      audioPlayerRef.current.pause();
      setPlayingNoteId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      audioPlayerRef.current = new Audio(audioSrc);
      audioPlayerRef.current.play();
      setPlayingNoteId(id);

      audioPlayerRef.current.onended = () => {
        setPlayingNoteId(null);
      };
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#121212]/5 text-gray-900 dark:text-gray-100   transition-colors duration-300">
      <div className="max-w-full mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* Main Card Wrapper */}
        <div className="bg-white/80 dark:bg-[#1C1C1E]/4 backdrop-blur-xl rounded-[28px] p-5 sm:p-7 border border-gray-200/60 dark:border-gray-800/80 shadow-sm transition-all">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 pb-5 mb-5 border-b border-gray-100 dark:border-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Notebook className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg tracking-tight">
                  My Cooking Notes
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {notes.length} note(s) saved
                </p>
              </div>
            </div>
          </div>

          {/* Add Note Form */}
          <form
            onSubmit={handleAddNote}
            className="mb-6 space-y-3 bg-gray-50/80 dark:bg-[#252528]/20 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80"
          >
          
            <input
              type="text"
              value={recipeNameInput}
              onChange={(e) => setRecipeNameInput(e.target.value)}
              placeholder="Recipe Name (e.g., Chicken Biryani)"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C1C1E]/2 border border-gray-200 dark:border-gray-700/80 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />

            <textarea
              value={noteTextInput}
              onChange={(e) => setNoteTextInput(e.target.value)}
              placeholder="Write your special tips or notes here..."
              rows={3}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C1C1E]/2 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
            />

            {/* Voice Recorder Control Panel */}
            <VoiceNoteAction 
            audioBase64={audioBase64}
            cancelRecording={cancelRecording}
            formatTime={formatTime}
            isRecording={isRecording}
            recordingTime={recordingTime}
            startRecording={startRecording}
            stopRecording={stopRecording}
            saveButtonText="Save Note"
            />
          </form>

          {/* Notes List */}
          {notes.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-2xl bg-gray-50/50 dark:bg-gray-900/5 border border-dashed border-gray-200 dark:border-gray-800/80">
              <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 dark:bg-gray-800/20 flex items-center justify-center text-gray-500 mb-3">
                <StickyNote className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                No cooking notes yet!
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                Start writing down your unique cooking tweaks or record audio
                notes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 max-w-2xl">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-start justify-between p-4 rounded-2xl border border-gray-100 cursor-pointer dark:border-gray-800/80 bg-gray-50/80 dark:bg-[#252528]/5 hover:bg-white dark:hover:bg-[#2C2C30]/5 hover:border-emerald-500/30 transition-all duration-200"
                >
                  <div className="space-y-2 flex-1 pr-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                        {note.recipeName}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {note.date}
                      </span>
                    </div>

                    {note.noteText && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {note.noteText}
                      </p>
                    )}

                    {/* Audio Player Button */}
                    {note.audio && (
                      <div className="pt-1">
                        <button
                          onClick={() => togglePlayAudio(note.id, note.audio)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {playingNoteId === note.id ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-current" />
                              <span>Pause Voice Note</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Play Voice Note</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors shrink-0 cursor-pointer"
                    aria-label="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
