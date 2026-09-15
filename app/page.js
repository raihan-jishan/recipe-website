import { Hero } from "@/components/hero"; 
import Featured from "@/components/featured"; 
import Trending from "@/components/trending";
import QuickAndEasySection from "@/components/quickeasy"; 
import CategoriesPage from "@/components/categories"; 
export default function Home() {
  
  
  return (
     <div className="bg-white dark:bg-[#111111]">
      <Hero />
      <Featured />
      <Trending />
      <QuickAndEasySection /> 
      <CategoriesPage />
      </div>
  );
}
