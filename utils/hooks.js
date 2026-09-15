import { Bookmark, Sun, SunMedium, Sunset, Moon } from "lucide-react";

export const getTimeBasedMessage = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) {
    return {
      text: "Pick for Breakfast",
      icon: <Sun className="" />,
    };
  } else if (hour >= 11 && hour < 16) {
    return {
      text: "Ideal for Lunch ",
      icon: <SunMedium className="w-3.5 h-3.5 text-amber-400" />,
    };
  } else if (hour >= 16 && hour < 19) {
    return {
      text: "Perfect Evening Snack ",
      icon: <Sunset className="w-3.5 h-3.5 text-orange-400" />,
    };
  } else {
    return {
      text: "Great for Dinner",
      icon: <Moon className="w-3.5 h-3.5 text-indigo-300" />,
    };
  }
};
