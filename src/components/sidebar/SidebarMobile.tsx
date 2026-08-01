"use client";

import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiSliders } from "react-icons/fi";
import { PiCirclesThreePlus, PiUserCircleDuotone } from "react-icons/pi";

interface SidebarMobileProps {
  onNewChat: () => void;
}

export default function SidebarMobile({ onNewChat }: SidebarMobileProps) {
  return (
    <aside className="w-15 h-full bg-white border-r border-black/10 hidden lg:hidden md:flex flex-col items-center py-4 gap-3 shrink-0 select-none">
      {/* Brand logo */}
      <div className="w-8 h-8 flex items-center justify-center">
        <Image src="/images/oxie.png" alt="Oxie Logo" width={22} height={22} className="object-contain" />
      </div>

      {/* New chat primary button with PiCirclesThreePlus icon */}
      <button
        type="button"
        onClick={onNewChat}
        title="New chat"
        className="w-8 h-8 rounded-[4px] bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center border border-black/15 cursor-pointer transition-colors outline-none"
      >
        <PiCirclesThreePlus className="w-4.5 h-4.5" />
      </button>

      {/* Search */}
      <button
        type="button"
        title="Search"
        className="w-8 h-8 rounded-[4px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center border border-black/10 hover:border-black/15 bg-white cursor-pointer transition-colors outline-none"
      >
        <FiSearch className="w-4 h-4" />
      </button>

      <div className="flex-1" />

      {/* Settings */}
      <button
        type="button"
        title="Settings"
        className="w-8 h-8 rounded-[4px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center border border-black/10 hover:border-black/15 bg-white cursor-pointer transition-colors outline-none"
      >
        <FiSliders className="w-4 h-4" />
      </button>

      {/* Free user icon link */}
      <Link
        href="/login"
        title="New User - Log in"
        className="w-8 h-8 rounded-[4px] flex items-center justify-center text-slate-800 hover:bg-slate-50 border border-transparent hover:border-black/10 transition-colors"
      >
        <PiUserCircleDuotone className="w-6.5 h-6.5" />
      </Link>
    </aside>
  );
}
