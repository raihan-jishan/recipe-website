"use client";
import React, { useState, useEffect } from "react";
import { Heading } from "@/components/shared/heading";
import { FoodCard } from "@/components/ui/card";

export default function TrendingSection() {
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingRecipes = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes`,
        );
        const data = await res.json();

        let recipeData = [];
        if (Array.isArray(data)) {
          recipeData = data;
        } else if (data?.recipes && Array.isArray(data.recipes)) {
          recipeData = data.recipes;
        }

        // 🟢 সম্পূর্ণ ফ্রন্টএন্ড ভিত্তিক ট্রেন্ডিং ফিল্টারিং লজিক:
        // ১. লোকালস্টোরেজ থেকে ইউজারের ক্লিক হিস্ট্রি নেওয়া
        const localClicks = JSON.parse(
          localStorage.getItem("recipe_click_counts") || "{}",
        );

        // ২. রেসিপিগুলোকে ক্লিক বা রেটিং বা ফ্রন্টএন্ড স্কোর অনুযায়ী সাজানো
        const scoredRecipes = recipeData.map((recipe) => {
          const id = recipe._id || recipe.id;
          const clickScore = localClicks[id] || 0;
          const ratingScore = recipe.rating ? recipe.rating * 10 : 20;

          return {
            ...recipe,
            trendScore: clickScore * 50 + ratingScore,
          };
        });

        const sortedTrending = scoredRecipes
          .sort((a, b) => b.trendScore - a.trendScore)
          .slice(0, 6);

        setTrendingRecipes(sortedTrending);
      } catch (error) {
        console.error("Error fetching trending recipes:", error);
        setTrendingRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingRecipes();
  }, []);

  const getTitle = (recipe) => {
    if (!recipe?.title) return "Delicious Meal";
    if (typeof recipe.title === "string") return recipe.title;
    return recipe.title.en || recipe.title.bn || "Delicious Meal";
  };

  const getImageUrl = (recipe) => {
    if (recipe?.image) return recipe.image;
    if (recipe?.imageUrl) return recipe.imageUrl;
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
  };
  const handleRecipeClick = (recipeId) => {
    const localClicks = JSON.parse(
      localStorage.getItem("recipe_click_counts") || "{}",
    );
    localClicks[recipeId] = (localClicks[recipeId] || 0) + 1;
    localStorage.setItem("recipe_click_counts", JSON.stringify(localClicks));
  };

  return (
    <div className="p-2 px-4 sm:px-6 mt-8">
      <div className="flex items-center justify-between mb-3">
        <Heading
          className="text-xl sm:text-2xl text-gray-900 dark:text-white font-bold font-montserrat flex items-center gap-2"
          label="Trending Now 🔥"
        />
      </div>

      {loading ? (
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
      ) : trendingRecipes.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          No trending recipes found.
        </p>
      ) : (
        <div className="w-full overflow-x-auto py-2 scrollbar-hide -mx-2 px-2">
          <div className="flex gap-4 min-w-max py-1">
            {trendingRecipes.map((recipe, index) => {
              const recipeId = recipe._id || recipe.id || index;

              return (
                <div
                  key={recipeId}
                  className="w-64 sm:w-72 shrink-0 cursor-pointer"
                  onClick={() => handleRecipeClick(recipeId)}
                >
                  <FoodCard
                    id={recipeId}
                    recipe={recipe}
                    index={index}
                    title={getTitle(recipe)}
                    image={getImageUrl(recipe?.image || recipe?.imageUrl)}
                    time={`${
                      recipe.cookTime || recipe.prepTime || recipe.time || 20
                    } min`}
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
