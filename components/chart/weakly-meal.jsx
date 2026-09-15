"use client";
import React, { useState, useEffect } from "react";

const WeeklyActivity = () => {
  const [activityData, setActivityData] = useState([]);

  // ৭ দিনের নাম ও তাদের সংক্ষেপ
  const daysOfWeek = [
    { fullName: "Monday", short: "M" },
    { fullName: "Tuesday", short: "T" },
    { fullName: "Wednesday", short: "W" },
    { fullName: "Thursday", short: "T" },
    { fullName: "Friday", short: "F" },
    { fullName: "Saturday", short: "S" },
    { fullName: "Sunday", short: "S" },
  ];

  useEffect(() => {
    // ১. আপনার সেভ করা weeklyMealPlans টি LocalStorage থেকে আনা
    const savedPlans = localStorage.getItem("weeklyMealPlans");
    
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans);

        // ২. আজকের দিন বের করা (Active Day হাইলাইট করার জন্য)
        const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

        // ৩. প্রতি দিনের মোট Meal সংখ্যা (বা Calories) হিসাব করা
        const formattedData = daysOfWeek.map(({ fullName, short }) => {
          const dayMeals = parsedPlans[fullName] || {};
          
          // ওই দিনে কয়টি active/valid meal আছে তা গণনা করা
          const totalMeals = Object.values(dayMeals).filter(
            (meal) => meal !== null && meal !== undefined && meal !== ""
          ).length;

          return {
            day: short,
            value: totalMeals, // এখানে কতগুলো মিল আছে সেই সংখ্যা আসবে
            active: fullName === todayName, // আজ শুক্রবার বা যে দিন হবে সেটা auto active হবে
          };
        });

        setActivityData(formattedData);
      } catch (error) {
        console.error("Error parsing weeklyMealPlans:", error);
      }
    }
  }, []);

  // Bar Height scaling-এর জন্য Maximum value বের করা
  const maxValue = Math.max(...activityData.map((d) => d.value), 1);

  return (
    <div className="md:col-span-7 lg:col-span-4 bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 rounded-[32px] p-6  shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Weekly Activity
          </h2>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            {activityData.reduce((acc, curr) => acc + curr.value, 0)} Meals Planned
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-6">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Breakfast
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Dinner
          </span>
        </div>
      </div>

      {/* Dynamic Graph */}
      <div className="h-28 w-full flex items-end justify-between gap-2 pt-2">
        {activityData.map((item, idx) => {
          // Dynamic Percentage Calculation
          const heightPercent = `${(item.value / maxValue) * 100}%`;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
            >
              <div
                className={`w-full rounded-xl transition-all duration-300 ${
                  item.active
                    ? "bg-gray-900 dark:bg-white"
                    : "bg-gray-100 dark:bg-gray-800 group-hover:bg-emerald-500/30"
                }`}
                style={{ height: item.value > 0 ? heightPercent : "6%" }} // 0 থাকলে ছোট একটা bar দেখাবে
                title={`${item.day}: ${item.value} Meals`}
              />
              <span className="text-[11px] font-semibold text-gray-400">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyActivity;