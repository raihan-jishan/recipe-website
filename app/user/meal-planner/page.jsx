"use client";

import { useState, useEffect } from "react";
import {
  Flame,
  Utensils,
  Sparkles,
  Clock,
  Trash2,
  Plus,
  X,
  Coffee,
  Soup,
  Pizza,
  Cookie,
  Sandwich,
} from "lucide-react";
import DashboardLayout from "@/layout/user";

export default function MealPlannerPage() {
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [allMealPlans, setAllMealPlans] = useState({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    time: "",
    cals: "",
    iconType: "utensils",
  });

  const days = [
    { short: "Mon", date: "12" },
    { short: "Tue", date: "13" },
    { short: "Wed", date: "14" },
    { short: "Thu", date: "15" },
    { short: "Fri", date: "16" },
    { short: "Sat", date: "17" },
    { short: "Sun", date: "18" },
  ];

  const defaultMeals = {
    Breakfast: null,
    Lunch: null,
    Dinner: null,
    Snack: null,
  };

  // Helper function to render icon based on type or meal
  const renderMealIcon = (iconType, mealType) => {
    const className = "w-7 h-7";
    switch (iconType) {
      case "coffee":
        return <Coffee className={className} />;
      case "sandwich":
        return <Sandwich className={className} />;
      case "pizza":
        return <Pizza className={className} />;
      case "soup":
        return <Soup className={className} />;
      case "cookie":
        return <Cookie className={className} />;
      default:
        if (mealType === "Breakfast") return <Coffee className={className} />;
        if (mealType === "Lunch") return <Sandwich className={className} />;
        if (mealType === "Dinner") return <Soup className={className} />;
        if (mealType === "Snack") return <Cookie className={className} />;
        return <Utensils className={className} />;
    }
  };

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem("weeklyMealPlans");
    if (savedData) {
      try {
        setAllMealPlans(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse meal plans", e);
      }
    } else {
      // Default Demo Data
      const initialData = {
        Mon: {
          Breakfast: {
            title: "Avocado & Egg Toast",
            time: "10 min",
            cals: "350 kcal",
            iconType: "sandwich",
          },
          Lunch: {
            title: "Grilled Chicken & Quinoa Salad",
            time: "25 min",
            cals: "520 kcal",
            iconType: "utensils",
          },
          Dinner: {
            title: "Garlic Butter Baked Salmon",
            time: "30 min",
            cals: "610 kcal",
            iconType: "soup",
          },
          Snack: null,
        },
      };
      setAllMealPlans(initialData);
      localStorage.setItem("weeklyMealPlans", JSON.stringify(initialData));
    }
  }, []);

  const currentDayMeals = {
    ...defaultMeals,
    ...(allMealPlans[selectedDay] || {}),
  };

  const saveToLocalStorage = (updatedPlans) => {
    setAllMealPlans(updatedPlans);
    localStorage.setItem("weeklyMealPlans", JSON.stringify(updatedPlans));
  };

  const handleDeleteMeal = (mealType) => {
    const updatedDay = { ...currentDayMeals, [mealType]: null };
    const updatedPlans = { ...allMealPlans, [selectedDay]: updatedDay };
    saveToLocalStorage(updatedPlans);
  };

  const handleOpenAddModal = (mealType) => {
    setActiveMealType(mealType);
    setFormData({
      title: "",
      time: "15 min",
      cals: "300 kcal",
      iconType:
        mealType === "Breakfast"
          ? "coffee"
          : mealType === "Snack"
          ? "cookie"
          : "utensils",
    });
    setIsModalOpen(true);
  };

  const handleAddMealSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    const newMeal = {
      title: formData.title,
      time: formData.time || "15 min",
      cals: formData.cals.includes("kcal")
        ? formData.cals
        : `${formData.cals || 300} kcal`,
      iconType: formData.iconType || "utensils",
    };

    const updatedDay = { ...currentDayMeals, [activeMealType]: newMeal };
    const updatedPlans = { ...allMealPlans, [selectedDay]: updatedDay };

    saveToLocalStorage(updatedPlans);
    setIsModalOpen(false);
  };

  const plannedMealsList = Object.values(currentDayMeals).filter(Boolean);
  const plannedCount = plannedMealsList.length;

  const totalCalories = plannedMealsList.reduce((acc, meal) => {
    const calsNum = parseInt(meal.cals, 10) || 0;
    return acc + calsNum;
  }, 0);

  return (
    <DashboardLayout>
      <div className="w-full transition-colors duration-300 p-6 max-lg:p-0 max-lg:mt-3">
        {/* 1. Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight  font-Manrope text-gray-900 dark:text-gray-200">
              Weekly Meal Planner  
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-lg:max-w-[17rem]">
              Organize your daily meals, track calories, and streamline grocery
              shopping.
            </p>
          </div>
        </div>

        {/* 2. Days Strip Selector */}
        <div className="bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 rounded-sm p-3 mb-8 shadow-xs flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
          {days.map((item) => {
            const isActive = selectedDay === item.short;
            return (
              <button
                key={item.short}
                onClick={() => setSelectedDay(item.short)}
                className={`flex-1 min-w-[64px] py-3 rounded-sm flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  isActive
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md scale-105 font-bold"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                <span className="text-xs">{item.short}</span>
                <span className="text-base font-bold font-Manrope">{item.date}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Daily Nutrition Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 rounded-[24px] p-4 flex items-center gap-4 shadow-xs">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium">
                Total Calories
              </span>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                {totalCalories.toLocaleString()} / 2,000 kcal
              </h4>
            </div>
          </div>

          <div className="bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 rounded-[24px] p-4 flex items-center gap-4 shadow-xs">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium">
                Meals Planned
              </span>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                {plannedCount} of 4 Meals
              </h4>
            </div>
          </div>

          <div className="bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 rounded-[24px] p-4 flex items-center gap-4 shadow-xs">
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-500">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium">
                Macros Balance
              </span>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                40% P / 35% C / 25% F
              </h4>
            </div>
          </div>
        </div>

        {/* 4. Meal Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(currentDayMeals).map(([mealType, meal]) => (
            <div
              key={mealType}
              className="bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 rounded-[32px] p-5 shadow-xs flex flex-col justify-between min-h-[160px]"
            >
              {/* Meal Slot Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {mealType}
                </span>
                {meal && (
                  <button
                    onClick={() => handleDeleteMeal(mealType)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                    title="Remove Meal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Meal Details or Empty State */}
              {meal ? (
                <div className="flex items-center gap-4">
                  {/* Image er poriborte Icon Box */}
                  <div className="w-16 h-16 rounded-[20px] bg-emerald-500/10 text-[#00A86B] flex items-center justify-center shrink-0">
                    {renderMealIcon(meal.iconType, mealType)}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-1 font-comfortaa">
                      {meal.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        {meal.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        {meal.cals}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Slot View */
                <button
                  onClick={() => handleOpenAddModal(mealType)}
                  className="w-full py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[24px] flex flex-col items-center justify-center gap-2 hover:border-emerald-500/50 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 transition-all group cursor-pointer"
                >
                  <div className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:scale-110 transition-transform">
                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    Add {mealType} Recipe
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Modal: Add Recipe Form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-[28px] p-6 w-full max-w-md shadow-2xl relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Add {activeMealType} for {selectedDay}
              </h3>

              <form onSubmit={handleAddMealSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Recipe Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pasta Carbonara"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Time (e.g. 20 min)
                    </label>
                    <input
                      type="text"
                      placeholder="20 min"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Calories (kcal)
                    </label>
                    <input
                      type="text"
                      placeholder="450"
                      value={formData.cals}
                      onChange={(e) =>
                        setFormData({ ...formData, cals: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Select Icon
                  </label>
                  <select
                    value={formData.iconType}
                    onChange={(e) =>
                      setFormData({ ...formData, iconType: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                  >
                    <option value="utensils">Utensils 🍴</option>
                    <option value="coffee">Coffee ☕</option>
                    <option value="sandwich">Sandwich 🥪</option>
                    <option value="soup">Soup / Bowl 🍲</option>
                    <option value="pizza">Pizza 🍕</option>
                    <option value="cookie">Cookie / Snack 🍪</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00A86B] hover:bg-[#00915c] text-white font-bold rounded-xl text-sm transition-colors mt-2 cursor-pointer"
                >
                  Save Recipe
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}