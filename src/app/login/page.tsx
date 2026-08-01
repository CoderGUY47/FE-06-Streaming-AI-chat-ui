"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiLock, FiMail, FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay then redirect to chat
    setTimeout(() => {
      setIsLoading(false);
      router.push("/chat");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center p-4 select-none font-sans">
      {/* Top back navigation */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          href="/chat"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors no-underline px-2.5 py-1.5 rounded-[4px] border border-black/10 hover:border-black/15 bg-white"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Chat</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white border border-black/10 rounded-md shadow-xs p-6 sm:p-8 flex flex-col gap-6">
        {/* Header with Oxie Logo */}
        <div className="flex flex-col items-center text-center gap-2">
          <Image
            src="/images/oxie.png"
            alt="Oxie AI Logo"
            width={64}
            height={64}
            className="w-16 h-16 object-contain mb-1"
            priority
          />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back to Oxie
          </h1>
          <p className="text-xs text-slate-500 max-w-xs">
            Sign in to access your saved chats, custom agents, and AI projects.
          </p>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => router.push("/chat")}
            className="flex items-center justify-center gap-2 h-9 px-3 bg-white hover:bg-slate-50 border border-black/10 hover:border-black/15 rounded-[4px] text-xs font-semibold text-slate-700 transition-colors cursor-pointer outline-none"
          >
            <FcGoogle className="w-4 h-4" />
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => router.push("/chat")}
            className="flex items-center justify-center gap-2 h-9 px-3 bg-white hover:bg-slate-50 border border-black/10 hover:border-black/15 rounded-[4px] text-xs font-semibold text-slate-700 transition-colors cursor-pointer outline-none"
          >
            <FiGithub className="w-4 h-4 text-slate-900" />
            <span>GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-0.5">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Or with email
          </span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-800">
              Email address
            </label>
            <div className="relative flex items-center">
              <FiMail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-9.5 pl-9 pr-3 text-xs bg-slate-50 border border-black/10 focus:border-black/15 rounded-[4px] outline-none text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Password
              </label>
              <a href="#" className="text-[11.5px] font-semibold text-purple-600 hover:text-purple-700 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative flex items-center">
              <FiLock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-9.5 pl-9 pr-3 text-xs bg-slate-50 border border-black/10 focus:border-black/15 rounded-[4px] outline-none text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-[4px] border border-black/15 transition-colors cursor-pointer outline-none mt-1 flex items-center justify-center gap-2"
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Footer Redirect to Signup */}
        <div className="text-center pt-2 border-t border-black/10 text-xs text-slate-600">
          <span>Don&apos;t have an account? </span>
          <Link
            href="/signup"
            className="font-bold text-purple-600 hover:text-purple-700 hover:underline no-underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
