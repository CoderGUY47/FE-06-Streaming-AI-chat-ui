"use client";

import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function ThinkingIndicator() {
  return (
    <div
      className="flex gap-3 w-full"
      aria-label="AI is thinking"
      aria-live="polite"
    >
      {/* Assistant logo without bg */}
      <Image
        src="/images/oxie.png"
        alt="Oxie AI Logo"
        width={20}
        height={20}
        className="object-contain shrink-0 mt-2 select-none"
      />

      {/* Lottie loader + label */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white border border-black/10 rounded-md">
        <div className="w-6 h-6 flex items-center justify-center shrink-0">
          <DotLottieReact
            src="/animations/loading.lottie"
            loop
            autoplay
          />
        </div>
        <span className="text-[13.5px] text-slate-600 font-medium">
          Oxie is thinking…
        </span>
      </div>
    </div>
  );
}
