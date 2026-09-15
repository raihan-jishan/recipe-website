"use client";

import { Heading } from "@/components/shared/heading";
import { CountingCard } from "@/components/ui/card";
import DashboardLayout from "@/layout/admin";

export default function Page() {
  return (
    <DashboardLayout className=" text-zinc-100 min-h-screen dark:bg-[#111111]  ">
      <div className="p-6 space-y-6  ">
        <Heading 
          label="Dashboard"
          className="font-Manrope text-2xl font-medium text-zinc-100 tracking-tight"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CountingCard 
            label="Total Recipes"
            point="12"
            className="bg-zinc-900/80 border border-zinc-800 text-zinc-100 shadow-xl backdrop-blur-md hover:border-zinc-700 transition-colors"
          />
          <CountingCard 
            label="Active Categories"
            point="4"
            className="bg-zinc-900/80 border border-zinc-800 text-zinc-100 shadow-xl backdrop-blur-md hover:border-zinc-700 transition-colors"
          />
          <CountingCard 
            label="Total Views"
            point="1,248"
            className="bg-zinc-900/80 border border-zinc-800 text-zinc-100 shadow-xl backdrop-blur-md hover:border-zinc-700 transition-colors"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}