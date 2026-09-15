import { ChefHat } from "lucide-react";
import Link from "next/link";

export default function Logo() {
    return (
    <div>
        <Link href={'/'} className="text-[1.3rem] font-medium font-montserrat tracking-tight text-gray-800 dark:text-gray-100 flex items-center  ">
       <ChefHat className="w-6 h-6"   /> CookMind
    </Link>
    </div>
    )
}