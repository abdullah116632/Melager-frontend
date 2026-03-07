import { Hind_Siliguri, Manrope } from "next/font/google";
import "./globals.css";
import AppProviders from "@/providers/AppProviders";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Meal Manager",
  description: "Hostel monthly meal calculation frontend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className={`${manrope.variable} ${hindSiliguri.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
