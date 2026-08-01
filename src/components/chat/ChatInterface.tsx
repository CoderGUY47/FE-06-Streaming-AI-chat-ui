"use client";

import { useChat } from "@ai-sdk/react";
import { UIMessage, DefaultChatTransport } from "ai";
import { useCallback, useEffect, useState, useRef } from "react";
import { FiRefreshCw } from "react-icons/fi";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

interface ChatInterfaceProps {
  /** Initial messages to load (e.g. from a saved conversation) */
  initialMessages?: UIMessage[];
  /** Called when conversation messages update for persistence */
  onConversationUpdate?: (messages: UIMessage[]) => void;
}

export default function ChatInterface({
  initialMessages = [],
  onConversationUpdate,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const onConversationUpdateRef = useRef(onConversationUpdate);
  useEffect(() => {
    onConversationUpdateRef.current = onConversationUpdate;
  }, [onConversationUpdate]);

  const {
    messages,
    status,
    error,
    stop,
    sendMessage,
  } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    messages: initialMessages,
    onError: (err) => {
      if (err?.name === "AbortError" || err?.message?.includes("aborted")) return;
      console.error("[ChatInterface] Stream error:", err);
    },
    onFinish: ({ messages: finalMessages }) => {
      onConversationUpdateRef.current?.(finalMessages);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";
  const hasError = status === "error" && !!error;

  const handleStop = useCallback(() => {
    stop();
    setTimeout(() => {
      onConversationUpdateRef.current?.(messages);
    }, 50);
  }, [stop, messages]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const text = inputValue.trim();
      if (!text || isLoading) return;
      sendMessage({ text });
      setInputValue("");
    },
    [inputValue, isLoading, sendMessage]
  );

  const handleRegenerate = useCallback(() => {
    if (isLoading) return;
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    const text = lastUser.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
    if (text) sendMessage({ text });
  }, [messages, isLoading, sendMessage]);

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      {/* Message thread */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Regenerate button — shown after last assistant message completes */}
      {messages.length > 0 &&
        messages.at(-1)?.role === "assistant" &&
        !isLoading && (
          <div className="flex justify-center pb-1">
            <button
              id="regenerate-btn"
              onClick={handleRegenerate}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 bg-white transition-all outline-none cursor-pointer"
            >
              <FiRefreshCw className="w-3 h-3" />
              Regenerate response
            </button>
          </div>
        )}

      {/* Error banner */}
      {hasError && (
        <div
          className="mx-auto mb-2 max-w-3xl w-[calc(100%-48px)] bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg text-xs font-medium"
          role="alert"
        >
          ⚠️ {error?.message || "Something went wrong. Please try again."}
        </div>
      )}

      {/* Input */}
      <ChatInput
        input={inputValue}
        isLoading={isLoading}
        onInputChange={setInputValue}
        onSubmit={handleSubmit}
        onStop={handleStop}
        hasError={hasError}
      />
    </div>
  );
}
