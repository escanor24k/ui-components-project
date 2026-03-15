"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Separator } from "@/components/ui/Separator";
import { Sun, Moon } from "lucide-react";

import { NavigationDemo } from "@/components/mainpage/NavigationDemo";
import { ButtonsBadgesDemo } from "@/components/mainpage/ButtonsBadgesDemo";
import { AlertsDemo } from "@/components/mainpage/AlertsDemo";
import { OverlaysDemo } from "@/components/mainpage/OverlaysDemo";
import { CardsDemo } from "@/components/mainpage/CardsDemo";
import { ProgressDemo } from "@/components/mainpage/ProgressDemo";
import { FormsDemo } from "@/components/mainpage/FormsDemo";
import { DataTableDemo } from "@/components/mainpage/DataTableDemo";
import { InputWidgetsDemo } from "@/components/mainpage/InputWidgetsDemo";
import { StepperDemo } from "@/components/mainpage/StepperDemo";
import { AccordionRatingDemo } from "@/components/mainpage/AccordionRatingDemo";
import { TimelineDemo } from "@/components/mainpage/TimelineDemo";
import { FeedbackDemo } from "@/components/mainpage/FeedbackDemo";
import { DataDisplayDemo } from "@/components/mainpage/DataDisplayDemo";
import { MarqueeChangelogDemo } from "@/components/mainpage/MarqueeChangelogDemo";
import { UtilitiesDemo } from "@/components/mainpage/UtilitiesDemo";
import { NewComponentsDemo } from "@/components/mainpage/NewComponentsDemo";
import { AdvancedComponentsDemo } from "@/components/mainpage/AdvancedComponentsDemo";
import { GridDemo } from "@/components/mainpage/GridDemo";

export default function Home(): React.ReactElement {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-100 via-violet-100 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 p-4 sm:p-8 lg:p-12">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* ── Header ── */}
        <PageHeader
          title="Glass UI Components"
          description="Copy-paste UI-Bibliothek mit Liquid Glass Design · Tailwind CSS v4 · Dark Mode"
          actions={
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium backdrop-blur-xl bg-linear-to-br from-white/70 via-white/50 to-white/30 dark:from-white/10 dark:via-white/6 dark:to-white/3 border border-white/60 dark:border-white/10 shadow-sm text-(--text) hover:shadow-md transition-all cursor-pointer"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
          }
        />

        {/* ── Sections ── */}
        <NavigationDemo />
        <ButtonsBadgesDemo />
        <AlertsDemo />
        <OverlaysDemo />
        <CardsDemo />
        <NewComponentsDemo />
        <AdvancedComponentsDemo />
        <ProgressDemo />
        <FormsDemo />
        <DataTableDemo />
        <InputWidgetsDemo />
        <StepperDemo />
        <AccordionRatingDemo />
        <TimelineDemo />
        <FeedbackDemo />
        <DataDisplayDemo />
        <MarqueeChangelogDemo />
        <GridDemo />
        <UtilitiesDemo />

        {/* ── Footer ── */}
        <footer className="pb-8 text-center">
          <Separator className="mb-8" />
          <p className="text-sm text-(--text-muted)">
            Glass UI · Tailwind CSS v4 · Next.js · Copy-paste ready
          </p>
        </footer>
      </div>
    </main>
  );
}
