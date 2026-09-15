"use client";
import { ChartArea, CookingPot, Home, Search, User } from "lucide-react";
import Logo from "../ui/logo";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
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
    ["/user", "/admin"].some((route) => pathName.includes(route));

  if (isHiddenRoute) {
    return null;
  }
  return (
    <div className=" bg-white dark:bg-[#111111]    text-black p-2  px-5 flex items-center justify-between    w-full   backdrop-blur-3xl dark:backdrop-blur-none   ">
      <div>
        <Logo />
      </div>

      <div className="mt-3 max-lg:hidden block">
        <Link
          href="/user/dashboard"
          className="flex items-center  dark:text-white gap-0.5 font-montserrat font-semibold  border border-gray-400/60 hover:bg-gray-400/20 rounded-full p-2 px-3"
        >
          <User size={25} className="dark:text-gray-300" /> Profie
        </Link>
      </div>
    </div>
  );
}
