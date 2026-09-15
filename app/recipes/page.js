"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Utensils, Loader2, ChefHat, RotateCw } from "lucide-react";
import { RecipeCard } from "@/components/ui/card";

const page = () => {
  const searchParams = useSearchParams();
  const ingredientsParam = searchParams.get("ingredients");

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!ingredientsParam) {
        setRecipes([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // URL param (e.g. ?ingredients=Egg,Potato) থেকে array তৈরি করা
      const ingredients = ingredientsParam
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes/search-by-ingredients`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredients }),
          },
        );

        const data = await res.json();
        setRecipes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [ingredientsParam]);

  // Helper functions
  const getTitle = (recipe) => {
    if (!recipe?.title) return "Untitled Recipe";
    if (typeof recipe.title === "string") return recipe.title;
    return recipe.title.en || recipe.title.bn || "Untitled Recipe";
  };

  const getDescription = (recipe) => {
    if (!recipe?.description) return "No description available.";
    if (typeof recipe.description === "string") return recipe.description;
    return (
      recipe.description.en ||
      recipe.description.bn ||
      "No description available."
    );
  };

  const getImageUrl = (recipe) => {
    if (recipe?.image) return recipe.image;
    if (recipe?.imageUrl) return recipe.imageUrl;
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
  };

  return (
    <div className="min-h-screen bg-gray-50  p-6 md:p-8 text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold mb-6 font-comfortaa text-slate-900  flex items-center gap-2">
          <span>Matching Recipes</span>
        </h3>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-3" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Finding delicious recipes for you...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && (
          <div className="text-center py-16   rounded-3xl">
            <p className="text-slate-900  font-medium text-xl ">
              No recipes found with these ingredients. Try adding more items!
            </p>
            <button className="p-3 px-5 font-medium font-comfortaa bg-black text-white rounded-full mt-4  hover:opacity-95 cursor-pointer">
              <div className="flex items-center gap-2 p-2">
                <RotateCw className="w-4 h-4" /> Try Again.
              </div>
            </button>
          </div>
        )}

        {/* Recipes Grid */}
        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <RecipeCard
                key={index}
                id={recipe._id}
                recipe={recipe}
                getTitle={getTitle}
                getDescription={getDescription}
                getImageUrl={getImageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
