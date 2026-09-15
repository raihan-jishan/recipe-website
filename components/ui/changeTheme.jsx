import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const ChangeTheme = () => {
  const { theme, changeTheme } = useTheme();
  return (
    <div className="relative p-2.5 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/60 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-xs cursor-pointer">
      {theme === "light" ? (
        <Moon
          className="w-[1.2rem] h-[1.2rem]"
          onClick={() => changeTheme("dark")}
        />
      ) : (
        <Sun
          className="w-[1.2rem] h-[1.2rem]"
          onClick={() => changeTheme("light")}
        />
      )}
    </div>
  );
};

export default ChangeTheme;
