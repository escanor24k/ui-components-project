import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glass UI – Component Library",
  description: "Glossy liquid glass UI components for Next.js + Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-fixed bg-linear-to-br from-blue-100 via-violet-100 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900`}
        style={{ color: "var(--text)" }}
      >
        {children}
      </body>
    </html>
  );
}
