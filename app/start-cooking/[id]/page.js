"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Loader2,
  Sparkles,
  Globe,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function CookingPage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params?.id;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 🌐 Language State ('bn' for Bangla, 'en' for English)
  const [lang, setLang] = useState("en");

  // Helper Function
  const getText = useCallback(
    (data) => {
      if (!data) return "";
      if (typeof data === "string") return data;
      if (Array.isArray(data)) {
        const found = data.find((item) => item.lang === lang);
        if (found && found.text) return found.text;
        const fallback = data.find((item) => item.lang === "en");
        return fallback?.text || data[0]?.text || "";
      }
      if (typeof data === "object") {
        return data[lang] || data.en || data.bn || "";
      }
      return "";
    },
    [lang],
  );

  const getImageUrl = (imagePath) => {
    const fallbackImage =
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";

    console.log("Passed imagePath to getImageUrl:", imagePath); // চেক করার জন্য

    if (
      !imagePath ||
      typeof imagePath !== "string" ||
      imagePath.trim() === ""
    ) {
      return fallbackImage;
    }

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    try {
      // API_URL এবং SERVER_URL দুটোই যাতে কাজ করে
      const API_BASE = (
        process.env.NEXT_PUBLIC_SERVER_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5000"
      ).replace(/\/$/, "");
      
      const cleanPath = imagePath.replace(/\\/g, "/").replace(/^\//, "");
      const finalUrl = `${API_BASE}/${cleanPath}`;
      console.log("Generated Image URL:", finalUrl); // ফাইনাল লিংকটি কনসোলে দেখাবে
      return finalUrl;
    } catch (err) {
      return fallbackImage;
    }
  };

  useEffect(() => {
    if (!recipeId) return;

    async function fetchRecipe() {
      try {
        setLoading(true);
        const API_BASE = (
          process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"
        ).replace(/\/$/, "");
        const response = await fetch(`${API_BASE}/api/recipes?lang=${lang}`);

        if (!response.ok) {
          throw new Error(
            lang === "bn"
              ? "রেসিপি লোড করতে সমস্যা হয়েছে"
              : "Failed to load recipe",
          );
        }

        const data = await response.json();
        let recipeList = Array.isArray(data) ? data : data?.recipes || [];

        const singleRecipe = recipeList.find(
          (item) =>
            String(item._id) === String(recipeId) ||
            String(item.id) === String(recipeId),
        );

        if (!singleRecipe) {
          throw new Error(
            lang === "bn" ? "রেসিপিটি পাওয়া যায়নি!" : "Recipe not found!",
          );
        }

        setRecipe(singleRecipe);
      } catch (err) {
        setError(err.message || "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [recipeId, lang]);

  const steps = recipe?.steps || [
    {
      id: 1,
      title: lang === "bn" ? "প্রস্তুতি" : "Preparation",
      instruction:
        getText(recipe?.description) ||
        (lang === "bn"
          ? "রান্না শুরু করার আগে সমস্ত উপকরণ প্রস্তুত করুন।"
          : "Prepare all ingredients before cooking."),
      duration: lang === "bn" ? "৫ মিনিট" : "5 mins",
      durationSeconds: 300,
    },
  ];

  const activeStepData = steps[currentStep];

  const getSecondsFromStep = useCallback((step) => {
    if (!step) return 300;
    if (step.durationSeconds) return Number(step.durationSeconds);
    const parsedMinutes = parseInt(step.duration, 10);
    return isNaN(parsedMinutes) ? 300 : parsedMinutes * 60;
  }, []);

  useEffect(() => {
    if (activeStepData) {
      setTimeLeft(getSecondsFromStep(activeStepData));
      setIsTimerRunning(false);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    }
  }, [currentStep, activeStepData, getSecondsFromStep]);

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const toggleStepComplete = (index) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep === steps.length - 1) {
      const existingCompleted =
        JSON.parse(localStorage.getItem("completedRecipes")) || [];

      if (!existingCompleted.includes(recipeId)) {
        const updatedCompleted = [...existingCompleted, recipeId];
        localStorage.setItem(
          "completedRecipes",
          JSON.stringify(updatedCompleted),
        );
      }

      const totalCooked = Number(localStorage.getItem("recipesCookedCount"));
      localStorage.setItem("recipesCookedCount", totalCooked + 1);

      router.push(`/messages/${recipeId}/success`);
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = Math.round(
    ((currentStep + 1) / steps.length) * 100,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-[#111111] transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#00A86B] animate-spin" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {lang === "bn"
              ? "রান্নার সেশন লোড হচ্ছে..."
              : "Loading cooking session..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] dark:bg-[#111111] transition-colors duration-300 gap-4">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {error ||
            (lang === "bn" ? "রেসিপি পাওয়া যায়নি!" : "Recipe not found!")}
        </p>
        <button
          onClick={() => router.back()}
          className="px-5 py-2.5 bg-[#00A86B] text-white rounded-xl text-sm font-semibold cursor-pointer hover:bg-[#00915c] transition-colors"
        >
          {lang === "bn" ? "ফিরে যান" : "Go Back"}
        </button>
      </div>
    );
  }

  const recipeTitle = getText(recipe.title) || "Recipe";

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#111111] text-gray-900 dark:text-gray-100 font-sans pb-32 lg:pb-16 transition-colors duration-300">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors font-medium text-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">
              {lang === "bn" ? "কুকিং মোড থেকে বের হন" : "Exit Cooking Mode"}
            </span>
          </button>

          <div className="text-center">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg line-clamp-1">
              {recipeTitle}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {lang === "bn"
                ? `ধাপ ${currentStep + 1} / ${steps.length}`
                : `Step ${currentStep + 1} of ${steps.length}`}
            </p>
          </div>

          {/* Right Action Icons: Language Toggle & Speech */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={() => setLang((prev) => (prev === "bn" ? "en" : "bn"))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#00A86B]" />
              <span>{lang === "bn" ? "বাংলা" : "EN"}</span>
            </button>
          </div>
        </div>

        {/* Cooking Progress Bar */}
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1">
          <div
            className="bg-[#00A86B] h-1 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-6 lg:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Step Details */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="relative h-64 sm:h-80 w-full rounded-[28px] overflow-hidden shadow-sm bg-gray-100 dark:bg-gray-800">
              <Image
                src={getImageUrl(
                  activeStepData?.image || recipe?.image || recipe?.imageUrl,
                )}
                alt={getText(activeStepData?.title) || "Step image"}
                fill
                priority
                className="object-cover"
                unoptimized
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {getText(activeStepData?.duration) ||
                    (lang === "bn" ? "৫ মিনিট" : "5 mins")}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] rounded-[28px] p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-[#00A86B] uppercase tracking-wider">
                  {lang === "bn"
                    ? `ধাপ ${currentStep + 1}`
                    : `Step ${activeStepData?.id || currentStep + 1}`}
                </span>
                <button
                  onClick={() => toggleStepComplete(currentStep)}
                  className="flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer"
                >
                  {completedSteps.includes(currentStep) ? (
                    <span className="text-[#00A86B] flex items-center gap-1">
                      <CheckCircle2 className="w-5 h-5 fill-[#00A86B] text-white " />{" "}
                      {lang === "bn" ? "সম্পন্ন" : "Done"}
                    </span>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1">
                      <Circle className="w-5 h-5" />{" "}
                      {lang === "bn" ? "মার্কে কমপ্লিট" : "Mark complete"}
                    </span>
                  )}
                </button>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {getText(activeStepData?.title) ||
                  (lang === "bn"
                    ? `ধাপ ${currentStep + 1}`
                    : `Step ${currentStep + 1}`)}
              </h2>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base lg:text-lg mb-4">
                {getText(activeStepData?.instruction) ||
                  activeStepData?.instruction}
              </p>
            </div>
          </div>

          {/* Right Column - Timer & All Steps */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Step Timer Widget */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-[28px] p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between transition-colors">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                  {lang === "bn" ? "স্টেপ টাইমার" : "Step Timer"}
                </p>
                <p className="text-3xl text-gray-900 dark:text-gray-100 tracking-tight mt-1 font-mono font-bold">
                  {formatTime(timeLeft)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-3.5 rounded-2xl bg-[#00A86B] text-white hover:bg-[#00915c] transition-colors shadow-sm cursor-pointer"
                >
                  {isTimerRunning ? (
                    <Pause className="w-5 h-5 fill-white dark:fill-black text-black" />
                  ) : (
                    <Play className="w-5 h-5 fill-white dark:fill-black text-black" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimeLeft(getSecondsFromStep(activeStepData));
                  }}
                  className="p-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Timeline Steps List */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-[28px] p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex-1 transition-colors">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">
                {lang === "bn" ? "সকল ধাপসমূহ" : "All Steps"}
              </h3>
              <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
                {steps.map((s, idx) => {
                  const isActive = idx === currentStep;
                  const isDone = completedSteps.includes(idx);
                  const stepTitle =
                    getText(s.title) ||
                    (lang === "bn" ? `ধাপ ${idx + 1}` : `Step ${idx + 1}`);

                  return (
                    <button
                      key={s.id || idx}
                      onClick={() => setCurrentStep(idx)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/30 border-2 border-[#00A86B]"
                          : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-[#00A86B] fill-[#00A86B] text-white shrink-0" />
                        ) : (
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                              isActive
                                ? "border-[#00A86B] text-[#00A86B]"
                                : "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                            }`}
                          >
                            {idx + 1}
                          </span>
                        )}
                        <span
                          className={`text-sm font-semibold line-clamp-1 ${
                            isActive
                              ? "text-gray-900 dark:text-gray-100"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {stepTitle}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium shrink-0 ml-2">
                        {getText(s.duration) ||
                          (lang === "bn" ? "৫ মিনিট" : "5 mins")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Sticky Controller Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 py-4 px-6 z-40 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">
              {lang === "bn" ? "পূর্ববর্তী" : "Previous"}
            </span>
          </button>

          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            {currentStep + 1} / {steps.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-black bg-[#00A86B] hover:bg-[#00915c] transition-colors shadow-md font-Manrope cursor-pointer"
          >
            <span>
              {currentStep === steps.length - 1
                ? lang === "bn"
                  ? "রান্না শেষ করুন"
                  : "Finish Cooking"
                : lang === "bn"
                  ? "পরবর্তী ধাপ"
                  : "Next Step"}
            </span>
            {currentStep === steps.length - 1 ? (
              <Sparkles className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
