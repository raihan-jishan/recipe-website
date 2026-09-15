"use client";

import { useEffect, useState } from "react";
import { Heading } from "./shared/heading";
import { FoodCard } from "./ui/card";
import { Loader2, Zap } from "lucide-react";

export default function QuickAndEasySection() {
  const [quickRecipes, setQuickRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuickRecipes = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes`);
        const data = await res.json();

        let recipeData = [];
        if (Array.isArray(data)) {
          recipeData = data;
        } else if (data?.recipes && Array.isArray(data.recipes)) {
          recipeData = data.recipes;
        }

        // ⏱️ ২৫ মিনিটের কম সময়ে তৈরি করা রেসিপি ফিল্টার (বা প্রথম ৫টি)
        const filtered = recipeData.filter((recipe) => {
          const timeNum = parseInt(recipe.cookingTime || recipe.time || "20");
          return timeNum <= 25;
        });

        // ফিল্টার করা রেসিপি না থাকলে নরমাল ডাটা থেকে ৫টি সেট করবে
        setQuickRecipes(
          filtered.length > 0 ? filtered.slice(0, 5) : recipeData.slice(0, 5),
        );
      } catch (error) {
        console.error("Error fetching quick recipes:", error);
        setQuickRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuickRecipes();
  }, []);

  const getTitle = (recipe) => {
    if (!recipe?.title) return "Quick Meal";
    if (typeof recipe.title === "string") return recipe.title;
    return recipe.title.en || recipe.title.bn || "Quick Meal";
  };

 const getImageUrl = (recipe) => {
    if (recipe?.image) return recipe.image;
    if (recipe?.imageUrl) return recipe.imageUrl;
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
  };

  return (
  <div className="p-2 px-4 sm:px-6 mt-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <Heading
            className="text-xl sm:text-2xl text-gray-900 dark:text-white font-bold font-montserrat"
            label="Quick & Easy"
          />
        </div>

        {/* Dynamic / Styled Badge */}
        <span className="text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full shadow-2xs">
          ⚡ Under 25 mins
        </span>
      </div>

      {/* Horizontal Scroll Bar */}
      {loading ? (
        /* Skeleton Loading UI */
        <div className="w-full overflow-x-auto py-2 scrollbar-hide -mx-2 px-2">
          <div className="flex gap-4 min-w-max py-1">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="w-64 sm:w-72 h-44 rounded-[32px] bg-amber-500/10 dark:bg-amber-950/20 animate-pulse shrink-0"
              />
            ))}
          </div>
        </div>
      ) : quickRecipes.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          No quick recipes available right now.
        </p>
      ) : (
        <div className="w-full overflow-x-auto py-2 scrollbar-hide -mx-2 px-2">
          <div className="flex gap-4 min-w-max py-1">
            {quickRecipes.map((recipe, index) => {
              const recipeId = recipe._id || recipe.id || index;

              return (
                <div key={recipeId} className="w-64 sm:w-72 shrink-0">
                  <FoodCard
                    id={recipeId}
                    recipe={recipe}
                    index={index}
                    title={getTitle(recipe)}
                    image={getImageUrl(recipe?.image || recipe?.imageUrl)}
                    time={recipe.cookingTime || recipe.time || "15 min"}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
