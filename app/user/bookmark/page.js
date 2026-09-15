"use client";

import DashboardLayout from "@/layout/user";
import { getBookmarks, toggleBookmark } from "@/utils/bookmark";
import {
  ArrowLeft,
  Bookmark,
  Laptop,
  Moon,
  Sun,
  TimerIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);

  useEffect(() => {
    setBookmarkedRecipes(getBookmarks());
  }, []);

  const handleRemoveBookmark = (recipe) => {
    toggleBookmark(recipe);
    setBookmarkedRecipes(getBookmarks());
  };
  return (
    <DashboardLayout>
  <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#121212]/2 text-gray-900 dark:text-gray-100 pb-16 transition-colors duration-300">
        {/* Show bookmarked recipes */}
        <div className="max-w-full mx-auto px-4 sm:px-6 mt-8 space-y-6">
          {/* Bookmarked Recipes Section */}
          <div className="backdrop-blur-md rounded-3xl p-4 sm:p-8 shadow-xl shadow-gray-100/50 dark:shadow-none space-y-6">
         

            {/* Recipe List */}
            {bookmarkedRecipes.length === 0 ? (
              <div className="rounded-[24px] p-10 sm:p-14 text-center border border-dashed border-gray-200 dark:border-gray-800/20 bg-gray-50/50 dark:bg-[#18181b]/2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800/2 flex items-center justify-center text-gray-400">
                  <TimerIcon className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  No saved recipes yet!
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 max-w-xs mx-auto">
                  Explore and choose your favorite recipes to keep them handy
                  for later.
                </p>
              </div>
            ) : (
              // Responsive Grid Fixed Here
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                {bookmarkedRecipes.map((recipe) => {
                  const id = recipe._id || recipe.id;
                  const recipeTitle =
                    typeof recipe.title === "object"
                      ? recipe.title.bn || recipe.title.en
                      : recipe.title;

                  return (
                    <div
                      key={id}
                      className="group relative flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-gray-50/80 dark:bg-[#222222] hover:bg-white dark:hover:bg-[#282828] hover:border-emerald-500/30 dark:hover:border-emerald-500/30 shadow-xs hover:shadow-md transition-all duration-200"
                    >
                      <Link
                        href={`/cooking/${id}`}
                        className="flex-1 font-medium text-sm text-gray-800 dark:text-gray-200 group-hover:text-[#00A86B] dark:group-hover:text-emerald-400 truncate pr-3 transition-colors"
                      >
                        {recipeTitle}
                      </Link>

                      <button
                        onClick={() => handleRemoveBookmark(recipe)}
                        title="Remove bookmark"
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all duration-150 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
    </DashboardLayout>
  );
};

export default page;
