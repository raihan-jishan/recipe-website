import { FoodCard } from "@/components/ui/card";
import DashboardLayout from "@/layout/admin";
  
export default function page() {
  return (
  <DashboardLayout>
      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex gap-4 mt-5 min-w-max px-1">
        <FoodCard />
        <FoodCard />
        <FoodCard />
      </div>
    </div>
  </DashboardLayout>
  );
}
 