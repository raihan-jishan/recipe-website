"use client";

import { useState, useEffect } from "react";
import {
  ChefHat,
  Utensils,
  MoreVertical,
  Bell,
  Plus,
  X,
  Trash2,
  Check,
} from "lucide-react";

export default function DynamicCookList() {
  const [cookList, setCookList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "Today",
    iconType: "chef",
  });

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    const savedCookList = localStorage.getItem("cookListInProcess");
    if (savedCookList) {
      try {
        setCookList(JSON.parse(savedCookList));
      } catch (e) {
        console.error("Failed to parse cook list", e);
      }
    } else {
      // Default Demo Data
      const defaultList = [
        {
          id: "1",
          title: "Buy ingredients for Garlic Butter Pasta",
          date: "Today",
          iconType: "chef",
          notified: true,
        },
        {
          id: "2",
          title: "Doctor's recommended low-carb salad",
          date: "02.09.2026",
          iconType: "utensils",
          notified: false,
        },
      ];
      setCookList(defaultList);
      localStorage.setItem("cookListInProcess", JSON.stringify(defaultList));
    }
  }, []);

  // Save changes to localStorage
  const saveToLocalStorage = (newList) => {
    setCookList(newList);
    localStorage.setItem("cookListInProcess", JSON.stringify(newList));
  };

  // Add New Cook Task
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      title: formData.title,
      date: formData.date || "Today",
      iconType: formData.iconType,
      notified: false,
    };

    const updatedList = [...cookList, newItem];
    saveToLocalStorage(updatedList);
    setFormData({ title: "", date: "Today", iconType: "chef" });
    setIsModalOpen(false);
  };

  // Toggle Notification State
  const toggleNotification = (id) => {
    const updatedList = cookList.map((item) =>
      item.id === id ? { ...item, notified: !item.notified } : item
    );
    saveToLocalStorage(updatedList);
  };

  // Delete Task
  const handleDelete = (id) => {
    const updatedList = cookList.filter((item) => item.id !== id);
    saveToLocalStorage(updatedList);
    setActiveMenuId(null);
  };

  return (
    <div className="lg:col-span-7 flex flex-col justify-between">
      {/* Section Header with Dynamic Count */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 font-comfortaa">
          Cook List In Process ({cookList.length})
        </h2>
        <button
          onClick={() => alert("Archive functionality can be connected here.")}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          Open archive &rarr;
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cookList.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-gray-800/80 rounded-[28px] p-5 shadow-xs relative flex flex-col justify-between h-48 hover:-translate-y-1 transition-transform duration-200 group"
          >
            {/* Header: Icon & Options */}
            <div className="flex justify-between items-start relative">
              <div
                className={`p-2.5 rounded-xl ${
                  item.iconType === "chef"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-amber-500/10 text-amber-500"
                }`}
              >
                {item.iconType === "chef" ? (
                  <ChefHat className="w-5 h-5" />
                ) : (
                  <Utensils className="w-5 h-5" />
                )}
              </div>

              <button
                onClick={() =>
                  setActiveMenuId(activeMenuId === item.id ? null : item.id)
                }
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Popup Dropdown for Action */}
              {activeMenuId === item.id && (
                <div className="absolute right-0 top-7 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-1.5 min-w-[110px]">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Title & Date */}
            <div>
              <h3 className="font-bold text-sm line-clamp-2 text-gray-900 dark:text-gray-100">
                {item.title}
              </h3>
              <span className="text-[11px] font-medium text-gray-400 mt-2 block">
                {item.date}
              </span>
            </div>

            {/* Notification Bell Button */}
            <div className="flex justify-end">
              <button
                onClick={() => toggleNotification(item.id)}
                title={
                  item.notified ? "Notification Active" : "Set Notification"
                }
                className={`p-2 rounded-xl hover:scale-105 transition-transform cursor-pointer ${
                  item.notified
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Card 3: Add New Task Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-gray-300/80 dark:border-gray-800 rounded-[28px] p-5 flex flex-col items-center justify-center gap-2 hover:border-emerald-500/50 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 transition-all group h-48 cursor-pointer"
        >
          <div className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 group-hover:scale-110 transition-transform text-gray-600 dark:text-gray-300">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
            Add Schedule
          </span>
        </button>
      </div>

      {/* Add Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-[28px] p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Add Cook Schedule
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prep veggies for salad"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Schedule Date / Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. Today or 10.09.2026"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Icon
                </label>
                <select
                  value={formData.iconType}
                  onChange={(e) =>
                    setFormData({ ...formData, iconType: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                >
                  <option value="chef">Chef Hat 👨‍🍳</option>
                  <option value="utensils">Utensils 🍴</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#00A86B] hover:bg-[#00915c] text-white font-bold rounded-xl text-sm transition-colors mt-2 cursor-pointer"
              >
                Save Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}