"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "../ui/logo";
 
export function AdminSidebar({ isOpen, setIsOpen, navigation = [] }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-xl border-r border-gray-100 dark:border-gray-800/60 flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen
            ? "translate-x-0 shadow-2xl lg:shadow-none"
            : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-gray-50 dark:border-gray-900/50">
            <Logo />
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-2 mt-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#00A86B] text-white font-semibold shadow-lg shadow-[#00A86B]/20"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                    }`}
                  />
                  <span className="font-montserrat tracking-wide">
                    {item.name}
                  </span>

                  {/* Active Indicator Pillar */}
                  {isActive && (
                    <span className="absolute right-2 w-1.5 h-5 bg-white/40 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
} 
 
export function UserSidebar({ isOpen, onClose, userNavigation = [] }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-full md:w-64 dark:bg-[#111111] flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-white dark:bg-[#0f0f12]/90 backdrop-blur-md h-full w-full rounded-none md:rounded-r-4xl p-5 border-r border-gray-100 dark:border-gray-800/80 flex flex-col justify-between overflow-y-auto scrollbar-none shadow-2xl md:shadow-none">
          <div>
            {/* Mobile Close Header */}
            <div className="flex items-center justify-between mb-6 md:hidden">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Menu
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Categorized Navigation */}
            <nav className="flex flex-col gap-6">
              {userNavigation.map((group, groupIdx) => (
                <div key={groupIdx} className="flex flex-col gap-1.5">
                  <span className="px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">
                    {group.group}
                  </span>
                  {group.items.map((item, index) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <div className="mt-1" key={index}>
                        <Link
                          href={item.href}
                          onClick={() => {
                            if (window.innerWidth < 768 && onClose) {
                              onClose();
                            }
                          }}
                          className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-montserrat text-[0.8rem] font-semibold transition-all duration-200 ${
                            isActive
                              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                              : "text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100"
                          }`}
                        >
                          {Icon && (
                            <Icon
                              className={`w-[1.2rem] h-[1.2rem] ${
                                isActive
                                  ? "text-white dark:text-gray-900"
                                  : "text-gray-400 dark:text-gray-500"
                              }`}
                            />
                          )}
                          <span>{item.name}</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}