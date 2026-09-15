"use client";

import { useEffect, useMemo, useState } from "react";
import { getTimeBasedMessage } from "@/utils/hooks";
import { Heading } from "./shared/heading";
import { FoodCard } from "./ui/card"; 

export default function PickFromCategory() {
  const timeMessage = getTimeBasedMessage();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const recipeId = recipes?._id || recipes?.id;
  // based on user timezone place food category
  const currentCategory = useMemo(() => {
    const hours = new Date().getHours();

    if (hours >= 5 && hours < 11) return "Breakfast";
    if ((hours >= 11) & (hours < 16)) return "Lunch";
    if (hours >= 16 && hours < 22) return "Dinner";
    return "Snack";
  }, []);

  useEffect(() => {
    const fetchCategoryRecipes = async () => {
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
        const filtered = recipeData.filter(
          (recipe) =>
            recipe.category?.toLowerCase() ===
            currentCategory.toLocaleLowerCase(),
        );

        setRecipes(filtered.length > 0 ? filtered : recipeData);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryRecipes();
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

  return (
    <div className="py-6 px-4 sm:px-6 bg-white dark:bg-[#111111] transition-colors duration-300">
      {/* 1. Header Section with See All Action */}
      <div className="flex items-center justify-between mb-4">
        <Heading
          className="leading-tight text-xl sm:text-2xl text-gray-900 dark:text-gray-100 font-semibold font-borel"
          label={timeMessage?.text || "Popular Recipes"}
        />
       </div>

      {/* 2. Horizontal Scroll Wrapper */}
      <div className="w-full overflow-x-auto py-2 scrollbar-hide -mx-2 px-2">
        {loading ? (
          /* Skeleton Loading UI for smooth experience */
          <div className="flex gap-4 min-w-max">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="w-64 sm:w-72 h-44 rounded-[32px] bg-gray-100 dark:bg-gray-800/50 animate-pulse shrink-0"
              />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          /* Empty State */
          <div className="py-8 text-center sm:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recipes found for this section.
            </p>
          </div>
        ) : (
          /* Recipe Cards Row */
          <div className="flex gap-4 min-w-max py-1 px-1">
            {recipes.slice(0, 6).map((recipe, index) => {
              const recipeId = recipe._id || recipe.id || index;

              return (
                <div key={recipeId} className="w-64 sm:w-72 shrink-0">
                  <FoodCard
                    recipe={recipe}
                    id={recipeId}
                    index={index}
                    title={getTitle(recipe)}
                    image={getImageUrl(recipe?.image || recipe?.imageUrl)}
                    time={recipe.cookingTime || recipe.time || "20 min"}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 