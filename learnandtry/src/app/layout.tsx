import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LearnAndTry",
  description: "Révisions boostées par l'IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-bg-0 text-text-1 antialiased app-bg">
        <div className="flex min-h-screen relative z-10">
          <Sidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}