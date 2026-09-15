"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Bookmark,
  Star,
  Clock,
  BarChart2,
  Loader2,
  Utensils,
  Egg,
  Fish,
  Apple,
  Wheat,
  Droplet,
  Milk,
  Carrot,
  Cookie,
  Beef,
  Flame,
  Drumstick,
  Shell,
  User,
} from "lucide-react";

const ingredientIconMap = {
  chicken: Drumstick,
  beef: Beef,
  egg: Egg,
  fish: Fish,
  apple: Apple,
  flour: Wheat,
  wheat: Wheat,
  oil: Droplet,
  water: Droplet,
  milk: Milk,
  carrot: Carrot,
  onion: Shell,
  sugar: Cookie,
  chocolate: Cookie,
  almond: Cookie,
};

import { InfoBadges } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleBookmark, isRecipeBookmarked } from "@/utils/bookmark";

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes`,
        );

        if (!res.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await res.json();

        let recipeList = [];
        if (Array.isArray(data)) {
          recipeList = data;
        } else if (data?.recipes && Array.isArray(data.recipes)) {
          recipeList = data.recipes;
        }

        const singleRecipe = recipeList.find(
          (item) =>
            String(item._id) === String(id) || String(item.id) === String(id),
        );

        setRecipe(singleRecipe || null);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] dark:bg-gray-900 gap-4 transition-colors">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Recipe not found!
        </p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Helpers
  const title =
    typeof recipe.title === "string"
      ? recipe.title
      : recipe.title?.en || recipe.title?.bn || "Recipe Details";

  // Fixed Image URL Generator
// Fixed Image URL Generator with Debugging
  const getImageUrl = (recipeObj) => {
    const fallbackImage =
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";

    const imagePath = recipeObj?.image || recipeObj?.imageUrl || recipeObj?.img;

    console.log("Recipe Object:", recipeObj); // ব্রাউজারে অবজেক্ট চেক করার জন্য
    console.log("Extracted Image Path:", imagePath); // ডাটাবেজে কি পাথ আছে দেখার জন্য

    if (
      !imagePath ||
      typeof imagePath !== "string" ||
      imagePath.trim() === ""
    ) {
      return fallbackImage;
    }

    // যদি ইতোমধ্যেই পূর্ণাঙ্গ URL (http/https) হয়ে থাকে
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    try {
      const API_BASE = (
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"
      ).replace(/\/$/, "");
      
      const cleanPath = imagePath.replace(/\\/g, "/").replace(/^\//, "");
      const finalUrl = `${API_BASE}/${cleanPath}`;
      
      console.log("Generated Final Image URL:", finalUrl); // ফাইনাল ইউআরএল দেখতে পারবেন
      return finalUrl;
    } catch (err) {
      return fallbackImage;
    }
  };

  const cookTime =
    recipe.cookTime || recipe.prepTime || recipe.cookingTime || "20";
  const difficulty = recipe.difficulty || "Medium";
  const calories = recipe.calories || recipe.cal || "450";
  const servings = recipe.servings || "1";
  const rating = recipe.rating || "4.5";
  const description =
    recipe.description || "A delicious recipe prepared with fresh ingredients.";
  const ingredients = recipe.ingredients || [];

  const renderIngredientIcon = (name) => {
    if (!name) return <Utensils className="w-5 h-5 text-amber-500" />;
    const lowerName = name.toLowerCase();

    const matchedKey = Object.keys(ingredientIconMap).find((key) =>
      lowerName.includes(key),
    );

    const IconComponent = matchedKey ? ingredientIconMap[matchedKey] : Utensils;

    return <IconComponent className="w-5 h-5 text-black dark:text-gray-200" />;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#111111] text-gray-900 dark:text-gray-100 font-sans pb-24 lg:pb-12 transition-colors duration-300">
      <div className="max-w-md lg:max-w-6xl mx-auto relative">
        {/* Desktop Header Navigation */}
        <div className="hidden lg:flex justify-between items-center px-8 py-6">
          <button
            onClick={() => router.back()}
            className="p-2.5 rounded-full bg-white dark:bg-zinc-900 dark:text-gray-100 text-gray-800 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all shadow-sm flex items-center gap-2 px-4 text-sm font-semibold cursor-pointer border border-transparent dark:border-zinc-800"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            type="button"
            onClick={handleBookmarkClick}
            className="absolute top-4 right-4 z-30 p-3 rounded-full bg-black/30 hover:bg-gray-400/20 backdrop-blur-md text-white transition-all duration-300 active:scale-90 cursor-pointer border border-white/20 shadow-lg"
            aria-label="Bookmark Recipe"
          >
            <Bookmark
              size={30}
              className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                isSaved ? "fill-[#00A86B] text-[#00A86B]" : "text-white"
              }`}
            />
          </button>
        </div>

        {/* Main Grid */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:px-8 lg:mt-4">
          {/* Left Column: Hero Image */}
          <div className="lg:col-span-6">
            <div className="relative h-80 lg:h-[500px] w-full lg:rounded-4xl overflow-hidden lg:shadow-md">
              <Image
                src={getImageUrl(recipe)}
                alt={title}
                fill
                priority
                className="object-cover"
                unoptimized
              />

              {/* Mobile Floating Buttons */}
              <div className="lg:hidden absolute top-6 left-0 right-0 px-6 flex justify-between items-center z-10">
                <button
                  onClick={() => router.back()}
                  className="p-2.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-sm"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleBookmarkClick}
                  className="p-2.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-sm"
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? "fill-[#00A86B] text-[#00A86B]" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-6 relative -mt-8 lg:mt-0 bg-white dark:bg-[#111111] lg:bg-transparent rounded-t-4xl lg:rounded-none px-6 lg:px-0 pt-3 lg:pt-0 pb-8 lg:pb-0 shadow-sm lg:shadow-none flex flex-col justify-between">
            <div>
              {/* Mobile Handle Bar */}
              <div className="lg:hidden w-12 h-1 bg-gray-200 dark:bg-zinc-800 rounded-full mx-auto my-3" />

              {/* Title & Rating */}
              <div className="flex justify-between items-start mt-2 lg:mt-0">
                <div>
                  <h1 className="text-2xl lg:text-4xl font-semibold text-gray-900 dark:text-gray-100 font-montserrat">
                    {title}
                  </h1>
                </div>
                <div className="flex items-center gap-1 font-bold text-gray-900 text-sm lg:text-base border dark:border-zinc-800 dark:text-white bg-amber-50 dark:bg-zinc-900 px-3 py-1.5 rounded-full">
                  <Star className="w-4 h-4 lg:w-5 lg:h-5 fill-amber-400 text-amber-500" />
                  <span>{rating}</span>
                </div>
              </div>

              {/* Quick Info Badges */}
              <div className="flex items-center gap-6 mt-5 lg:mt-6 text-gray-800 dark:text-gray-400 text-sm lg:text-base">
                <InfoBadges Icon={Clock} label={`${cookTime} Mins`} />
                <InfoBadges Icon={BarChart2} label={difficulty} />
                <InfoBadges Icon={Flame} label={`${calories} cal`} />
                <InfoBadges Icon={User} label={`${servings} per.`} />
              </div>

              {/* Description */}
              <div className="mt-6 lg:mt-8">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">
                  Description
                </h2>
                <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Ingredients */}
              {ingredients.length > 0 && (
                <div className="mt-6 lg:mt-8">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 dark:text-gray-100">
                    Ingredients
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ingredients.map((item, idx) => {
                      const name = typeof item === "string" ? item : item.name;
                      const amount =
                        typeof item === "object" ? item.amount : "";
                      const unit = typeof item === "object" ? item.unit : "";
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 lg:p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 lg:bg-white lg:dark:bg-zinc-900 lg:shadow-sm border border-transparent dark:border-zinc-800/60"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gray-200/60 dark:bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                              {renderIngredientIcon(name)}
                            </div>
                            <span className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-200">
                              {name}
                            </span>
                          </div>
                          {amount && (
                            <span className="text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-200">
                              {amount} {unit}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Action Button */}
            <div className="max-lg:hidden mt-8">
              <Button
                path={`/start-cooking/${recipe._id || recipe.id}`}
                varients={"primary"}
              >
                Start Cooking
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Button (Mobile Only) */}
      <div className="lg:hidden fixed bottom-6 left-0 right-0 flex justify-center items-center px-6 z-20">
        <div className="w-full max-w-md">
          <Button path={`/start-cooking/${recipe._id || recipe.id}`} varients={"primary"}>
            Start Cooking
          </Button>
        </div>
      </div>
    </div>
  );
}