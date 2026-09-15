import { Button } from "./ui/button";
 

export function Hero() { 
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 transition-colors duration-300">
      {/* 1. Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #888 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* 3. Background Soft Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center -z-10">
        <div className="w-72 h-72 sm:w-[500px] sm:h-[500px] bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-[100px] sm:blur-[140px] animate-pulse"></div>
        <div className="w-60 h-60 sm:w-[450px] sm:h-[450px] bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-[90px] sm:blur-[130px] -ml-20 -mt-20"></div>
      </div>

      {/* 4. Main Hero Content */}
      <div className="py-8 px-4 mx-auto max-w-5xl text-center relative z-10">
        {/* Heading */}
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white md:text-5xl font-comfortaa lg:text-6xl">
          What's Cooking On Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A86B] via-emerald-400 to-teal-500">
            Mind?
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mb-10 text-base sm:text-lg font-normal text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-montserrat">
          Stop staring at an empty fridge. Type in an ingredient, browse
          cravings, and discover your next favorite meal in seconds.
        </p>

        {/* CTA Button Wrapper */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <Button varients={"primary"} path={"/by-ingredients"}>
            Start Cooking
          </Button>
        </div>
      </div>
    </section>
  );
}
