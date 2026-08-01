import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Oxie - AI Assistant",
  description:
    "A streaming AI assistant for developers and creators. Ask anything about code, real-time news, technology, and engineering.",
  keywords: ["AI", "Oxie", "assistant", "developer tools", "real-time AI"],
  icons: {
    icon: "/images/oxie.png",
  },
  openGraph: {
    title: "Oxie",
    description: "Your personal AI assistant",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full h-full">{children}</body>
    </html>
  );
}
