"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";  
import {
  Drumstick,
  Egg,
  Vegan,
  Flame,
  Apple,
  Sparkles,
  Soup,
  Search,
  Cookie,
  Plus,
  Loader2,
} from "lucide-react"; 

export default function CookByIngredients() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([
    "Egg",
    "Potato",
  ]);
  const [loading, setLoading] = useState(false); 
  const [isFormOpen, setIsFormOpen] = useState(false);
    
  const addIngredient = (ingredient) => {
    const trimmed = ingredient.trim();
    if (
      trimmed &&
      !selectedIngredients.some(
        (item) => item.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setSelectedIngredients([...selectedIngredients, trimmed]);
      setQuery("");
    }
  };

  const removeIngredient = (ingredientToRemove) => {
    setSelectedIngredients(
      selectedIngredients.filter((item) => item !== ingredientToRemove)
    );
  };

  // 🚀 অন্য পেজে Navigate করার হ্যান্ডলার
  const handleFindRecipes = () => {
    if (selectedIngredients.length === 0) return;

    setLoading(true);
    
    // সিলেক্ট করা উপাদানগুলোকে URL-এর Query Parameter এ রূপান্তর করা (e.g., ?ingredients=Egg,Potato)
    const queryString = encodeURIComponent(selectedIngredients.join(","));
    
    // নতুন পেজে রিডাইরেক্ট করা
    router.push(`/recipes?ingredients=${queryString}`);
  };

  return (
    <div className="min-h-screen bg-amber-100/95 text-slate-800 dark:text-slate-100 pb-20 selection:bg-amber-400 selection:text-slate-900 transition-colors duration-300">
      <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Banner Card */}
        <div className="relative overflow-hidden bg-[#FEF6C3] dark:border-slate-800 rounded-4xl p-6 sm:p-8 shadow-xl shadow-amber-900/5 transition-all">
          {/* Card Decorative Chef / Food graphic element */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-6 w-28 h-28 sm:w-44 sm:h-44 pointer-events-none opacity-90 z-0">
            <div className="w-full h-full relative flex items-center justify-center">
              <Image
                src={"/cook-by-ingredient.svg"}
                width={500}
                height={500}
                alt="svg was not found!"
                className="object-contain"
              />
            </div>
          </div>

          {/* Main Banner Content */}
          <div className="relative z-10 max-w-xs sm:max-w-md">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight font-comfortaa">
              Start Cooking
            </h2>
            <p className="mt-2 text-slate-700 text-sm font-montserrat font-medium leading-relaxed">
              To personalise your menu, we still need information about
              ingredients you have.
            </p>

            {/* Toggle Button */}
            {!isFormOpen && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="mt-6 px-5 p-4 rounded-full bg-black hover:opacity-80 cursor-pointer active:scale-95 text-white font-medium text-lg transition-all shadow-amber-500/20 flex items-center gap-2 font-montserrat"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Fill to Cook</span>
              </button>
            )}
          </div>

          {/* Form Expansion */}
          {isFormOpen && (
            <div className="relative z-20 mt-6 pt-6 border-amber-300/60 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider font-Manrope text-slate-700">
                  Add Your Ingredients
                </span>
              </div>

              {/* Form Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (query.trim()) {
                    addIngredient(query);
                  }
                }}
                className="relative flex items-center gap-2"
              >
                <div className="relative flex-1 hover:scale-[0.99] transition-all">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type an ingredient (e.g., Chicken, Egg, Potato)..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-full border text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all text-sm shadow-sm"
                  />
                </div>
              </form>

              {/* Quick Suggestions */}
              <div className="mt-6 pt-3 border-t border-amber-300/40">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-2.5">
                  Quick Suggestions
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Chicken", icon: Drumstick },
                    { name: "Egg", icon: Egg },
                    { name: "Potato", icon: Vegan },
                    { name: "Onion", icon: Flame },
                    { name: "Tomato", icon: Apple },
                    { name: "Garlic", icon: Sparkles },
                    { name: "Rice", icon: Soup },
                  ].map(({ name, icon: Icon }) => {
                    const isSelected = selectedIngredients.some(
                      (i) => i.toLowerCase() === name.toLowerCase()
                    );
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            removeIngredient(name);
                          } else {
                            addIngredient(name);
                          }
                        }}
                        className={`group px-3.5 p-3 rounded-sm text-xs font-semibold border transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 ${
                          isSelected ? "text-gray-800 bg-amber-200/80" : "text-black"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                            isSelected ? "text-black" : ""
                          }`}
                        />
                        <span>{name}</span>
                        {!isSelected && (
                          <Plus className="w-3 h-3 ml-0.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Find Button (Navigate Page) */}
              <button
                type="button"
                onClick={handleFindRecipes}
                disabled={selectedIngredients.length === 0 || loading}
                className="mt-5 w-full p-5 rounded-2xl bg-black hover:opacity-90 disabled:opacity-40 text-white font-extrabold text-[1.1rem] font-montserrat transition-all flex items-center justify-center gap-2 cursor-pointer"
              > 
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Cookie className="w-6 h-6" />
                )}
                <span>{loading ? "Redirecting..." : "Find Recipes"}</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}