import { Manrope, Montserrat, Comfortaa, Borel } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/header";
import { ThemeProvider } from "@/context/ThemeContext";
import MobileNav from "@/components/shared/mobileNav";
 
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-Manrope",
  subsets: ["latin"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const borel = Borel({
  variable: "--font-borel",
  subsets: ["latin"],
  weight: ["400"],
});
export const metadata = {
  title: "pitchBite",
  description: "your personal recipe provider app",
};

export default function RootLayout({ children }) {
      
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${manrope.variable} ${comfortaa.variable} ${borel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Header />
          {children} 
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
