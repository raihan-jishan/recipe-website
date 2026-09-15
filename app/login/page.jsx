"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2,  ChefHat } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // 🚀 ১. সঠিক Login API Call
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`,
        formData,
      );

      // 🚀 ২. ব্যাকএন্ড থেকে আসা টোকেন রিসিভ করা
      const token =
        response.data.token ||
        response.data.accessToken ||
        response.data.data?.token;

      if (token) {
        // 🚀 ৩. টোকেন LocalStorage-এ সেভ করা
        localStorage.setItem("token", token);

        alert("Login successful!");

        // 🚀 ৪. Recipe Add পেজে রিডাইরেক্ট করা
        router.push("/admin/add-recipe");
      } else {
        setErrorMessage("Token not received from server.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage(
        error.response?.data?.message || "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F0F12] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-[#111111] rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 p-8">
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#00A86B]/10 flex items-center justify-center text-[#00A86B] mb-3">
            <ChefHat className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Login
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sign in to manage your recipes
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400 font-medium text-center">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-900 text-black dark:text-gray-100 border border-gray-200 dark:border-zinc-800 text-sm font-medium focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B] transition-colors placeholder:text-gray-400 dark:placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-900 text-black dark:text-gray-100 border border-gray-200 dark:border-zinc-800 text-sm font-medium focus:outline-none focus:border-[#00A86B] dark:focus:border-[#00A86B] transition-colors placeholder:text-gray-400 dark:placeholder:text-zinc-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-[#00A86B] hover:bg-[#00915c] text-black font-comfortaa font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Submit</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
