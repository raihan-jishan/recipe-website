"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { CheckCircle2, Home, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookingSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params?.id;

  const [recipe, setRecipe] = useState(null);
  const getImageUrl = (imagePath) => {
    const fallbackImage =
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";

    // ডাটা না থাকলে বা খালি স্ট্রিং হলে সরাসরি ফলব্যাক ইউআরএল দেবে
    if (
      !imagePath ||
      typeof imagePath !== "string" ||
      imagePath.trim() === ""
    ) {
      return fallbackImage;
    }

    // যদি ইতোমধ্যেই পূর্ণাঙ্গ URL (http/https) হয়ে থাকে
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    try {
      const API_BASE = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/$/, "");
      const cleanPath = imagePath.replace(/\\/g, "/").replace(/^\//, "");
      return `${API_BASE}/${cleanPath}`;
    } catch (err) {
      return fallbackImage;
    }
  };
  useEffect(() => {
    if (!recipeId) return;

    async function fetchRecipe() {
      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${API_BASE}/api/recipes`);
        if (!response.ok) return;

        const data = await response.json();
        let recipeList = Array.isArray(data) ? data : data?.recipes || [];

        const singleRecipe = recipeList.find(
          (item) =>
            String(item._id) === String(recipeId) ||
            String(item.id) === String(recipeId),
        );

        if (singleRecipe) setRecipe(singleRecipe);
      } catch (err) {
        console.error("Error fetching recipe", err);
      }
    }

    fetchRecipe();
  }, [recipeId]);

  const recipeTitle =
    typeof recipe?.title === "string"
      ? recipe.title
      : recipe?.title?.en || recipe?.title?.bn || "Recipe";

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#111111] flex items-center justify-center p-6 text-gray-900 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-[#111111] rounded-4xl p-8 shadow-sm border border-gray-900 text-center flex flex-col items-center">
        {/* Animated Success Badge */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-emerald-100  flex items-center justify-center">
            <Trophy className="w-12 h-12 text-[#00A86B]" />
          </div>
          <span className="absolute -top-1 -right-1 bg-amber-400 p-2 rounded-full text-white shadow-md">
            <Sparkles className="w-5 h-5 fill-white" />
          </span>
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-200 mb-2">
          congratulation
        </h1>
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6">
          You have successfully finished making
          <br /> <span className="font-bold text-gray-800">{recipeTitle}</span>
        </p>
         {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <Link
            href={"/"}
            onClick={() => router.push("/")}
            className="w-full py-3.5 bg-black dark:bg-white font-montserrat text-white dark:text-black rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>

          <Link
            href={`/details/${recipeId}`}
            onClick={() => router.push(`/recipes/${recipeId}/cooking`)}
            className="w-full py-3.5 bg-gray-200/60 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Cook Again
          </Link>
        </div>
      </div>
    </div>
  );
}
