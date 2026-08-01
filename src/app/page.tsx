"use client";

import LandingBackground from "@/components/landing/LandingBackground";
import LandingHeader from "@/components/landing/LandingHeader";
import LeftHeroCards from "@/components/landing/LeftHeroCards";
import CenterHeroCore from "@/components/landing/CenterHeroCore";
import RightHeroCards from "@/components/landing/RightHeroCards";
import LandingFooter from "@/components/landing/LandingFooter";

/**
 * Main Landing Page (http://localhost:3000/)
 * Modularized into individual clean components:
 * - LandingBackground: Gradient, ambient glow orbs & grid
 * - LandingHeader: Top bar navigation & CTAs
 * - LeftHeroCards: Code Terminal & Latency/Accuracy floating cards
 * - CenterHeroCore: 190px animated logo, title, description, CTAs & chips
 * - RightHeroCards: Deep Reasoner & Starter Capabilities floating cards
 * - LandingFooter: Footer with custom copyright text
 */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen h-screen w-full flex flex-col justify-between p-4 sm:p-6 font-sans select-none overflow-hidden text-slate-100">
      <LandingBackground />
      <LandingHeader />

      {/* ── Main 3-Column Hero Grid ── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8">
        <LeftHeroCards />
        <CenterHeroCore />
        <RightHeroCards />
      </main>

      <LandingFooter />
    </div>
  );
}
