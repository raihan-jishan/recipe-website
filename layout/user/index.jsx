"use client";
import { useState } from "react";
import { UserSidebar } from "@/components/shared/sidebar";
import { userNavigation } from "@/constants";
import { Menu } from "lucide-react";

const UserLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen  bg-[#F4F5F8] dark:bg-[#0F0F12] text-gray-900 dark:text-gray-100 flex-col md:flex-row antialiased overflow-x-hidden transition-colors duration-300  ">
      
      <div className="md:hidden flex items-end justify-end  bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 z-30 fixed top-0 left-0 right-0">
       
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl bg-gray-100 dark:bg-[#111111]   text-gray-700 dark:text-gray-400 fixed max-lg:p-2 top-4"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* 1. PREMIUM SIDEBAR (DESKTOP & MOBILE) */}
      <UserSidebar
        userNavigation={userNavigation}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      {/* 2. WORKSPACE CONTAINER */}
      <main className="flex-1 md:pl-64 lg:pl-68 min-h-screen flex flex-col pb-24 md:pb-0 relative z-10 transition-all duration-300 mt-16 md:mt-0 max-lg:mt-0">
        <div className="p-4 sm:p-2 lg:p-2 flex-1 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
