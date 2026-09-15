"use client";
import { Bookmark, TrendingUp } from "lucide-react";
import Image from "next/image";

import {   Clock, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toggleBookmark, isRecipeBookmarked } from "@/utils/bookmark";

export function FoodCard({ id, index = 0, title, time, image, recipe }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      setIsSaved(isRecipeBookmarked(id));
    }
  }, [id]);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!recipe) return;

    const savedState = toggleBookmark(recipe);
    setIsSaved(savedState);
  };

  const BG_COLORS = [
    "bg-emerald-50/80 dark:bg-emerald-950/30",
    "bg-[#FEF6C3]/70 dark:bg-amber-950/30",
    "bg-[#E0E7FF]/70 dark:bg-indigo-950/30",
    "bg-[#FCE7F3]/70 dark:bg-pink-950/30",
    "bg-[#FFEDD5]/70 dark:bg-orange-950/30",
    "bg-[#F3E8FF]/70 dark:bg-purple-950/30",
  ];

  const cardBgClass = BG_COLORS[index % BG_COLORS.length];
  const fallbackImage =
    "https://www.yummytummyaarthi.com/wp-content/uploads/2022/11/red-sauce-pasta-1.jpg";

  // URL Fix: External URL নাকি Localhost Path তা চেক করা
  let finalImageUrl = fallbackImage;
  if (typeof image === "string" && image.trim() !== "") {
    finalImageUrl = image.startsWith("https")
      ? image
      : `${process.env.NEXT_PUBLIC_SERVER_URL}${image.replace(/^\//, "")}`;
  }

  return (
    <div
      key={id}
      className={`group relative w-full h-44 ${cardBgClass} rounded-[32px] p-5 flex items-center justify-between border border-white/60 dark:border-gray-800/40 backdrop-blur-sm shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
    >
      {/* 1. Left Content Area */}
      <div className="flex flex-col justify-between h-full z-10 max-w-[58%] max-lg:max-w-full pr-2">
        <Link href={`/details/${id}`} className="my-auto">
          <h3 className="text-base sm:text-[1.15rem] font-bold text-gray-900 dark:text-gray-100 leading-snug font-comfortaa line-clamp-2 group-hover:text-[#00A86B] transition-colors cursor-pointer">
            {title || "Untitled Recipe"}
          </h3>
        </Link>

        {/* Time Badge */}
        <div className="flex items-center gap-1.5 bg-white/80 dark:bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full w-fit   border border-gray-100 dark:border-gray-800/40 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-[#00A86B]" />
          <span className="text-xs  font-semibold text-gray-700 dark:text-gray-300">
            {time || "15 mins"}
          </span>
        </div>
      </div>

      {/* 2. Right Side Image (Clean Floating Circular Visual) */}
      <div className="relative w-36 h-36 shrink-0 z-0">
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg relative group-hover:scale-105 transition-transform duration-300">
          <Image
            src={finalImageUrl}
            alt={title || "Recipe Image"}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        {/* Floating Bookmark Button */}
        <button
          type="button"
          onClick={handleBookmarkClick}
          className="absolute -top-1 -right-1 z-20 w-9 h-9 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:scale-110 active:scale-95 transition-all shadow-md border border-gray-100 dark:border-gray-800 cursor-pointer"
        >
          <Bookmark
            className={`w-4 h-4 transition-colors ${
              isSaved
                ? "fill-[#00A86B] text-[#00A86B]"
                : "text-gray-400 group-hover:text-gray-600"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export function CountingCard({ label, point, trend = "+12%" }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-[#111111] p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-md hover:border-emerald-100">
      {/* Background Accent Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Header: Label & Trend Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-200">
            {label}
          </span>

          {/* Accent Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{trend}</span>
          </div>
        </div>

        {/* Counter Value */}
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-extrabold text-gray-900  dark:text-gray-50 tracking-tight">
            {point}
          </h3>
        </div>
      </div>
    </div>
  );
} 

export function RecipeCard({
  id,
  getImageUrl,
  getTitle,
  getDescription,
  recipe,
}) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const targetId = id || recipe?._id || recipe?.id;
    if (targetId) {
      setIsSaved(isRecipeBookmarked(targetId));
    }
  }, [id, recipe]);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!recipe) return;

    const savedState = toggleBookmark(recipe);
    setIsSaved(savedState);
  };

  const recipeId = id || recipe?._id || recipe?.id || "";
  const imageUrl = getImageUrl ? getImageUrl(recipe) : recipe?.image || "/placeholder-food.jpg";
  const title = getTitle ? getTitle(recipe) : recipe?.title || "Untitled Recipe";
  const description = getDescription ? getDescription(recipe) : recipe?.description || "";

  return (
    <div
      key={recipeId}
      className="group relative bg-gray-900 rounded-[32px] overflow-hidden transition-all duration-500 flex flex-col h-[400px] shadow-sm hover:shadow-2xl hover:-translate-y-1.5 border border-gray-100/10"
    >
      {/* 1. Bookmark Button on Top Right */}
      <button
        type="button"
        onClick={handleBookmarkClick}
        className="absolute top-4 right-4 z-30 p-3 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md text-white transition-all duration-300 active:scale-90 cursor-pointer border border-white/20 shadow-lg"
        aria-label="Bookmark Recipe"
      >
        <Bookmark
          className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
            isSaved ? "fill-[#00A86B] text-[#00A86B]" : "text-white"
          }`}
        />
      </button>

      {/* 2. Full Card Background Image with Smooth Hover Zoom */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        unoptimized
        className="object-cover z-0 transition-transform duration-700 group-hover:scale-110"
      />

      {/* 3. Gradient Overlay for Perfect Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10 pointer-events-none" />

      {/* 4. Content Section Floating Over Image */}
      <div className="relative z-20 p-6 flex flex-col flex-1 justify-end">
        <div>
          <h4 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-1 font-comfortaa group-hover:text-emerald-400 transition-colors">
            {title}
          </h4>
          <p className="text-xs sm:text-sm text-gray-300/90 line-clamp-2 mb-6 font-montserrat leading-relaxed">
            {description}
          </p>
        </div>

        {/* Cook Now Button (Centered Text & Icon) */}
        <div className="flex items-center justify-start">
          <Link
            href={`/details/${recipeId}`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-[#00A86B] text-gray-900 hover:text-white font-bold text-sm transition-all duration-300 shadow-lg font-montserrat rounded-full group/btn"
          >
            <span>Cook Now</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}