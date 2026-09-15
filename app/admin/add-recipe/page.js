"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  ChefHat,
  Plus,
  Trash2,
  X,
  Upload,
  Loader2,
} from "lucide-react";

export default function AddRecipeAdmin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titleEn: "",
    titleBn: "",
    descriptionEn: "",
    descriptionBn: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    category: "Dessert",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Ingredients List
  const [ingredients, setIngredients] = useState([
    { nameEn: "", nameBn: "", amount: "", unitEn: "", unitBn: "" },
  ]);

  // Dynamic Steps List
  const [steps, setSteps] = useState([
    { stepNumber: 1, instructionEn: "", instructionBn: "" },
  ]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAddIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { nameEn: "", nameBn: "", amount: "", unitEn: "", unitBn: "" },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        return { ...item, [field]: value };
      }),
    );
  };

  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      { stepNumber: prev.length + 1, instructionEn: "", instructionBn: "" },
    ]);
  };

  const handleRemoveStep = (index) => {
    setSteps((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((step, idx) => ({ ...step, stepNumber: idx + 1 })),
    );
  };

  const handleStepInstructionChange = (index, field, value) => {
    setSteps((prev) =>
      prev.map((step, idx) => {
        if (idx !== index) return step;
        return { ...step, [field]: value };
      }),
    );
  };

  // Fixed Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();

    // Basic fields
    formDataToSend.append(
      "title",
      formData.titleEn || formData.titleBn || "Untitled",
    );
    formDataToSend.append(
      "description",
      formData.descriptionEn || formData.descriptionBn || "",
    );
    formDataToSend.append("prepTime", formData.prepTime || 0);
    formDataToSend.append("cookTime", formData.cookTime || 0);
    formDataToSend.append("servings", formData.servings || 0);
    formDataToSend.append("category", formData.category);

    // Array fields - JSON stringify করে পাঠানো
    const formattedIngredients = ingredients.map((ing) => ({
      name: ing.nameEn || ing.nameBn || "",
      amount: Number(ing.amount) || 0,
      unit: ing.unitEn || ing.unitBn || "",
    }));
    formDataToSend.append("ingredients", JSON.stringify(formattedIngredients));

    const formattedSteps = steps.map((step) => ({
      stepNumber: step.stepNumber,
      instruction: step.instructionEn || step.instructionBn || "",
    }));
    formDataToSend.append("steps", JSON.stringify(formattedSteps));

    // File
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("রেসিপি সফলভাবে সেভ হয়েছে!");
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#111111] text-gray-900 dark:text-gray-100 font-sans pb-16">
      <header className="sticky top-0 z-20 bg-white dark:bg-[#111111] border-b border-gray-100 dark:border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white font-comfortaa">
                Add Recipe
              </h1>
            </div>
          </div>

          <button
            type="submit"
            form="recipe-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold shadow-md disabled:opacity-50 transition-all hover:scale-[0.99] cursor-pointer"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>
              {isSubmitting ? "Publishing..." : "Publish Recipe "}
            </span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        <form
          id="recipe-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Title & Description */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#00A86B]" />   Information
                / মৌলিক তথ্য
              </h2>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Recipe Title (English)
                    </label>
                    <input
                      type="text"
                      name="titleEn"
                      placeholder="Recipe Title (English)"
                      value={formData.titleEn}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm font-medium focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      রেসিপির নাম 
                    </label>
                    <input
                      type="text"
                      name="titleBn"
                      placeholder="রেসিপির নাম "
                      value={formData.titleBn}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm font-medium focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Description (English)
                    </label>
                    <textarea
                      rows={3}
                      name="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={handleInputChange}
                      placeholder="Delicious chocolate macarons recipe..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm font-medium focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      বিবরণ 
                    </label>
                    <textarea
                      rows={3}
                      name="descriptionBn"
                      value={formData.descriptionBn}
                      onChange={handleInputChange}
                      placeholder="মজার চকলেট ম্যাকারুন রেসিপি..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm font-medium focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                      Prep Time (m)
                    </label>
                    <input
                      type="number"
                      name="prepTime"
                      value={formData.prepTime}
                      onChange={handleInputChange}
                      placeholder="15"
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                      Cook Time (m)
                    </label>
                    <input
                      type="number"
                      name="cookTime"
                      value={formData.cookTime}
                      onChange={handleInputChange}
                      placeholder="12"
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                      Servings
                    </label>
                    <input
                      type="number"
                      name="servings"
                      value={formData.servings}
                      onChange={handleInputChange}
                      placeholder="2"
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B]"
                    >
                      <option
                        value="Dessert"
                        className="dark:bg-transparent dark:text-white"
                      >
                        Dessert / ডেজার্ট
                      </option>
                      <option
                        value="Main Course"
                        className="dark:bg-transparent dark:text-white"
                      >
                        Main Course / মেন কোর্স
                      </option>
                      <option
                        value="Appetizer"
                        className="dark:bg-transparent dark:text-white"
                      >
                        Appetizer / অ্যাপেটাইজার
                      </option>
                      <option
                        value="Breakfast"
                        className="dark:bg-transparent dark:text-white"
                      >
                        Breakfast / ব্রেকফাস্ট
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Ingredients / উপকরণ
                </h2>
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#00A86B] hover:underline cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Ingredient
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-transparent border border-gray-100 dark:border-gray-800 relative"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <input
                        type="text"
                        placeholder="Name (EN)"
                        value={ing.nameEn}
                        onChange={(e) =>
                          handleIngredientChange(idx, "nameEn", e.target.value)
                        }
                        className="px-3 py-2 rounded-lg bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B]"
                      />
                      <input
                        type="text"
                        placeholder="নাম "
                        value={ing.nameBn}
                        onChange={(e) =>
                          handleIngredientChange(idx, "nameBn", e.target.value)
                        }
                        className="px-3 py-2 rounded-lg bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B]"
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={ing.amount}
                        onChange={(e) =>
                          handleIngredientChange(idx, "amount", e.target.value)
                        }
                        className="px-3 py-2 rounded-lg bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B]"
                      />
                      <input
                        type="text"
                        placeholder="Unit (EN)"
                        value={ing.unitEn}
                        onChange={(e) =>
                          handleIngredientChange(idx, "unitEn", e.target.value)
                        }
                        className="px-3 py-2 rounded-lg bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B]"
                      />
                      <input
                        type="text"
                        placeholder="একক "
                        value={ing.unitBn}
                        onChange={(e) =>
                          handleIngredientChange(idx, "unitBn", e.target.value)
                        }
                        className="px-3 py-2 rounded-lg bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B]"
                      />
                    </div>
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 p-1 rounded-full shadow border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Steps / প্রস্তুতপ্রণালী
                </h2>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#00A86B] hover:underline cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Step
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-transparent border border-gray-100 dark:border-gray-800 relative"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#00A86B]">
                        Step / ধাপ {step.stepNumber}
                      </span>
                      {steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <textarea
                        rows={2}
                        placeholder="Instruction (English)"
                        value={step.instructionEn}
                        onChange={(e) =>
                          handleStepInstructionChange(
                            idx,
                            "instructionEn",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B]"
                      />
                      <textarea
                        rows={2}
                        placeholder="নির্দেশনা "
                        value={step.instructionBn}
                        onChange={(e) =>
                          handleStepInstructionChange(
                            idx,
                            "instructionBn",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Cover Image */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Cover Image / ছবি
              </h2>
              {imagePreview ? (
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/60 dark:bg-black/80 text-white hover:bg-black/80 dark:hover:bg-black transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:border-[#00A86B] dark:hover:border-[#00A86B] cursor-pointer transition-colors bg-gray-50/50 dark:bg-transparent/50">
                  <Upload className="w-6 h-6 text-[#00A86B] mb-2" />
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Click to upload
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
