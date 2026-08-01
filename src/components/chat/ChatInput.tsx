"use client";

import { useRef, useEffect, KeyboardEvent, useCallback, useState } from "react";
import {
  FiChevronDown,
  FiSend,
  FiCheck,
  FiZap,
  FiCpu,
  FiGlobe,
} from "react-icons/fi";
import { PiCirclesThreePlus } from "react-icons/pi";
import { TbUnlink } from "react-icons/tb";
import { RiGalleryLine } from "react-icons/ri";
import { LuAudioLines } from "react-icons/lu";
import { LiaMicrophoneSolid, LiaMicrophoneSlashSolid } from "react-icons/lia";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { cn } from "@/lib/utils";

type ButtonState = "idle" | "composing" | "streaming" | "stopped" | "error";

interface ModelItem {
  id: string;
  name: string;
  badge: string;
  description: string;
  icon: any;
}

interface AttachedFile {
  name: string;
  isImage: boolean;
}

const MODELS: ModelItem[] = [
  {
    id: "oxie-3.7-sonnet",
    name: "Oxie 3.7 Sonnet High",
    badge: "Default",
    description: "Fastest coding, debugging & general intelligence",
    icon: FiZap,
  },
  {
    id: "oxie-deepthink-r1",
    name: "Oxie DeepThink (R1)",
    badge: "Reasoning",
    description: "Deep chain-of-thought math & architecture planning",
    icon: FiCpu,
  },
  {
    id: "oxie-search-2026",
    name: "Oxie Live Search (2026)",
    badge: "Realtime",
    description: "Fetches live web news, documentation & 2026 data",
    icon: FiGlobe,
  },
];

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStop: () => void;
  hasError?: boolean;
}

export default function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
  onStop,
  hasError = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Model dropdown open state
  const [isModelOpen, setIsModelOpen] = useState(false);

  // Close model dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(e.target as Node)
      ) {
        setIsModelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // State for working Voice & Audio features & File attachments
  const [selectedModel, setSelectedModel] = useState<ModelItem>(MODELS[0]);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  // Compute button state
  const buttonState: ButtonState = (() => {
    if (hasError) return "error";
    if (isLoading) return "streaming";
    if (input.trim().length > 0) return "composing";
    return "idle";
  })();

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [input]);

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Listen for starter-prompt custom events from empty state
  useEffect(() => {
    const handler = (e: Event) => {
      const prompt = (e as CustomEvent<string>).detail;
      onInputChange(prompt);
      textareaRef.current?.focus();
    };
    window.addEventListener("starter-prompt", handler);
    return () => window.removeEventListener("starter-prompt", handler);
  }, [onInputChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!isLoading && input.trim()) {
          onSubmit(e as unknown as React.FormEvent);
        }
      }
    },
    [isLoading, input, onSubmit],
  );

  const handleButtonClick = useCallback(() => {
    if (buttonState === "streaming") {
      onStop();
    } else if (buttonState === "composing") {
      onSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  }, [buttonState, onStop, onSubmit]);

  // Working File Attachment Handler
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newItems: AttachedFile[] = files.map((f) => ({
        name: f.name,
        isImage: f.type.startsWith("image/"),
      }));
      setAttachedFiles((prev) => [...prev, ...newItems]);
    }
  };

  // Working Voice Input Toggle
  const handleVoiceToggle = () => {
    setIsRecordingVoice((prev) => !prev);
  };

  // Working Audio Toggle
  const handleAudioToggle = () => {
    setIsAudioEnabled((prev) => !prev);
  };

  const codeFiles = attachedFiles.filter((f) => !f.isImage);
  const imageFiles = attachedFiles.filter((f) => f.isImage);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-6">
      {/* Hidden file input for attachment upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
      />

      <form onSubmit={onSubmit} className="block w-full">
        {/* Main Input Box: border-black/10 normally, border-black/15 when focused */}
        <div className="w-full bg-white border border-black/10 focus-within:border-black/15 rounded-md p-4 flex flex-col gap-3 relative transition-colors">
          {/* Active Voice Recording Indicator */}
          {isRecordingVoice && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-[4px] text-xs font-semibold border border-red-200">
              <span className="animate-pulse">
                🔴 Listening to voice prompt…
              </span>
              <button
                type="button"
                onClick={() => setIsRecordingVoice(false)}
                className="ml-auto bg-transparent border-0 text-red-600 cursor-pointer font-bold text-xs hover:underline"
              >
                Stop
              </button>
            </div>
          )}

          <textarea
            ref={textareaRef}
            id="chat-input"
            className="w-full bg-transparent border-0 outline-none resize-none text-[15px] text-slate-800 placeholder-slate-400 min-h-12 max-h-50 leading-relaxed p-0"
            placeholder="Type / for skills or ask Oxie anything…"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Chat message input"
            aria-multiline="true"
            suppressHydrationWarning
          />

          <div className="flex items-center justify-between pt-1 gap-2 border-t border-black/10">
            {/* Left: Plus attachment button with PiCirclesThreePlus icon */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAttachmentClick}
                title="Add attachment or image"
                className="w-7 h-7 rounded-[4px] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-black/10 hover:border-black/15 cursor-pointer transition-colors shrink-0"
              >
                <PiCirclesThreePlus className="w-4 h-4 text-slate-700" />
              </button>

              {/* Code/Text files badge with TbUnlink icon */}
              {codeFiles.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-[11px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded-[4px] font-semibold border border-black/10">
                  <TbUnlink className="w-3.5 h-3.5 text-slate-700" />
                  <span>{codeFiles.length} file{codeFiles.length > 1 ? "s" : ""}</span>
                </span>
              )}

              {/* Image files badge with RiGalleryLine icon */}
              {imageFiles.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-[11px] bg-purple-50 text-purple-800 px-2 py-0.5 rounded-[4px] font-semibold border border-purple-200">
                  <RiGalleryLine className="w-3.5 h-3.5 text-purple-600" />
                  <span>{imageFiles.length} image{imageFiles.length > 1 ? "s" : ""}</span>
                </span>
              )}
            </div>

            {/* Right: Model Selector + Voice + Audio + Send Toolbar */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* ── Model Selector Dropdown ── */}
              <div className="relative" ref={modelDropdownRef}>
                {/* Selector Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsModelOpen((v) => !v)}
                  className={cn(
                    "flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-[4px] text-[12.5px] font-semibold cursor-pointer select-none transition-colors border",
                    isModelOpen
                      ? "bg-slate-50 text-slate-900 border-black/15"
                      : "bg-white text-slate-700 hover:bg-slate-50 border-black/10 hover:border-black/15"
                  )}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <selectedModel.icon className={cn("w-3.5 h-3.5 shrink-0", isModelOpen ? "text-slate-900" : "text-slate-500")} />
                    <span className="truncate max-w-35">{selectedModel.name}</span>
                  </div>
                  <FiChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200",
                      isModelOpen && "rotate-180 text-slate-900"
                    )}
                  />
                </button>

                {/* Dropdown Menu Popup Card */}
                {isModelOpen && (
                  <div className="absolute bottom-full right-0 mb-2 w-75 bg-white border border-black/15 rounded-md shadow-md p-1.5 z-50">
                    {/* Model Options */}
                    {MODELS.map((model) => {
                      const isSelected = selectedModel.id === model.id;
                      const isLocked = model.id !== "oxie-3.7-sonnet";
                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            if (!isLocked) {
                              setSelectedModel(model);
                              setIsModelOpen(false);
                            }
                          }}
                          className={cn(
                            "flex items-center justify-between w-full px-3 py-2 rounded-[4px] cursor-pointer transition-colors text-left border",
                            isSelected
                              ? "bg-slate-50 text-slate-900 font-semibold border-black/15"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:border-black/10"
                          )}
                        >
                          {/* Left: Name + Badge + Description */}
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={cn("font-bold text-[13px] leading-none", isSelected ? "text-slate-900" : "text-slate-800")}>
                                {model.name}
                              </span>
                              {model.badge !== "Default" && (
                                <span className="inline-flex items-center text-[9.5px] font-bold px-1.5 py-0.5 rounded-[4px] bg-slate-800 text-white leading-none">
                                  {model.badge}
                                </span>
                              )}
                            </div>
                            <span className={cn("text-[11.5px] mt-0.5 leading-snug font-normal", isSelected ? "text-slate-600" : "text-slate-500")}>
                              {model.description}
                            </span>
                          </div>

                          {/* Right: Upgrade Button or Checkmark */}
                          <div className="shrink-0 ml-3">
                            {isLocked ? (
                              <span className="inline-flex items-center text-[11px] font-semibold text-slate-700 border border-black/10 rounded-[4px] px-2.5 py-0.5 bg-slate-50 hover:bg-slate-100 hover:border-black/15 transition-colors">
                                Upgrade
                              </span>
                            ) : isSelected ? (
                              <FiCheck className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                            ) : null}
                          </div>
                        </button>
                      );
                    })}

                    {/* Separator */}
                    <div className="my-1 h-px bg-black/10 mx-1" />

                    {/* Effort option */}
                    <button
                      type="button"
                      className="flex items-center justify-between w-full px-3 py-2 rounded-[4px] text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors border border-transparent hover:border-black/10 text-left"
                    >
                      <span className="font-bold text-[13px]">Effort</span>
                      <div className="flex items-center gap-1 text-slate-500 text-[12px]">
                        <span>High</span>
                        <FiChevronDown className="w-3.5 h-3.5 text-slate-400 -rotate-90" />
                      </div>
                    </button>

                    {/* More models option */}
                    <button
                      type="button"
                      className="flex items-center justify-between w-full px-3 py-2 rounded-[4px] text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors border border-transparent hover:border-black/10 text-left"
                    >
                      <span className="font-bold text-[13px]">More models</span>
                      <FiChevronDown className="w-3.5 h-3.5 text-slate-400 -rotate-90" />
                    </button>
                  </div>
                )}
              </div>

              {/* Voice Mic Button — 3-state: idle → recording → slash */}
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={cn(
                  "w-9 h-9 rounded-[4px] flex items-center justify-center border cursor-pointer transition-colors shrink-0",
                  isRecordingVoice
                    ? "text-red-600 bg-red-50 border-red-200 hover:bg-red-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-black/10 hover:border-black/15"
                )}
                title={isRecordingVoice ? "Stop recording" : "Voice input"}
              >
                {isRecordingVoice ? (
                  <LiaMicrophoneSlashSolid className="w-5 h-5" />
                ) : (
                  <LiaMicrophoneSolid className="w-5 h-5" />
                )}
              </button>

              {/* Audio Lines Toggle Button */}
              <button
                type="button"
                onClick={handleAudioToggle}
                className={cn(
                  "w-9 h-9 rounded-[4px] flex items-center justify-center border cursor-pointer transition-colors shrink-0",
                  isAudioEnabled
                    ? "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-black/10 hover:border-black/15"
                    : "text-slate-400 bg-slate-50 border-black/10 opacity-50"
                )}
                title={isAudioEnabled ? "Audio enabled" : "Audio muted"}
              >
                <LuAudioLines className="w-5 h-5" />
              </button>

              {/* Send / Stop Button */}
              {buttonState === "streaming" ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="w-9 h-9 rounded-[4px] flex items-center justify-center bg-red-600 hover:bg-red-700 border border-red-700 cursor-pointer transition-colors shrink-0 overflow-hidden"
                  title="Stop generation"
                >
                  <DotLottieReact
                    src="/animations/loading.lottie"
                    loop
                    autoplay
                    style={{ width: 28, height: 28, filter: "brightness(0) invert(1)" }}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleButtonClick}
                  disabled={buttonState === "idle"}
                  className={cn(
                    "w-9 h-9 rounded-[4px] flex items-center justify-center border transition-colors shrink-0",
                    buttonState === "composing"
                      ? "bg-slate-900 text-white hover:bg-slate-800 border-black/15 cursor-pointer"
                      : "bg-slate-100 text-slate-400 border-black/10 cursor-not-allowed"
                  )}
                  title="Send message"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
