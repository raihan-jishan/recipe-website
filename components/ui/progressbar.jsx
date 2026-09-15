export default function Progressbar({ currentStep, recipe }) {
  return (
    <div className="w-full bg-gray-200 h-1.5">
      <div
        className="bg-[#00A86B] h-1.5 transition-all duration-300 ease-out"
        style={{
          width: `${((currentStep + 1) / recipe.steps.length) * 100}%`,
        }}
      />
    </div>
  );
}
