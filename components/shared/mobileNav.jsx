"use client"; 

import { Bookmark, CookingPot, UserRound } from "lucide-react";
import {   House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

const MobileNav = () => {

   const pathName = usePathname();

  const hiddenRoutes = [
    "/details",
    "/login",
    "/start-cooking",
    "/dashboard",
    "/by-ingredients",
    "/recipes",
    "/messages",
  ];
   const isHiddenRoute =
    hiddenRoutes.some((route) => pathName.startsWith(route)) ||
    pathName.startsWith("/user/");

  if (isHiddenRoute) {
    return null;
  }
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const links = [
    { icon: <House strokeWidth={2.5} />, path: "/" },
    { icon: <CookingPot />, path: "/by-ingredients" },
    { icon: <Bookmark />, path: "/user/bookmark" },
    { icon: <UserRound />, path: "/user/dashboard" },
  ];

  const pathname = usePathname();

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        // Hide if scrolling down, Show if scrolling up
        if (window.scrollY > lastScrollY && window.scrollY > 80) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <div
      className={`hidden max-lg:block fixed bottom-4 left-4 right-4 z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-24 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="bg-[#111112]/80 backdrop-blur-2xl border border-white/10 rounded-full   overflow-hidden">
        <div className="grid h-14 grid-cols-4  ">
          {links.map((item, index) => {
            const isActive =
              pathname === item.path ||
              (pathname.startsWith(item.path) && item.path !== "/");
            return (
              <Link
                key={index}
                href={item.path}
                className="relative flex flex-col items-center justify-center px-5 group transition-all duration-300"
              >
                {/* Active Highlight Glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-full" />
                )}

                <div
                  className={`relative z-10 transition-all duration-300 ${
                    isActive
                      ? "bg-emerald-300 p-2 rounded-full text-black"
                      : "group-hover:scale-110  "
                  }`}
                >
                  {React.cloneElement(item.icon, {
                    className: `w-6 h-6 transition-colors ${
                      isActive
                        ? "text-black"
                        : "text-white group-hover:text-slate-200"
                    }`,
                  })}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
