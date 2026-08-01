"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { FiCopy, FiCheck, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { UIMessage } from "ai";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: UIMessage;
}

type LikeState = "none" | "liked" | "disliked";

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [likeState, setLikeState] = useState<LikeState>("none");

  // Extract text from parts (v7 UIMessage)
  const textContent = message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");

  const handleCopy = useCallback(() => {
    if (!textContent) return;
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [textContent]);

  const handleLike = useCallback(() => {
    setLikeState((prev: LikeState) => (prev === "liked" ? "none" : "liked"));
  }, []);

  const handleDislike = useCallback(() => {
    setLikeState((prev: LikeState) => (prev === "disliked" ? "none" : "disliked"));
  }, []);

  return (
    <div className={cn("flex gap-3 w-full", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Icon without bg */}
      {isUser ? (
        <span className="text-xs font-extrabold text-slate-800 shrink-0 mt-2 select-none">OX</span>
      ) : (
        <Image src="/images/oxie.png" alt="Oxie AI Logo" width={20} height={20} className="object-contain shrink-0 mt-2 select-none" />
      )}

      {/* Content column */}
      <div className={cn("flex flex-col gap-1.5 max-w-[78%]", isUser ? "items-end" : "items-start")}>
        {/* Bubble */}
        <div
          className={cn(
            "px-4 py-3 rounded-md text-[14.5px] leading-relaxed border",
            isUser
              ? "bg-slate-900 text-white border-black/15"
              : "bg-white border-black/10 text-slate-800"
          )}
        >
          {isUser ? (
            <span className="whitespace-pre-wrap">{textContent}</span>
          ) : (
            <StreamingMarkdown content={textContent} />
          )}
        </div>

        {/* Action bar */}
        <div className={cn("flex items-center gap-0.5", isUser ? "flex-row-reverse" : "flex-row")}>
          <button
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-[4px] text-[11.5px] font-medium transition-colors border cursor-pointer",
              copied
                ? "text-slate-900 bg-slate-100 border-black/15"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent hover:border-black/10"
            )}
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy text"}
            aria-label="Copy text"
          >
            {copied ? (
              <>
                <FiCheck className="w-3 h-3 text-slate-900" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <FiCopy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>

          {!isUser && (
            <>
              <button
                className={cn(
                  "w-7 h-7 rounded-[4px] flex items-center justify-center transition-colors border cursor-pointer",
                  likeState === "liked"
                    ? "text-slate-900 bg-slate-100 border-black/15"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent hover:border-black/10"
                )}
                onClick={handleLike}
                title={likeState === "liked" ? "Liked" : "Like response"}
                aria-label="Like response"
              >
                <FiThumbsUp className="w-3 h-3" />
              </button>

              <button
                className={cn(
                  "w-7 h-7 rounded-[4px] flex items-center justify-center transition-colors border cursor-pointer",
                  likeState === "disliked"
                    ? "text-red-600 bg-red-50 border-red-200"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent hover:border-black/10"
                )}
                onClick={handleDislike}
                title={likeState === "disliked" ? "Disliked" : "Dislike response"}
                aria-label="Dislike response"
              >
                <FiThumbsDown className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Code block with Copy button ───────────────────────────── */
function CodeBlock({ codeString, language }: { codeString: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-md border border-black/10 overflow-hidden">
      {/* Code header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-black/10">
        <span className="font-mono text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          {language}
        </span>
        <button
          className="flex items-center gap-1.5 text-[11.5px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer border border-transparent hover:border-black/15 rounded-[4px] px-2 py-0.5 transition-colors"
          onClick={handleCopyCode}
        >
          {copied ? (
            <FiCheck className="w-3 h-3 text-slate-900" />
          ) : (
            <FiCopy className="w-3 h-3" />
          )}
          <span>{copied ? "Copied" : "Copy code"}</span>
        </button>
      </div>
      <SyntaxHighlighter
        style={oneLight}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "14px",
          fontSize: "13.5px",
          backgroundColor: "#ffffff",
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}

/* ── Streaming-safe Markdown renderer ─────────────────────── */
function closeDanglingFences(content: string): string {
  const fenceCount = (content.match(/```/g) || []).length;
  if (fenceCount % 2 !== 0) {
    return content + "\n```";
  }
  return content;
}

function StreamingMarkdown({ content }: { content: string }) {
  const safeContent = closeDanglingFences(content);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");
          const isBlock = codeString.includes("\n") || !!match;

          return isBlock ? (
            <CodeBlock codeString={codeString} language={match ? match[1] : "text"} />
          ) : (
            <code
              className="bg-slate-100 text-slate-800 border border-black/10 px-1.5 py-0.5 rounded-[4px] text-[12px] font-mono font-semibold"
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {safeContent}
    </ReactMarkdown>
  );
}
