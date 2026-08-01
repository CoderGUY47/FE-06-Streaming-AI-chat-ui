"use client";

import { useState, useCallback } from "react";
import { FiBookmark, FiEdit3 } from "react-icons/fi";
import { RiMessageAi3Line } from "react-icons/ri";
import { CgTrashEmpty } from "react-icons/cg";
import { UIMessage } from "ai";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  id: string;
  title: string;
  isActive: boolean;
  isPinned?: boolean;
  isCollapsed?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onTogglePin?: (id: string) => void;
}

export default function ConversationItem({
  id,
  title,
  isActive,
  isPinned = false,
  isCollapsed = false,
  onSelect,
  onDelete,
  onRename,
  onTogglePin,
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [isHovered, setIsHovered] = useState(false);

  const handleRenameSubmit = useCallback(() => {
    if (editValue.trim()) {
      onRename(id, editValue.trim());
    } else {
      setEditValue(title);
    }
    setIsEditing(false);
  }, [editValue, id, onRename, title]);

  // Icon-only compact mode when sidebar is collapsed
  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={() => onSelect(id)}
        title={title}
        className={cn(
          "w-9 h-9 rounded-[4px] flex items-center justify-center transition-colors cursor-pointer border outline-none shrink-0",
          isActive
            ? "bg-slate-100 text-slate-900 border-black/15 font-semibold"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent hover:border-black/10"
        )}
      >
        {isPinned ? (
          <FiBookmark className="w-4 h-4 text-slate-900 fill-slate-900/20" />
        ) : (
          <RiMessageAi3Line className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <div
      onClick={() => !isEditing && onSelect(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group flex items-center justify-between gap-2 w-full px-2.5 py-1.5 rounded-[4px] text-[13px] transition-colors cursor-pointer select-none border",
        isActive
          ? "bg-slate-100 text-slate-900 font-semibold border-black/15"
          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:border-black/10 font-medium"
      )}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="flex items-center shrink-0">
          {isPinned ? (
            <FiBookmark className="w-3.5 h-3.5 text-slate-900 fill-slate-900/20" />
          ) : (
            <RiMessageAi3Line className={cn("w-3.5 h-3.5", isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600")} />
          )}
        </span>

        {isEditing ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameSubmit();
              if (e.key === "Escape") {
                setEditValue(title);
                setIsEditing(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-transparent border-0 border-b border-black/15 outline-none text-[13px] text-slate-900 p-0 font-medium"
          />
        ) : (
          <span className="truncate flex-1">
            {title}
          </span>
        )}
      </div>

      {/* Action buttons on hover/pin */}
      {(isHovered || isPinned) && !isEditing && (
        <div className="flex items-center gap-0.5 shrink-0 opacity-90">
          {onTogglePin && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(id);
              }}
              title={isPinned ? "Unpin" : "Pin to top"}
              className={cn(
                "p-1 rounded-[4px] text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent hover:border-black/10 bg-transparent cursor-pointer transition-colors outline-none",
                isPinned && "text-slate-900"
              )}
            >
              <FiBookmark className="w-3 h-3" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            title="Rename"
            className="p-1 rounded-[4px] text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent hover:border-black/10 bg-transparent cursor-pointer transition-colors outline-none"
          >
            <FiEdit3 className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            title="Delete"
            className="p-1 rounded-[4px] text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 bg-transparent cursor-pointer transition-colors outline-none"
          >
            <CgTrashEmpty className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active state indicator dot */}
      {isActive && !isHovered && (
        <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
      )}
    </div>
  );
}

export interface Conversation {
  id: string;
  title: string;
  messages: UIMessage[];
  createdAt: Date;
  pinned?: boolean;
}
