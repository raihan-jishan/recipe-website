"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Clock,
  Users,
  ArrowLeft,
  Search,
  Utensils,
  Heart,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function CategoryRecipesPage({ params }) {
  const resolvedParams = use(params);
  const categorySlug = decodeURIComponent(resolvedParams.slug).toLowerCase();

  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:5000/api/recipes");
        if (!res.ok) throw new Error("Failed to connect with backend");

        const data = await res.json();

        // Client-side filtering
        const filteredData = data.filter(
          (recipe) =>
            recipe.category &&
            recipe.category.trim().toLowerCase() === categorySlug.trim(),
        );

        setRecipes(filteredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [categorySlug]);

  const displayedRecipes = recipes.filter((recipe) =>
    recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Image Path Resolver
  const getImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&auto=format&fit=crop&q=80";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `http://localhost:5000${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  return (
   <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#09090b] text-gray-900 dark:text-gray-100 pb-16 transition-colors duration-300">
  <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
    
    {/* Search & Counter Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white capitalize font-Manrope">
          {categorySlug}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
          Found <span className="text-[#00A86B] font-bold">{displayedRecipes.length}</span> recipes in this category
        </p>
      </div>

      {/* Modern Glassmorphic Search Bar */}
      <div className="relative w-full md:w-80 group">
        <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#00A86B] transition-colors" />
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200/80 dark:border-zinc-800/80 text-gray-900 dark:text-white rounded-2xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B] focus:ring-4 focus:ring-[#00A86B]/10 transition-all shadow-xs placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>
    </div>

    {/* Content Section */}
    {loading ? (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-9 h-9 text-[#00A86B] animate-spin" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Loading recipes...
        </p>
      </div>
    ) : error ? (
      <div className="bg-red-50/80 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-2xl p-6 text-center border border-red-100 dark:border-red-900/40 max-w-md mx-auto my-12 backdrop-blur-md">
        <p className="text-sm font-semibold">Error: {error}</p>
      </div>
    ) : displayedRecipes.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedRecipes.map((recipe) => {
          const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

          return (
          <Link href={`/details/${recipe._id}`}>
            <div
              key={recipe._id}
              onClick={() => router.push(`/recipes/${recipe._id}`)}
              className="group bg-white dark:bg-zinc-900/90 rounded-[28px] overflow-hidden border border-gray-200/60 dark:border-zinc-800/80 shadow-xs hover:shadow-2xl hover:shadow-[#00A86B]/5 dark:hover:border-zinc-700/80 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative h-52 w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                <Image
                  src={getImageUrl(recipe.image)}
                  alt={recipe.title}
                  fill
                  unoptimized 
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Heart Button */}
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-500 transition-colors shadow-xs active:scale-90"
                >
                  <Heart className="w-4 h-4" />
                </button>

                {/* Time Badge */}
                {totalTime > 0 && (
                  <div className="absolute bottom-3 left-3 bg-black/60 dark:bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{totalTime} min</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-[#00A86B] dark:text-[#00c880] uppercase tracking-wider bg-[#00A86B]/10 dark:bg-[#00A86B]/20 px-2.5 py-1 rounded-full">
                    {recipe.category}
                  </span>
                  
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2.5 line-clamp-1 group-hover:text-[#00A86B] dark:group-hover:text-[#00c880] transition-colors">
                    {recipe.title}
                  </h3>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                {/* Card Footer Meta */}
                <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-gray-100 dark:border-zinc-800/80 text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <Users className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    <span>{recipe.servings || 1} Servings</span>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-[#00A86B] dark:text-[#00c880] group-hover:translate-x-0.5 transition-transform">
                    <span>View</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
          );
        })}
      </div>
    ) : (
      /* Empty State */
      <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-12 text-center border border-gray-200/80 dark:border-zinc-800/80 max-w-md mx-auto my-12 shadow-xs">
        <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800/80 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-gray-500">
          <Utensils className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          No recipes found
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
          No recipes found under "{categorySlug}".
        </p>
      </div>
    )}
  </main>
</div>
  );
}
