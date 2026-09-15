"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Timer as TimerIcon,
  Volume2,
  VolumeX,
  PlayCircle,
} from "lucide-react";
import DashboardLayout from "@/layout/user";

export default function page() {
  const [timers, setTimers] = useState([
    {
      id: 1,
      title: "Boiling Eggs 🥚",
      duration: 480, // 8 minutes in seconds
      remaining: 480,
      isRunning: false,
    },
    {
      id: 2,
      title: "Baking Pizza 🍕",
      duration: 900, // 15 minutes
      remaining: 900,
      isRunning: false,
    },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newMinutes, setNewMinutes] = useState("");
  const [newSeconds, setNewSeconds] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  // 1 Second Interval Hook for Active Timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (timer.isRunning && timer.remaining > 0) {
            return { ...timer, remaining: timer.remaining - 1 };
          }
          if (timer.isRunning && timer.remaining === 0) {
            // Timer Finished
            if (!isMuted) {
              const audio = new Audio(
                "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
              );
              audio.play().catch(() => {});
            }
            return { ...timer, isRunning: false };
          }
          return timer;
        }),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isMuted]);

  // Formatter: Seconds -> MM:SS
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Add New Custom Timer
  const handleAddTimer = (e) => {
    e.preventDefault();
    const mins = parseInt(newMinutes) || 0;
    const secs = parseInt(newSeconds) || 0;
    const totalSecs = mins * 60 + secs;

    if (!newTitle.trim() || totalSecs <= 0) return;

    const newTimerObj = {
      id: Date.now(),
      title: newTitle,
      duration: totalSecs,
      remaining: totalSecs,
      isRunning: false,
    };

    setTimers([...timers, newTimerObj]);
    setNewTitle("");
    setNewMinutes("");
    setNewSeconds("");
  };

  // Quick Preset Addition
  const addPresetTimer = (title, minutes) => {
    const totalSecs = minutes * 60;
    setTimers([
      ...timers,
      {
        id: Date.now(),
        title,
        duration: totalSecs,
        remaining: totalSecs,
        isRunning: true,
      },
    ]);
  };

  // Timer Controls
  const toggleStartPause = (id) => {
    setTimers(
      timers.map((t) => (t.id === id ? { ...t, isRunning: !t.isRunning } : t)),
    );
  };

  const resetTimer = (id) => {
    setTimers(
      timers.map((t) =>
        t.id === id ? { ...t, remaining: t.duration, isRunning: false } : t,
      ),
    );
  };

  const deleteTimer = (id) => {
    setTimers(timers.filter((t) => t.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-5xl mx-auto transition-colors duration-300 p-5  ">
        {/* 1. Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-comfortaa text-gray-900 dark:text-white">
             Multi-Timer  
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Run multiple timers simultaneously to keep track of your cooking
              tasks.
            </p>
          </div>

          {/* Audio Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-xs text-xs font-bold cursor-pointer"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-500" />
                <span>Sound Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-500" />
                <span>Sound Active</span>
              </>
            )}
          </button>
        </div>

        {/* 2. Quick Presets Bar */}
        <div className="mb-8">
          <span className="text-xs font-bold text-gray-400 block mb-3">
            Quick Presets
          </span>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {[
              { label: "Boil Eggs (8m)", name: "Boil Eggs 🥚", mins: 8 },
              { label: "Pasta Al Dente (10m)", name: "Pasta 🍝", mins: 10 },
              { label: "Steak Sear (4m)", name: "Steak Sear 🥩", mins: 4 },
              { label: "Oven Roast (20m)", name: "Oven Roast 🍗", mins: 20 },
              {
                label: "Simmer Sauce (15m)",
                name: "Simmer Sauce 🍲",
                mins: 15,
              },
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => addPresetTimer(preset.name, preset.mins)}
                className="px-4 py-2.5 rounded-full bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 hover:border-gray-900 dark:hover:border-white text-xs font-bold text-gray-800 dark:text-gray-200 shrink-0 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-500" />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Add Custom Timer Bar */}
        <div className="bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 rounded-[28px] p-4 mb-8 shadow-xs">
          <form
            onSubmit={handleAddTimer}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <input
              type="text"
              placeholder="Timer name (e.g. Baking Bread)..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full flex-1 px-4 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800/15 text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900   transition-all"
            />

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {/* Time Input Group */}
              <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 dark:bg-gray-200/2 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-inner">
                <div className="flex items-center bg-white dark:bg-gray-800/10 px-2.5 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700/2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-emerald-500/80 transition-all">
                  <input
                    type="number"
                    placeholder="00"
                    min="0"
                    max="99"
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(e.target.value)}
                    className="w-8 text-center bg-transparent font-semibold text-sm text-gray-900 dark:text-gray-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase ml-0.5">
                    m
                  </span>
                </div>

                <span className="text-gray-400 dark:text-gray-600 font-bold px-0.5">
                  :
                </span>

                <div className="flex items-center bg-white dark:bg-gray-200/2 px-2.5 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700/2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-emerald-500/80  transition-all">
                  <input
                    type="number"
                    placeholder="00"
                    min="0"
                    max="59"
                    value={newSeconds}
                    onChange={(e) => setNewSeconds(e.target.value)}
                    className="w-8 text-center bg-transparent font-semibold text-sm text-gray-900 dark:text-gray-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase ml-0.5">
                    s
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex items-center gap-0.5 px-5 py-2.5 rounded-full font-comfortaa bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm hover:opacity-90 transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer"
              >
                <PlayCircle />
                <span>Start</span>
              </button>
            </div>
          </form>
        </div>

        {/* 4. Active Timers Grid */}
        {timers.length === 0 ? (
          <div className="bg-white dark:bg-[#18181b]/5 rounded-[32px] p-12 text-center border border-gray-200/80 dark:border-gray-800/80">
            <TimerIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-emerald-600 mb-3" />
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-300 font-comfortaa">
              No active timers running
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Choose a quick preset above or create a new custom timer.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {timers.map((timer) => {
              const progressPercent =
                ((timer.duration - timer.remaining) / timer.duration) * 100;
              const isFinished = timer.remaining === 0;

              return (
                <div
                  key={timer.id}
                  className={`bg-white dark:bg-[#18181b]/20  border rounded-[32px] p-6 shadow-xs flex flex-col justify-between relative overflow-hidden transition-all ${
                    isFinished
                      ? "border-red-500 ring-2 ring-red-500/20 animate-pulse"
                      : timer.isRunning
                        ? "border-emerald-500/50 dark:border-emerald-500/30"
                        : "border-gray-200/80 dark:border-gray-800/80"
                  }`}
                >
                  {/* Progress Bar Top Overlay */}
                  <div
                    className="absolute top-0 left-0 h-1.5 bg-emerald-500 transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />

                  {/* Card Title & Trash */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                      {timer.title}
                    </h3>
                    <button
                      onClick={() => deleteTimer(timer.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Large Counter Display */}
                  <div className="my-4 text-center">
                    <span
                      className={`text-4xl font-extrabold tracking-tight font-mono ${
                        isFinished
                          ? "text-red-500"
                          : timer.isRunning
                            ? "text-emerald-500"
                            : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {formatTime(timer.remaining)}
                    </span>
                    {isFinished && (
                      <span className="block text-xs font-bold text-red-500 mt-1 animate-bounce">
                        🔔 Timer Finished!
                      </span>
                    )}
                  </div>

                  {/* Control Actions */}
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <button
                      onClick={() => toggleStartPause(timer.id)}
                      className={`p-3 rounded-full transition-all shadow-sm cursor-pointer ${
                        timer.isRunning
                          ? "bg-amber-500 text-white hover:bg-amber-600"
                          : "bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90"
                      }`}
                    >
                      {timer.isRunning ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={() => resetTimer(timer.id)}
                      className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
