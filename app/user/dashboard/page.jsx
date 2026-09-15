"use client";

import React, { useEffect, useState } from "react";

import {
  Utensils,
  Bell, 
  Coffee,
  Soup,
  Pizza,
  Cookie,
  Sandwich,
} from "lucide-react";
import UserDashLayout from "@/layout/user";
import ChangeTheme from "@/components/ui/changeTheme";  
import DynamicCookList from "@/components/cookList";
import MealPrepgoal from "@/components/mealPrepgoal";
import OverallActivity from "@/components/chart/overall-activity";
import WeeklyActivity from "@/components/chart/weakly-meal";
import MonthlyGoal from "@/components/chart/monthly-chart";
const page = () => {
  const [mealPlans, setMealPlans] = useState({});
  const [completedCount, setCompletedCount] = useState(0);
  const [recipesCookedCount, setRecipesCookedCount] = useState("0");

  const renderMealIcon = (iconType) => {
    const className = "w-6 h-6 text-emerald-500";
    switch (iconType) {
      case "coffee":
        return <Coffee className={className} size={30} />;
      case "sandwich":
        return <Sandwich className={className} size={30} />;
      case "pizza":
        return <Pizza className={className} size={30} />;
      case "soup":
        return <Soup className={className} size={30} />;
      case "cookie":
        return <Cookie className={className} size={30} />;
      default:
        return <Utensils className={className} size={30} />;
    }
  };

  useEffect(() => {
    const completedList = JSON.parse(localStorage.getItem("completedRecipes"));
    const cookedCount = Number(localStorage.getItem("recipesCookedCount") || 0);

    setCompletedCount(completedList.length);
    setRecipesCookedCount(cookedCount);
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("weeklyMealPlans");
    if (savedData) {
      try {
        setMealPlans(JSON.parse(savedData));
      } catch (error) {
        console.error("Error loading meal plans", error);
      }
    }
  }, []);
  


  return( 
      <UserDashLayout>
        <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#0f0f12] text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:p-8 font-sans transition-colors duration-300  ">
          {/* 1. Header Area */}
          <div className="flex   max-lg:flex-col-reverse  sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 ">
            <div className="max-lg:mt-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-comfortaa">
                Hi, Rohan👋
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Welcome back to your culinary workspace.
              </p>
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="relative p-2.5 rounded-2xl bg-white dark:bg-gray-800/20 border border-gray-200/80 dark:border-gray-700/60 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-xs cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00A86B]" />
              </button>
              <ChangeTheme />
            </div>
          </div>

          {/* 2. Top Stats & Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            <OverallActivity
              completedCount={completedCount}
              recipesCookedCount={recipesCookedCount}
            />
            <WeeklyActivity />
            <MonthlyGoal />
          </div>

          {/* 3. Middle Section: Tasks / Meal Prep Plan & Saved Recipes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            <MealPrepgoal
              mealPlans={mealPlans}
              renderMealIcon={renderMealIcon}
            />
            <DynamicCookList />
          </div>
        </div>
      </UserDashLayout>
    
  )
};
export default page;
