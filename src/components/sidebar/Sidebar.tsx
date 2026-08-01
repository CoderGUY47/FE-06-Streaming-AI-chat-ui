"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  FiPlus, 
  FiSliders, 
  FiSearch, 
  FiDownload, 
  FiLogIn
} from "react-icons/fi";
import { LuTowerControl } from "react-icons/lu";
import { RiMessageAi3Line } from "react-icons/ri";
import { HiOutlineFolderOpen } from "react-icons/hi2";
import { PiCompassToolBold, PiCirclesThreePlus, PiUserCircleDuotone } from "react-icons/pi";
import { FaLaptopCode } from "react-icons/fa";
import { MdOutlineDraw, MdOutlineMarkChatUnread, MdOutlineMarkUnreadChatAlt } from "react-icons/md";
import { BiGhost, BiCrown } from "react-icons/bi";
import { GrCompare } from "react-icons/gr";
import { VscRepoPinned } from "react-icons/vsc";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import ConversationItem, { Conversation } from "./ConversationItem";
import { cn } from "@/lib/utils";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onClearAll: () => void;
  onTogglePin?: (id: string) => void;
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onClearAll,
  onTogglePin,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [activeNav, setActiveNav] = useState("chats");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) => c.title.toLowerCase().includes(q));
  }, [conversations, searchQuery]);

  // Group conversations into Starred (pinned) & Recents
  const { starred, recents } = useMemo(() => {
    const starred: Conversation[] = [];
    const recents: Conversation[] = [];

    filteredConversations.forEach((c) => {
      if (c.pinned) {
        starred.push(c);
      } else {
        recents.push(c);
      }
    });

    return { starred, recents };
  }, [filteredConversations]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={cn(
        "h-full bg-white border-r border-black/10 flex flex-col p-3 shrink-0 z-20 select-none font-sans transition-all duration-200",
        isCollapsed ? "w-16 items-center" : "w-67.5"
      )}
    >
      {/* ── Top Header: Title/Logo + Search + GrCompare Toggle Icons ── */}
      <div className={cn("flex items-center justify-between pb-3 px-1 w-full", isCollapsed && "flex-col gap-3 px-0")}>
        {!isCollapsed ? (
          <div className="flex items-center gap-2 font-extrabold text-lg tracking-tight text-slate-900">
            <Image src="/images/oxie.png" alt="Oxie AI Logo" width={40} height={40} className="w-9 h-9 object-contain" />
            <span>Oxie</span>
          </div>
        ) : (
          <Image src="/images/oxie.png" alt="Oxie AI Logo" width={40} height={40} className="w-9 h-9 object-contain my-1 shrink-0" />
        )}

        <div className={cn("flex items-center gap-1", isCollapsed && "flex-col gap-1.5")}>
          {!isCollapsed && (
            <button
              type="button"
              className="w-7 h-7 rounded-[4px] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors border border-black/10 hover:border-black/15 bg-white cursor-pointer outline-none"
              title="Search chats"
              onClick={() => setShowSearchInput((v) => !v)}
            >
              <FiSearch className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={toggleSidebar}
            className={cn(
              "w-7 h-7 rounded-[4px] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors border border-black/10 hover:border-black/15 bg-white cursor-pointer outline-none",
              isCollapsed && "w-9 h-9"
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <GrCompare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Optional Search Input Field (Only in expanded mode) */}
      {!isCollapsed && showSearchInput && (
        <div className="px-1 pb-2 w-full">
          <Input
            type="text"
            placeholder="Search chats…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-xs bg-slate-50 border-black/10 focus:border-black/15 rounded-[4px]"
          />
        </div>
      )}

      {/* ── Main Navigation List ── */}
      <div className={cn("flex flex-col gap-1 mb-4 w-full", isCollapsed && "items-center")}>
        {/* New Chat Primary Button */}
        <button
          type="button"
          onClick={onNewChat}
          title="New chat"
          className={cn(
            "bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-[4px] transition-colors cursor-pointer border border-black/15 outline-none mb-1 flex items-center justify-center shrink-0",
            isCollapsed
              ? "w-9 h-9 p-0"
              : "w-full h-9 px-3 text-[13.5px] gap-2.5"
          )}
        >
          <MdOutlineMarkChatUnread className="w-4.5 h-4.5" />
          {!isCollapsed && <span>New chat</span>}
        </button>

        {/* Navigation Items */}
        {[
          { id: "chats", label: "Chats", icon: MdOutlineMarkUnreadChatAlt },
          { id: "projects", label: "Projects", icon: HiOutlineFolderOpen },
          { id: "artifacts", label: "Artifacts", icon: PiCompassToolBold },
        ].map((nav) => {
          const Icon = nav.icon;
          const isActive = activeNav === nav.id;
          return (
            <button
              key={nav.id}
              type="button"
              onClick={() => setActiveNav(nav.id)}
              title={isCollapsed ? nav.label : undefined}
              className={cn(
                "rounded-[4px] text-[13.5px] font-medium flex items-center transition-colors cursor-pointer border appearance-none outline-none shrink-0",
                isCollapsed
                  ? "w-9 h-9 justify-center p-0"
                  : "w-full h-8.5 px-3 gap-2.5 text-left",
                isActive
                  ? "bg-slate-100 text-slate-900 font-semibold border-black/15"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:border-black/10"
              )}
            >
              <Icon className="w-4 h-4" />
              {!isCollapsed && <span>{nav.label}</span>}
            </button>
          );
        })}

        {/* Code Item */}
        <button
          type="button"
          onClick={() => setActiveNav("code")}
          title={isCollapsed ? "Code" : undefined}
          className={cn(
            "rounded-[4px] text-[13.5px] font-medium flex items-center transition-colors cursor-pointer border appearance-none outline-none shrink-0",
            isCollapsed
              ? "w-9 h-9 justify-center p-0"
              : "w-full h-8.5 px-3 justify-between",
            activeNav === "code"
              ? "bg-slate-100 text-slate-900 font-semibold border-black/15"
              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:border-black/10"
          )}
        >
          <div className="flex items-center gap-2.5">
            <FaLaptopCode className="w-4 h-4" />
            {!isCollapsed && <span>Code</span>}
          </div>
          {!isCollapsed && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] bg-slate-200 text-slate-800 border border-black/10 flex items-center gap-1">
              <BiCrown className="w-3 h-3 text-purple-600" />
              Upgrade
            </span>
          )}
        </button>

        {/* Customize Item */}
        <button
          type="button"
          onClick={() => setActiveNav("customize")}
          title={isCollapsed ? "Customize" : undefined}
          className={cn(
            "rounded-[4px] text-[13.5px] font-medium flex items-center transition-colors cursor-pointer border appearance-none outline-none shrink-0",
            isCollapsed
              ? "w-9 h-9 justify-center p-0"
              : "w-full h-8.5 px-3 gap-2.5 text-left",
            activeNav === "customize"
              ? "bg-slate-100 text-slate-900 font-semibold border-black/15"
              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:border-black/10"
          )}
        >
          <BiGhost className="w-4 h-4" />
          {!isCollapsed && <span>Customize</span>}
        </button>
      </div>

      {/* ── Products Section Header ── */}
      {!isCollapsed && (
        <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-full">
          Products
        </div>
      )}
      <div className={cn("flex flex-col gap-1 mb-3 w-full", isCollapsed && "items-center")}>
        <button
          type="button"
          title={isCollapsed ? "Design Studio" : undefined}
          className={cn(
            "rounded-[4px] text-[13.5px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center transition-colors border border-transparent hover:border-black/10 appearance-none outline-none shrink-0",
            isCollapsed
              ? "w-9 h-9 justify-center p-0"
              : "w-full h-8.5 px-3 gap-2.5 text-left"
          )}
        >
          <MdOutlineDraw className="w-4 h-4 text-purple-600" />
          {!isCollapsed && <span>Design Studio</span>}
        </button>
      </div>

      {/* ── Starred Section ── */}
      {!isCollapsed && (
        <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-full">
          <VscRepoPinned className="w-3.5 h-3.5 text-slate-500" />
          <span>Starred</span>
        </div>
      )}
      <div className={cn("flex flex-col gap-0.5 overflow-y-auto max-h-28 pr-1 mb-2 w-full", isCollapsed && "items-center pr-0")}>
        {starred.length === 0 ? (
          !isCollapsed && (
            <p className="text-[11px] text-slate-400 px-2 py-0.5 italic">
              No starred chats
            </p>
          )
        ) : (
          starred.map((c) => (
            <ConversationItem
              key={c.id}
              id={c.id}
              title={c.title}
              isActive={c.id === activeConversationId}
              isPinned={c.pinned}
              isCollapsed={isCollapsed}
              onSelect={onSelectConversation}
              onDelete={onDeleteConversation}
              onRename={onRenameConversation}
              onTogglePin={onTogglePin}
            />
          ))
        )}
      </div>

      {/* ── Recents Section Header & LuTowerControl Filter Icon ── */}
      {!isCollapsed && (
        <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-full">
          <span>Recents</span>
          {conversations.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              title="Clear all recents"
              className="text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer p-0.5 outline-none"
            >
              <LuTowerControl className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Recents Conversations List */}
      <div className={cn("flex-1 overflow-y-auto flex flex-col gap-0.5 pr-1 w-full", isCollapsed && "items-center pr-0")}>
        {recents.length === 0 ? (
          !isCollapsed && (
            <p className="text-[11px] text-slate-400 px-2 py-0.5 italic">
              No recent conversations
            </p>
          )
        ) : (
          recents.map((c) => (
            <ConversationItem
              key={c.id}
              id={c.id}
              title={c.title}
              isActive={c.id === activeConversationId}
              isPinned={c.pinned}
              isCollapsed={isCollapsed}
              onSelect={onSelectConversation}
              onDelete={onDeleteConversation}
              onRename={onRenameConversation}
              onTogglePin={onTogglePin}
            />
          ))
        )}
      </div>

      {/* ── Footer User Card with Login button & New User name ── */}
      <div className={cn("pt-2 border-t border-black/10 mt-auto w-full", isCollapsed && "flex justify-center")}>
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-[4px] border border-black/10 hover:border-black/15 bg-white transition-colors">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <PiUserCircleDuotone className="w-7.5 h-7.5 text-slate-800 shrink-0" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  New User
                </span>
                <span className="text-[11px] text-slate-400">
                  Free plan
                </span>
              </div>
            </div>

            {/* Login Link Button */}
            <Link
              href="/login"
              className="px-2.5 py-1 text-[11.5px] font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-[4px] border border-black/15 transition-colors no-underline flex items-center gap-1.5 shrink-0"
              title="Log in to your account"
            >
              <FiLogIn className="w-3 h-3" />
              <span>Log in</span>
            </Link>
          </div>
        ) : (
          <Link
            href="/login"
            title="New User - Log in"
            className="w-9 h-9 rounded-[4px] border border-black/10 hover:border-black/15 bg-white flex items-center justify-center cursor-pointer transition-colors no-underline text-slate-900"
          >
            <PiUserCircleDuotone className="w-6.5 h-6.5 text-slate-800" />
          </Link>
        )}
      </div>
    </aside>
  );
}
