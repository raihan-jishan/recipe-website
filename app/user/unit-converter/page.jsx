"use client";

import React, { useState } from "react";
import {
  ArrowRightLeft,
  Scale,
  Thermometer,
  Sparkles,
  Copy,
  Check,
  ChefHat,
  Info,
} from "lucide-react";
import DashboardLayout from "@/layout/user";

export default function page() {
  const [activeTab, setActiveTab] = useState("volume");
  const [inputValue, setInputValue] = useState(1);
  const [fromUnit, setFromUnit] = useState("cup");
  const [toUnit, setToUnit] = useState("ml");
  const [copied, setCopied] = useState(false);

  // ইউনিট কনভার্সন রেট
  const conversionRates = {
    volume: {
      cup: 240, // 1 cup = 240 ml
      tbsp: 15, // 1 tbsp = 15 ml
      tsp: 5, // 1 tsp = 5 ml
      ml: 1,
      l: 1000,
      fl_oz: 29.57,
    },
    weight: {
      g: 1,
      kg: 1000,
      oz: 28.35,
      lb: 453.59,
    },
  };

  const calculateResult = () => {
    if (!inputValue || isNaN(inputValue)) return 0;
    const val = parseFloat(inputValue);

    if (activeTab === "temp") {
      if (fromUnit === "C" && toUnit === "F") return (val * 9) / 5 + 32;
      if (fromUnit === "F" && toUnit === "C") return ((val - 32) * 5) / 9;
      return val;
    }

    const rates = conversionRates[activeTab];
    if (!rates || !rates[fromUnit] || !rates[toUnit]) return 0;

    const baseValue = val * rates[fromUnit];
    return baseValue / rates[toUnit];
  };

  const result = calculateResult();

  // ইউনিট সোয়াপ করা
  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${result.toFixed(2)} ${toUnit}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-4xl mx-auto transition-colors duration-300 p-5">
        {/* 1. Header Section */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-comfortaa text-gray-900 dark:text-white">
            Kitchen Unit Converter ⚖️
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Quickly convert recipe measurements, weights, and temperatures.
          </p>
        </div>

        {/* 2. Category Selector Tabs */}
        <div className="bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 rounded-[28px] p-2 mb-8 shadow-xs flex items-center justify-between gap-2">
          {[
            { id: "volume", label: "Volume / Liquid", icon: Scale },
            { id: "weight", label: "Weight / Mass", icon: ChefHat },
            { id: "temp", label: "Temperature", icon: Thermometer },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "volume") {
                    setFromUnit("cup");
                    setToUnit("ml");
                  } else if (tab.id === "weight") {
                    setFromUnit("g");
                    setToUnit("oz");
                  } else {
                    setFromUnit("C");
                    setToUnit("F");
                  }
                }}
                className={`flex-1 py-3 px-3 rounded-[20px] flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer font-montserrat ${
                  isActive
                    ? "bg-gray-900 text-white dark:bg-emerald-300/80 dark:text-gray-900 shadow-md scale-[1.02]"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Converter Card Grid */}
        <div className="dark:bg-transparent border border-gray-200/60 dark:border-gray-800/20 rounded-[24px] p-5 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* FROM Input Box */}
            <div className="md:col-span-5 bg-gray-50 dark:bg-gray-800/2 border border-gray-200/60 dark:border-gray-700/5 rounded-[24px] p-5">
              <span className="text-xs font-montserrat font-semibold text-gray-400 mb-4 ">
                From Amount
              </span>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full text-3xl font-comfortaa font-medium bg-transparent text-gray-900 dark:text-white focus:outline-none mb-3 mt-3"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-[#18181b]/5 text-xs text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 font-montserrat font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
              >
                {activeTab === "volume" && (
                  <>
                    <option
                      value="cup"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Cup (US)
                    </option>
                    <option
                      value="tbsp"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Tablespoon (tbsp)
                    </option>
                    <option
                      value="tsp"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Teaspoon (tsp)
                    </option>
                    <option
                      value="ml"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Milliliter (ml)
                    </option>
                    <option
                      value="l"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Liter (L)
                    </option>
                    <option
                      value="fl_oz"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Fluid Ounce (fl oz)
                    </option>
                  </>
                )}
                {activeTab === "weight" && (
                  <>
                    <option value="g">Gram (g)</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="oz">Ounce (oz)</option>
                    <option value="lb">Pound (lb)</option>
                  </>
                )}
                {activeTab === "temp" && (
                  <>
                    <option value="C">Celsius (°C)</option>
                    <option value="F">Fahrenheit (°F)</option>
                  </>
                )}
              </select>
            </div>

            {/* SWAP Button */}
            <div className="md:col-span-2 flex justify-center">
              <button
                onClick={handleSwap}
                className="p-4 rounded-full bg-gray-900 text-white dark:bg-emerald-50 dark:text-gray-900 hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <ArrowRightLeft className="w-5 h-5 rotate-90 md:rotate-0" />
              </button>
            </div>

            {/* TO Result Box */}
            <div className="md:col-span-5 bg-gray-50 dark:bg-transparent border border-gray-200/60 dark:border-gray-800/20 rounded-[24px] p-5 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-montserrat font-medium text-gray-400">
                  Converted Result
                </span>
                <button
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="text-3xl   text-emerald-600 dark:text-emerald-400 truncate mb-3 font-comfortaa font-medium mt-3">
                {result % 1 === 0 ? result : result.toFixed(2)}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-[#18181b]/5 text-xs text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 font-montserrat font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
              >
                {activeTab === "volume" && (
                  <>
                    <option
                      value="ml"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Milliliter (ml)
                    </option>
                    <option
                      value="cup"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Cup (US)
                    </option>
                    <option
                      value="tbsp"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Tablespoon (tbsp)
                    </option>
                    <option
                      value="tsp"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Teaspoon (tsp)
                    </option>
                    <option
                      value="l"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Liter (L)
                    </option>
                    <option
                      value="fl_oz"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Fluid Ounce (fl oz)
                    </option>
                  </>
                )}
                {activeTab === "weight" && (
                  <>
                    <option
                      value="oz"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Ounce (oz)
                    </option>
                    <option
                      value="g"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Gram (g)
                    </option>
                    <option
                      value="kg"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Kilogram (kg)
                    </option>
                    <option
                      value="lb"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Pound (lb)
                    </option>
                  </>
                )}
                {activeTab === "temp" && (
                  <>
                    <option
                      value="F"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Fahrenheit (°F)
                    </option>
                    <option
                      value="C"
                      className="bg-white dark:bg-[#18181b]/95 text-gray-800 dark:text-gray-200"
                    >
                      Celsius (°C)
                    </option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* 4. Quick Cheat Sheet Cards */}
        <div className="mt-8">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-400" /> Quick Kitchen Equivalents
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#18181b]/1 border border-gray-200/80 dark:border-gray-800/80 rounded-[20px] p-4 text-center">
              <span className="text-xs text-gray-400 block mb-1">1 Cup</span>
              <span className="text-sm font-extrabold text-gray-900 dark:text-white font-Manrope">
                16 Tbsp / 240 ml
              </span>
            </div>
            <div className="bg-white dark:bg-[#18181b]/1 border border-gray-200/80 dark:border-gray-800/80 rounded-[20px] p-4 text-center">
              <span className="text-xs text-gray-400 block mb-1">
                1 Tablespoon
              </span>
              <span className="text-sm font-extrabold text-gray-900 dark:text-white font-Manrope">
                3 Teaspoons / 15 ml
              </span>
            </div>
            <div className="bg-white dark:bg-[#18181b]/1 border border-gray-200/80 dark:border-gray-800/80 rounded-[20px] p-4 text-center">
              <span className="text-xs text-gray-400 block mb-1">
                1 Ounce (oz)
              </span>
              <span className="text-sm font-extrabold text-gray-900 dark:text-white font-Manrope">
                28.35 Grams
              </span>
            </div>
            <div className="bg-white dark:bg-[#18181b]/1 border border-gray-200/80 dark:border-gray-800/80 rounded-[20px] p-4 text-center">
              <span className="text-xs text-gray-400 block mb-1">
                350°F Oven
              </span>
              <span className="text-sm font-extrabold text-gray-900 dark:text-white font-Manrope">
                175° Celsius
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
