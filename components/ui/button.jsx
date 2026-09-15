import Link from "next/link";

export const Button = ({ children, varients, path }) => {
  const primary =
    "relative inline-flex justify-center items-center py-4 px-10   text-base font-semibold font-Manrope text-center text-white rounded-full bg-black hover:opacity-90 transition-all duration-300  dark:bg-emerald-500 dark:text-black ";
  const cook =
    "relative inline-flex justify-center items-center py-4 px-10   text-base font-semibold font-Manrope text-center text-white rounded-full bg-black hover:opacity-90 transition-all duration-300 border dark:bg-transparent dark:text-black";

  return (
    <Link href={path} className={`${varients === "primary" ? primary : varients === "cook" ? cook : ""}`}>
      {children}
    </Link>
  );
};
