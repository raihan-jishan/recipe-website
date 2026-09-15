import {
  LayoutDashboard,
  PlusCircle, 
  Users, 
  Utensils,
  Calendar,
  ShoppingBag,
  Heart,
  Clock,
  Calculator,
  BookOpen,
  Settings,
  Award,
} from "lucide-react"; 


export const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Add Recipe", href: "/admin/add-recipe", icon: PlusCircle },
  { name: "All Recipes", href: "/admin/all-recipes", icon: BookOpen },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export const userNavigation = [
  {
    group: "MAIN MENU",
    items: [
      { name: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
        { name: "Meal Planner", href: "/user/meal-planner", icon: Calendar },
      {
        name: "Shopping List",
        href: "/user/shopping-list",
        icon: ShoppingBag,
      },
    ],
  },
  {
    group: "KITCHEN TOOLS",
    items: [
      {
        name: "Unit Converter",
        href: "/user/unit-converter",
        icon: Calculator,
      },
      { name: "Multi-Timer", href: "/user/multi-timer", icon: Clock },
      {
        name: "Ingredient Substitute",
        href: "/user/ingredient-substitute",
        icon: BookOpen,
      },
    ],
  },
  {
    group: "PERSONAL",
    items: [
      { name: "Saved & Favorites", href: "/user/bookmark", icon: Heart },
      { name: "My Cooking Notes", href: "/user/cooking-note", icon: Award },
    ],
  },
];
