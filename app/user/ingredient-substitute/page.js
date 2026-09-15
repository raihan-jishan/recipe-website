"use client";

import React, { useState } from "react";
import { Search, RefreshCw, ChefHat, Info, Globe } from "lucide-react";
import DashboardLayout from "@/layout/user";

const page = () => {
  const [lang, setLang] = useState("en"); // 'bn' অথবা 'en'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // বিকল্প উপাদানের ডেটাবেস
  const uiText = {
    en: {
      title: "Ingredient Substitutes 🔄",
      subtitle:
        "Missing an ingredient? Find quick, smart kitchen swaps for your recipes.",
      searchPlaceholder:
        "Search for an ingredient (e.g. Butter, Egg, Soy Sauce)...",
      dontHave: "If you don't have:",
      useInstead: "Use instead:",
      noResultsTitle: "No substitutes found",
      noResultsSub: "Try searching for another ingredient like Butter or Egg.",
      allCategory: "All",
    },
    bn: {
      title: "উপাদান বিকল্পসমূহ 🔄",
      subtitle:
        "কোনো উপাদান নেই? আপনার রেসিপির জন্য দ্রুত ও বুদ্ধিমান বিকল্প খুঁজুন।",
      searchPlaceholder: "উপাদান খুঁজুন (যেমন: মাখন, ডিম, সোয়া সস)...",
      dontHave: "যদি আপনার না থাকে:",
      useInstead: "বিকল্প হিসেবে ব্যবহার করুন:",
      noResultsTitle: "কোনো বিকল্প পাওয়া যায়নি",
      noResultsSub:
        "মাখন বা ডিমের মতো অন্য উপাদান লিখে অনুসন্ধান করার চেষ্টা করুন।",
      allCategory: "সবকটি",
    },
  };

  // দ্বৈত-ভাষার ডেটাবেস
  const substitutes = [
    {
      id: 1,
      ingredient: { en: "Butter (1 Cup)", bn: "মাখন / বাটার (১ কাপ)" },
      category: { en: "Baking & Dairy", bn: "বেকিং এবং ডেইরি" },
      substitutes: [
        {
          name: { en: "Applesauce", bn: "অ্যাপেলসস (আপেল পেস্ট)" },
          ratio: { en: "1 Cup", bn: "১ কাপ" },
          note: {
            en: "Best for moist baking (cakes, muffins)",
            bn: "কেক বা মাফিন নরম রাখার জন্য সেরা",
          },
        },
        {
          name: { en: "Coconut Oil", bn: "নারকেল তেল" },
          ratio: { en: "1 Cup", bn: "১ কাপ" },
          note: {
            en: "1:1 ratio, adds slight coconut aroma",
            bn: "সমপরিমাণ ব্যবহার করুন, হালকা সুবাস দেবে",
          },
        },
      ],
    },
    {
      id: 2,
      ingredient: { en: "Buttermilk (1 Cup)", bn: "বাটারমিল্ক (১ কাপ)" },
      category: { en: "Baking & Dairy", bn: "বেকিং এবং ডেইরি" },
      substitutes: [
        {
          name: { en: "Milk + Lemon Juice", bn: "দুধ + লেবুর রস" },
          ratio: {
            en: "1 Cup Milk + 1 tbsp Lemon Juice",
            bn: "১ কাপ দুধ + ১ টেবিল চামচ লেবুর রস",
          },
          note: {
            en: "Let sit for 5 mins before using",
            bn: "মিশিয়ে ৫ মিনিট রেখে ব্যবহার করুন",
          },
        },
      ],
    },
    {
      id: 3,
      ingredient: { en: "Egg (1 Large Egg)", bn: "ডিম (১টি বড় ডিম)" },
      category: { en: "Baking & Dairy", bn: "বেকিং এবং ডেইরি" },
      substitutes: [
        {
          name: { en: "Mashed Banana", bn: "পাকা কলা পেস্ট" },
          ratio: { en: "1/2 Medium Banana", bn: "১/২টি মাঝারি কলা" },
          note: {
            en: "Best for sweet baked goods",
            bn: "মিষ্টিজাতীয় বেকিংয়ের জন্য সেরা",
          },
        },
      ],
    },
  ];

  

  // ফিল্টারিং লজিক
  const filteredSubstitutes = substitutes.filter((item) => {
    const ingName = item.ingredient[lang].toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      ingName.includes(query) ||
      item.substitutes.some((s) => s.name[lang].toLowerCase().includes(query));
    const matchesCategory =
      selectedCategory === "All" || item.category.en === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="w-full max-w-5xl mx-auto transition-colors duration-300 p-5">
        {/* 1. Header Section & Language Switcher Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-comfortaa text-gray-900 dark:text-white">
              {uiText[lang].title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {uiText[lang].subtitle}
            </p>
          </div>

          {/* Dual Language Switcher Button */}
          <button
            onClick={() => setLang(lang === "bn" ? "en" : "bn")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-xs text-xs font-bold cursor-pointer"
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            <span>{lang === "bn" ? "English" : "বাংলা"}</span>
          </button>
        </div>

        {/* 2. Search Bar */}
        <div className="bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 rounded-[28px] p-4 mb-8 shadow-xs">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={uiText[lang].searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all"
            />
          </div>
        </div>

        {/* 3. Dynamic Substitutes List */}
        {filteredSubstitutes.length === 0 ? (
          <div className="bg-white dark:bg-[#18181b] rounded-[32px] p-12 text-center border border-gray-200/80 dark:border-gray-800/80">
            <ChefHat className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {uiText[lang].noResultsTitle}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {uiText[lang].noResultsSub}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSubstitutes.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 rounded-[32px] p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Category Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                      {item.category[lang]}
                    </span>
                  </div>

                  {/* Ingredient Title */}
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white mb-4 font-comfortaa">
                    <span className="text-gray-400 block text-xs font-normal mb-0.5">
                      {uiText[lang].dontHave}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {item.ingredient[lang]}
                    </span>
                  </h3>

                  {/* Substitute Items */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-gray-400 block">
                      {uiText[lang].useInstead}
                    </span>

                    {item.substitutes.map((sub, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60 rounded-[20px] p-3.5 flex items-start gap-3"
                      >
                        <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                          <RefreshCw className="w-3.5 h-3.5" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                              {sub.name[lang]}
                            </h4>
                            <span className="text-[11px] font-extrabold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-600 shrink-0">
                              {sub.ratio[lang]}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                            <Info className="w-3 h-3 text-gray-400 shrink-0" />
                            <span>{sub.note[lang]}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default page; 