import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConditionalPageBackground } from "@/components/ConditionalPageBackground";
import { AppProviders } from "@/providers/AppProviders";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TaskManager",
  description: "Manage tasks with a simple web interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full font-sans text-slate-900 antialiased">
        <ConditionalPageBackground />
        <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
          <AppProviders>{children}</AppProviders>
        </div>
      </body>
    </html>
  );
}
