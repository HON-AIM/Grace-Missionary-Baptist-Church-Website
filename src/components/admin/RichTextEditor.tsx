"use client";

import { useRef, useCallback } from "react";
import {
  HiOutlineBold,
  HiOutlineItalic,
  HiOutlineListBullet,
  HiOutlineLink,
} from "react-icons/hi2";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  minRows = 8,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const exec = useCallback((command: string, value?: string) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = ta.value;
    const selected = text.substring(start, end);

    let inserted = "";
    let cursorOffset = 0;

    switch (command) {
      case "bold":
        inserted = `**${selected || "bold text"}**`;
        cursorOffset = selected ? 2 : 2;
        break;
      case "italic":
        inserted = `_${selected || "italic text"}_`;
        cursorOffset = selected ? 1 : 1;
        break;
      case "bullet": {
        const lines = (selected || "list item").split("\n");
        inserted = lines.map((l) => `- ${l}`).join("\n");
        cursorOffset = 2;
        break;
      }
      case "link":
        inserted = `[${selected || "link text"}](url)`;
        cursorOffset = selected ? 2 : 2;
        break;
      default:
        return;
    }

    const newValue = text.substring(0, start) + inserted + text.substring(end);
    onChange(newValue);

    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + (selected ? inserted.length - cursorOffset : inserted.length);
      ta.setSelectionRange(pos, pos);
    });
  }, [onChange]);

  const insertTab = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget as HTMLTextAreaElement;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  }, [value, onChange]);

  return (
    <div className="bg-navy-900 border border-navy-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-gold-500/40 focus-within:border-gold-500/60 transition-all">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-navy-700/50 bg-navy-800/50">
        <button
          type="button"
          onClick={() => exec("bold")}
          className="p-1.5 rounded text-navy-400 hover:text-white hover:bg-navy-700 transition-all"
          title="Bold"
        >
          <HiOutlineBold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          className="p-1.5 rounded text-navy-400 hover:text-white hover:bg-navy-700 transition-all"
          title="Italic"
        >
          <HiOutlineItalic className="w-4 h-4" />
        </button>
        <span className="w-px h-5 bg-navy-700 mx-1" />
        <button
          type="button"
          onClick={() => exec("bullet")}
          className="p-1.5 rounded text-navy-400 hover:text-white hover:bg-navy-700 transition-all"
          title="Bullet list"
        >
          <HiOutlineListBullet className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("link")}
          className="p-1.5 rounded text-navy-400 hover:text-white hover:bg-navy-700 transition-all"
          title="Insert link"
        >
          <HiOutlineLink className="w-4 h-4" />
        </button>
        <span className="ml-auto text-navy-600 text-xs">
          Markdown supported
        </span>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={insertTab}
        placeholder={placeholder}
        rows={minRows}
        className="w-full px-4 py-3 bg-navy-900 text-white placeholder-navy-500 resize-y focus:outline-none font-mono text-sm leading-relaxed min-h-[120px]"
      />
    </div>
  );
}
