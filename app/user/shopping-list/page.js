"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Apple,
  Beef,
  Milk,
  Package,
  Sparkles,
  Share2,
  Printer,
} from "lucide-react";
import DashboardLayout from "@/layout/user";
const page = () => {
  const [newItem, setNewItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Produce");

  // শপিং লিস্ট ডেটা
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Fresh Organic Avocado",
      category: "Produce",
      completed: false,
      quantity: "3 pcs",
    },
    {
      id: 2,
      name: "Whole Milk 1L",
      category: "Dairy",
      completed: true,
      quantity: "2 boxes",
    },
    {
      id: 3,
      name: "Boneless Chicken Breast",
      category: "Meat & Seafood",
      completed: false,
      quantity: "1 kg",
    },
    {
      id: 4,
      name: "Extra Virgin Olive Oil",
      category: "Pantry",
      completed: false,
      quantity: "1 bottle",
    },
    {
      id: 5,
      name: "Fresh Garlic & Ginger",
      category: "Produce",
      completed: true,
      quantity: "200g",
    },
  ]);

  // আইটেম চেক/আনচেক টগল
  const toggleItem = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  // নতুন আইটেম যোগ
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const item = {
      id: Date.now(),
      name: newItem,
      category: selectedCategory,
      completed: false,
      quantity: "1 unit",
    };

    setItems([item, ...items]);
    setNewItem("");
  };

  // সিঙ্গেল আইটেম ডিলিট
  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // সব সম্পন্ন আইটেম ক্লিয়ার
  const clearCompleted = () => {
    setItems(items.filter((item) => !item.completed));
  };

  const completedCount = items.filter((i) => i.completed).length;

  return (
   <DashboardLayout>
     <div className="w-full transition-colors duration-300 p-5 max-lg:p-3">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 max-lg:mt-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-comfortaa text-gray-900 dark:text-white">
            Shopping List  
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Auto-generated from your planned recipes and daily groceries.
          </p>
        </div>

        
      </div>

      {/* 2. Add New Item Input Bar */}
      <div className="bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 rounded-[28px] p-3 mb-8 shadow-xs">
        <form
          onSubmit={handleAddItem}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <input
            type="text"
            placeholder="Add new ingredient or grocery item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="w-full flex-1 px-4 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800/2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none   dark:focus:ring-white transition-all"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800/5 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
            >
              <option value="Produce" className="bg-white dark:bg-gray-900">Produce</option>
              <option value="Dairy" className="bg-white dark:bg-gray-900">Dairy</option>
              <option value="Meat & Seafood" className="bg-white dark:bg-gray-900">Meat & Seafood</option>
              <option value="Pantry" className="bg-white dark:bg-gray-900">Pantry</option>
            </select>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs hover:opacity-90 transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Progress Overview Card */}
      <div className="bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 rounded-[32px] p-6 mb-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Progress: {completedCount} of {items.length} Items Bought
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {items.length - completedCount} items remaining on your list
            </p>
          </div>
        </div>

        {completedCount > 0 && (
          <button
            onClick={clearCompleted}
            className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            Clear Completed
          </button>
        )}
      </div>

      {/* 4. Grocery Items List */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="bg-white dark:bg-[#18181b]/5 rounded-[32px] p-12 text-center border border-gray-200/80 dark:border-gray-800/80">
            <ShoppingCart className="w-12 h-12 mx-auto text-gray-500 mb-3" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white font-Manrope">
              Your shopping list is empty
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Add ingredients manually or generate them directly from your Meal
              Planner.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`bg-white dark:bg-[#18181b]/80 border rounded-[24px] p-4 flex items-center justify-between gap-4 transition-all cursor-pointer ${
                item.completed
                  ? "border-gray-100 dark:border-gray-800/40 opacity-60"
                  : "border-gray-200/80 dark:border-gray-800/80 shadow-xs hover:border-gray-300/20"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button className="text-gray-400 hover:text-emerald-500 transition-colors">
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                  )}
                </button>

                <div>
                  <h4
                    className={`font-bold text-sm ${
                      item.completed
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] font-semibold text-gray-400">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>{item.quantity}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(item.id);
                }}
                className="p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
   </DashboardLayout>
  );
};

export default page;
