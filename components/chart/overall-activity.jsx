import { MoreVertical, Share2 } from "lucide-react";

const OverallActivity = ({recipesCookedCount
, completedCount}) => {
  return (
    <div className="md:col-span-5 lg:col-span-4 bg-gray-900 dark:bg-emerald-600/80 text-white rounded-[32px] p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-medium text-gray-300">
          Overall Activity
        </h2>
        <div className="flex items-center gap-2 text-gray-400 dark:text-black">
          <Share2 className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
          <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      <div className="flex items-baseline gap-6 mb-6">
        <div>
          <span className="text-4xl font-extrabold tracking-tight dark:text-gray-200 font-Manrope">
            {recipesCookedCount}
          </span>
          <p className="text-xs text-gray-400 mt-1">
            Total Cooked Times <br />
          </p>
        </div>

        <div className="border-l border-gray-800 pl-6">
          <span className="text-4xl font-extrabold tracking-tight">
            {completedCount}
          </span>
          <p className="text-xs text-gray-400 mt-1">Completed Recipes</p>
        </div>
      </div>

      {/* Sub Stat Badges */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-3 text-center">
          <span className="block text-lg font-bold text-emerald-400">28</span>
          <span className="text-[10px] text-gray-400">Saved</span>
        </div>
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-3 text-center">
          <span className="block text-lg font-bold text-amber-400">14</span>
          <span className="text-[10px] text-gray-400">Planned</span>
        </div>
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-3 text-center">
          <span className="block text-lg font-bold text-teal-400">11</span>
          <span className="text-[10px] text-gray-400">Completed</span>
        </div>
      </div>
    </div>
  );
};

export default OverallActivity;
