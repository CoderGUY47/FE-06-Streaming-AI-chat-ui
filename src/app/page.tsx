import Link from "next/link";
import Image from "next/image";
import { HiSparkles, HiArrowRight, HiCodeBracket, HiGlobeAlt } from "react-icons/hi2";

/**
 * Landing page (http://localhost:3000/)
 * Split-screen design with Oxie 3D bot logo, gradient tech background,
 * feature pills, and CTA buttons.
 */
export default function LandingPage() {
  return (
    <main
      className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 text-slate-100 font-sans"
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#0b0f19",
        color: "#f8fafc",
      }}
    >
      {/* ── Left Hero Image Section ── */}
      <section
        className="relative flex-1 min-h-105 lg:min-h-screen flex items-center justify-center p-8 overflow-hidden bg-linear-to-br from-indigo-950 via-slate-900 to-indigo-900"
        style={{
          flex: 1,
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #101438 0%, #1e2568 40%, #3a4db7 70%, #5b6af5 100%)",
          overflow: "hidden",
        }}
      >
        {/* Decorative Grid Overlay */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 600 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, opacity: 0.12, pointerEvents: "none" }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 55} y1={0} x2={i * 55} y2={700} stroke="white" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={`h${i}`} y1={i * 50} x1={0} y2={i * 50} x2={600} stroke="white" strokeWidth="0.5" />
          ))}
        </svg>

        {/* Central 3D Oxie Icon in Glassmorphic Ring */}
        <div
          className="relative z-10 flex flex-col items-center gap-6"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, zIndex: 10 }}
        >
          <div
            style={{
              width: 230,
              height: 230,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.12)",
              border: "2px solid rgba(255, 255, 255, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(16px)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(91, 106, 245, 0.4)",
            }}
          >
            <Image
              src="/images/oxie.png"
              alt="Oxie AI Bot"
              width={190}
              height={190}
              priority
              style={{ objectFit: "contain", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.4))" }}
            />
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: 10 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 9999,
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                fontSize: 12,
                fontWeight: 600,
                color: "#e0e7ff",
                backdropFilter: "blur(8px)",
              }}
            >
              <HiSparkles size={14} style={{ color: "#818cf8" }} />
              Oxie 3.7 Sonnet
            </span>
          </div>
        </div>
      </section>

      {/* ── Right Content Section ── */}
      <section
        className="w-full lg:w-135 xl:w-150 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-slate-900/90 border-t lg:border-t-0 lg:border-l border-slate-800/80 backdrop-blur-lg"
        style={{
          width: 540,
          height: "100%",
          padding: "60px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#090d16",
          borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Logo & Brand Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "rgba(91, 106, 245, 0.15)",
                border: "1px solid rgba(91, 106, 245, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 6,
              }}
            >
              <Image
                src="/images/oxie.png"
                alt="Oxie Logo"
                width={44}
                height={44}
                style={{ objectFit: "contain" }}
              />
            </div>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.5px" }}>
                Oxie
              </h2>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>Your intelligent AI companion</span>
            </div>
          </div>

          <div style={{ height: 1, width: "100%", background: "rgba(255, 255, 255, 0.1)" }} />

          {/* Headline */}
          <div>
            <h1
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.25,
                marginBottom: 14,
                letterSpacing: "-0.4px",
              }}
            >
              Build faster, explore deeper with{" "}
              <span style={{ color: "#5b6af5" }}>Oxie</span>.
            </h1>

            <p style={{ fontSize: 14.5, color: "#94a3b8", lineHeight: 1.65, margin: 0 }}>
              A high-performance streaming AI assistant built for developers. Ask questions, debug code, explore architectures, and ship faster — powered by state-of-the-art models.
            </p>
          </div>

          {/* Features */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12.5,
                color: "#cbd5e1",
              }}
            >
              <HiCodeBracket size={16} style={{ color: "#818cf8" }} />
              <span>Real-time Code Streaming</span>
            </div>

            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12.5,
                color: "#cbd5e1",
              }}
            >
              <HiGlobeAlt size={16} style={{ color: "#a78bfa" }} />
              <span>2026 Web Search & Docs</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14, marginTop: 36 }}>
          <Link
            href="/chat"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "13px 28px",
              background: "#5b6af5",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 10,
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(91, 106, 245, 0.4)",
            }}
          >
            <span>Get Started</span>
            <HiArrowRight size={16} />
          </Link>

          <a
            href="https://github.com/CoderGUY47/capstone-project"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "13px 28px",
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#f8fafc",
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 10,
              textDecoration: "none",
            }}
          >
            Learn more
          </a>
        </div>
      </section>
    </main>
  );
}
