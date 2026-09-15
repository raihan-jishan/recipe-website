import { ChevronRight } from "lucide-react"; 
import React from "react";
import Link from "next/link";  
import {   Clock, Flame, Utensils } from "lucide-react";  

const MealPrepgoal = ({ 
  mealPlans = {}, 
  renderMealIcon = (iconType, type) => null 
}) => {
  return (
    <div className="lg:col-span-5 bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 rounded-[32px] p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-extrabold font-comfortaa text-gray-900 dark:text-white">
              Meal Prep Goals 🥗
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Your saved recipes from Weekly Planner
            </p>
          </div>
          <Link
            href="/meal-planner"
            className="flex items-center gap-1 text-xs font-bold text-emerald-500 hover:text-emerald-600 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Plans List Container */}
        <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1 scrollbar-hide">
          {Object.keys(mealPlans).length > 0 ? (
            Object.entries(mealPlans).map(([day, meals]) => {
              const activeMeals = Object.entries(meals || {}).filter(
                ([_, meal]) => meal !== null && meal !== undefined,
              );

              if (activeMeals.length === 0) return null;

              return (
                <div
                  key={day}
                  className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-200/5 border border-gray-100 dark:border-gray-800/80"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-gray-400 font-montserrat tracking-wide uppercase">
                      {day}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {activeMeals.length}{" "}
                      {activeMeals.length > 1 ? "Meals" : "Meal"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeMeals.map(([type, meal]) => (
                      <div
                        key={type}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-[#18181b]/5 border border-gray-200/60 dark:border-0 shadow-2xs hover:border-emerald-500/30 transition-all"
                      >
                        <div className="p-2 rounded-lg shrink-0 text-emerald-500">
                          {renderMealIcon(meal?.iconType, type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                            {meal?.title || "Untitled Meal"}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3 text-emerald-500" />
                              {meal?.time || "15 min"}
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Flame className="w-3 h-3 text-amber-500" />
                              {meal?.cals || "300 kcal"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-2">
              <Utensils className="w-6 h-6 text-gray-300 dark:text-gray-600" />
              <p className="text-xs text-gray-400 font-medium">
                No meal plans added yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPrepgoal;
