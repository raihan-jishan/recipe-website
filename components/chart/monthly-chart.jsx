import React, { useState, useEffect } from "react";
import { Flame, Download } from "lucide-react";

const MonthlyGoal = ({ targetGoal = 50 }) => {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    // 1. LocalStorage থেকে weeklyMealPlans ডাটা রিড করা
    const savedPlans = localStorage.getItem("weeklyMealPlans");

    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans);
        let totalCount = 0;

        // সমস্ত দিনের সেভ করা মিলগুলোর মোট সংখ্যা বের করা
        Object.values(parsedPlans).forEach((dayMeals) => {
          if (dayMeals && typeof dayMeals === "object") {
            const validMeals = Object.values(dayMeals).filter(
              (meal) => meal !== null && meal !== undefined && meal !== ""
            );
            totalCount += validMeals.length;
          }
        });

        setCurrentProgress(totalCount);
      } catch (error) {
        console.error("Error reading monthly goal data:", error);
      }
    }
  }, []);

  // 2. Percentage Calculation (সর্বোচ্চ ১০০% সীমাবদ্ধ না রেখে আসল মান বের করা)
  const percentage = Math.round((currentProgress / targetGoal) * 100);

  // SVG Ring calculation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Visual progress এর জন্য সর্বোচ্চ 100% ক্যাপ করে রাখা (যাতে ring overlapping না হয়)
  const cappedPercentage = Math.min(percentage, 100);
  const strokeDashoffset = circumference - (cappedPercentage / 100) * circumference;

  // 3. Report Download Handler
  const handleDownloadReport = () => {
    const reportData = `Monthly Meal Prep Report\nGoal: ${targetGoal} Meals\nCompleted: ${currentProgress} Meals\nProgress: ${percentage}%`;
    const blob = new Blob([reportData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Monthly_Meal_Report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="md:col-span-12 lg:col-span-4 bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 rounded-[32px] p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Monthly Goal
          </h2>
          <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          {currentProgress} of {targetGoal} meals completed
        </p>
      </div>

      {/* Dynamic SVG Circular Ring Progress */}
      <div className="flex items-center justify-center my-2">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-gray-100 dark:text-gray-800 stroke-current"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Active Progress Ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-emerald-500 stroke-current transition-all duration-1000 ease-out"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {percentage}%
            </span>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              Done
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={handleDownloadReport}
          className="w-full py-3.5 rounded-2xl text-white  dark:bg-emerald-500  bg-black  hover:opacity-90 text-xs font-bold   dark:text-black transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 font-Manrope"
        >
          <Download className="w-3.5 h-3.5" /> Download Report
        </button>
      </div>
    </div>
  );
};

export default MonthlyGoal;