import { AdminSidebar } from "@/components/shared/sidebar";
import { navigation } from "@/constants";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]   text-black flex flex-col md:flex-row antialiased   overflow-x-hidden">
      {/* ─── 1. PREMIUM SIDEBAR (DESKTOP) ─── */}
      <AdminSidebar navigation={navigation} />
      {/* ─── 3. WORKSPACE CONTAINER ─── */}
      <main className="flex-1 md:pl-68 min-h-screen flex flex-col pb-28 md:pb-0 relative z-10">
        {/* Content Render Surface */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
