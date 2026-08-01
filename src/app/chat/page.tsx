"use client";

import { useState, useCallback, useEffect } from "react";
import { UIMessage } from "ai";
import Link from "next/link";
import { FiUser } from "react-icons/fi";
import { BiCrown } from "react-icons/bi";
import { PiUserCircleDuotone } from "react-icons/pi";
import Sidebar from "@/components/sidebar/Sidebar";
import SidebarMobile from "@/components/sidebar/SidebarMobile";
import ChatInterface from "@/components/chat/ChatInterface";
import { Conversation } from "@/components/sidebar/ConversationItem";

/**
 * /chat page
 * ----------
 * Assembles the full chat layout:
 *   Desktop:  [Sidebar 280px] [ChatInterface flex-1]
 *   Tablet:   [SidebarMobile 64px] [ChatInterface flex-1]
 *   Mobile:   [ChatInterface full-width]
 *
 * Conversation persistence: localStorage (stretch goal addressed).
 * Each conversation stores its messages so a refresh doesn't lose history.
 */

const STORAGE_KEY = "oxie-ai-conversations";
const ACTIVE_KEY = "oxie-ai-active-conversation";

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Hydrate Date objects
    return parsed.map((c: Conversation) => ({
      ...c,
      createdAt: new Date(c.createdAt),
    }));
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // Quota exceeded or private mode — fail silently
  }
}

function generateTitle(messages: UIMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "New conversation";
  // v7: extract text from parts
  const content = firstUser.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
    .trim();
  return content.length > 45 ? content.slice(0, 45) + "\u2026" : content || "New conversation";
}

function createNewConversation(): Conversation {
  return {
    id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: "New conversation",
    messages: [],
    createdAt: new Date(),
  };
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [chatKey, setChatKey] = useState(0); // Forces ChatInterface remount on new chat

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadConversations();
    if (saved.length > 0) {
      setConversations(saved);
      const savedActive = localStorage.getItem(ACTIVE_KEY);
      const validActive = saved.find((c) => c.id === savedActive);
      setActiveId(validActive ? validActive.id : saved[0].id);
    } else {
      // First visit: create a default conversation
      const first = createNewConversation();
      setConversations([first]);
      setActiveId(first.id);
    }
  }, []);

  // Persist whenever conversations change
  useEffect(() => {
    if (conversations.length > 0) {
      saveConversations(conversations);
    }
    if (activeId) {
      localStorage.setItem(ACTIVE_KEY, activeId);
    }
  }, [conversations, activeId]);

  const activeConversation = conversations.find((c) => c.id === activeId);

  // ── Handlers ────────────────────────────────────────────────

  const handleNewChat = useCallback(() => {
    const newConv = createNewConversation();
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
    setChatKey((k) => k + 1); // Remount ChatInterface with empty messages
  }, []);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveId(id);
    setChatKey((k) => k + 1); // Remount ChatInterface with saved messages
  }, []);

  const handleDeleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (activeId === id) {
          setActiveId(next[0]?.id ?? null);
          setChatKey((k) => k + 1);
        }
        return next;
      });
    },
    [activeId]
  );

  const handleRenameConversation = useCallback((id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  }, []);

  const handleTogglePin = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  }, []);

  const handleClearAll = useCallback(() => {
    if (!confirm("Clear all conversations? This cannot be undone.")) return;
    const newConv = createNewConversation();
    setConversations([newConv]);
    setActiveId(newConv.id);
    setChatKey((k) => k + 1);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_KEY);
  }, []);

  // Called by ChatInterface after each streamed message
  const handleConversationUpdate = useCallback(
    (messages: UIMessage[]) => {
      if (!activeId) return;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages, title: generateTitle(messages) }
            : c
        )
      );
    },
    [activeId]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fb]">
      {/* Desktop sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onClearAll={handleClearAll}
        onTogglePin={handleTogglePin}
      />

      {/* Chat area */}
      <main className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Top Bar Navigation Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100/80 bg-white/50 backdrop-blur-xs">
          <div className="flex-1" />

          {/* Center Plan Pill with BiCrown */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-[4px] text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer transition-colors border border-black/10 hover:border-black/15">
            <BiCrown className="w-3.5 h-3.5 text-purple-600" />
            <span>Free plan</span>
            <span className="text-purple-600 font-bold">· Upgrade</span>
          </div>

          {/* Right Account Link Button with PiUserCircleDuotone */}
          <div className="flex-1 flex justify-end">
            <Link
              href="/login"
              title="New User - Log in"
              className="w-8 h-8 rounded-full bg-white hover:bg-slate-50 border border-black/10 hover:border-black/15 flex items-center justify-center text-slate-800 transition-colors cursor-pointer outline-none no-underline"
            >
              <PiUserCircleDuotone className="w-7 h-7" />
            </Link>
          </div>
        </div>

        <ChatInterface
          key={chatKey} // Remounts to reset useChat state
          initialMessages={activeConversation?.messages ?? []}
          onConversationUpdate={handleConversationUpdate}
        />
      </main>
    </div>
  );
}
