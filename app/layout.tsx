import { AppContextProvider } from "@/components/AppContext";
import GeneratedStyles from "@/components/GeneratedStyles";
import NavBar from "@/components/NavBar";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter, Roboto_Mono } from "next/font/google";
import React from "react";
import "./globals.css";
import { getColors } from "@/const/theme";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-sans"
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono"
})

export const metadata: Metadata = {
  title: "WashU Satellite",
  description: "WashU's CubeSat Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppContextProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${robotoMono.variable} font-sans bg-[#181818] antialiased text-[#FFFFFF]`}
        >
          <GeneratedStyles/>
          {children}
          <Footer/>
        </body>
      </html>
    </AppContextProvider>
  );
}
