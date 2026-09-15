"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Clock,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heading } from "./shared/heading";

const CATEGORY_STYLES = {
  dinner: {
    bg: "bg-[#DCFCE7]/70",
    image:
      "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80",
    time: "25-45 min",
  },
  dessert: {
    bg: "dark:bg-[#FEE2E2]/70",
    image:
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    time: "15-30 min",
  },
  "main course": {
    bg: "dark:bg-[#FEF9C3]/70",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    time: "20-40 min",
  },
  appetizer: {
    bg: "dark:bg-[#FFEDD5]/70",
    image:
      "https://images.unsplash.com/photo-1541529086526-db283c563270?w=600&auto=format&fit=crop&q=80",
    time: "10-20 min",
  },
  breakfast: {
    bg: "dark:bg-[#E2E5FF]/70",
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&auto=format&fit=crop&q=80",
    time: "10-20 min",
  },
  lunch: {
    bg: "dark:bg-[#E0F2FE]/70",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
  },
};

const CategoriesPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes`);
        const data = await res.json();

        const uniqueCategories = [
          ...new Set(data.map((item) => item.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    }
    getCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    router.push(
      `/recipes/categories/${encodeURIComponent(categoryName.toLowerCase())}`,
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#111111]  pb-16 mt-14">
      {/* Header */}

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto   p-4">
        <Heading
          className="leading-tighter text-2xl text-gray-800 dark:text-white font-semibold font-comfortaa"
          label={"Pick    Category"}
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#00A86B] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {categories.map((catName) => {
              const key = catName.toLowerCase();
              const style = CATEGORY_STYLES[key] || {
                bg: "from-emerald-500/10 via-teal-500/5 to-transparent",
                image:
                  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&auto=format&fit=crop&q=80",
                time: "15-30 min",
              };

              return (
                <div
                  key={catName}
                  onClick={() => handleCategoryClick(catName)}
                  className="group relative h-80 w-full rounded-[32px] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-5 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#00A86B]/10 dark:hover:border-zinc-700 transition-all duration-500   cursor-pointer select-none"
                >
                  {/* Top Floating Badges */}
                  <div className="flex items-center justify-between z-20">
                    <div className="flex items-center gap-1.5 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xs border border-gray-100 dark:border-zinc-700/50">
                      <Clock className="w-3.5 h-3.5 text-[#00A86B] dark:text-[#00c880]" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {style.time}
                      </span>
                    </div>

                    
                  </div>

                  {/* Center Circular Floating Dish Image */}
                  <div className="relative my-auto flex justify-center items-center py-2 z-10">
                    {/* Subtle Glow Behind Image */}
                    <div className="absolute w-36 h-36 rounded-full bg-[#00A86B]/10 dark:bg-[#00A86B]/20 blur-xl group-hover:scale-125 transition-transform duration-500" />

                    <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-out">
                      <Image
                        src={style.image}
                        alt={catName}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Bottom Title & Action CTA */}
                  <div className="z-20 pt-2 flex items-end justify-between gap-2 border-t border-gray-100/80 dark:border-zinc-800/60">
                    <div>
                      
                      <h3 className="text-lg font-semibold font-montserrat text-gray-900 dark:text-white capitalize line-clamp-1 group-hover:text-[#00A86B] dark:group-hover:text-[#00c880] transition-colors">
                        {catName}
                      </h3>
                    </div>

                    <div className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 group-hover:bg-[#00A86B] group-hover:text-white dark:group-hover:bg-[#00A86B] flex items-center justify-center transition-all duration-300 shadow-xs">
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Background Gradient Accent */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/50 dark:to-zinc-800/20 pointer-events-none" />
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
export default CategoriesPage;
