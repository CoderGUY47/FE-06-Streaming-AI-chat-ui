"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiLock, FiMail, FiUser, FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    // Simulate signup delay then redirect to chat
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

      {/* Main Signup Card */}
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
            Create your Oxie account
          </h1>
          <p className="text-xs text-slate-500 max-w-xs">
            Start coding, debugging, and building intelligent projects with AI.
          </p>
        </div>

        {/* Social Signups */}
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

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-800">
              Full name
            </label>
            <div className="relative flex items-center">
              <FiUser className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New User"
                className="w-full h-9.5 pl-9 pr-3 text-xs bg-slate-50 border border-black/10 focus:border-black/15 rounded-[4px] outline-none text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

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
            <label className="text-xs font-bold text-slate-800">
              Password
            </label>
            <div className="relative flex items-center">
              <FiLock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full h-9.5 pl-9 pr-3 text-xs bg-slate-50 border border-black/10 focus:border-black/15 rounded-[4px] outline-none text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-800">
              Confirm password
            </label>
            <div className="relative flex items-center">
              <FiLock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full h-9.5 pl-9 pr-3 text-xs bg-slate-50 border border-black/10 focus:border-black/15 rounded-[4px] outline-none text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-[4px] border border-black/15 transition-colors cursor-pointer outline-none mt-1 flex items-center justify-center gap-2"
          >
            {isLoading ? "Creating account…" : "Create account"}
          </button>
        </form>

        {/* Footer Redirect to Login */}
        <div className="text-center pt-2 border-t border-black/10 text-xs text-slate-600">
          <span>Already have an account? </span>
          <Link
            href="/login"
            className="font-bold text-purple-600 hover:text-purple-700 hover:underline no-underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
