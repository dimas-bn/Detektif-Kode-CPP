import React, { useState, useEffect, useRef } from 'react';
import { PenLine, Check, Lightbulb, ChevronDown } from 'lucide-react';
import { storage } from '../utils/storage';

interface ReflectionNoteProps {
  missionId: number;
  caseId: string;
  title?: string;
  prompt: string;
  hint?: string | React.ReactNode;
  hintButtonLabel?: string;
  placeholder?: string;
  onCompleted?: () => void;
}

export const ReflectionNote: React.FC<ReflectionNoteProps> = ({
  missionId,
  caseId,
  title = 'Refleksi Detektif',
  prompt,
  hint,
  hintButtonLabel = 'Buka Petunjuk',
  placeholder = 'Tuliskan pemikiran dan analisismu di sini...',
  onCompleted
}) => {
  const storageKey = `reflection:${missionId}:${caseId}`;

  const [text, setText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = storage.get<{
      noteText: string;
    } | null>(storageKey, null);

    if (saved && saved.noteText) {
      setText(saved.noteText);
      setIsSaved(true);
    }
  }, [storageKey]);

  const handleChange = (newVal: string) => {
    setText(newVal);
    setIsSaved(false);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      storage.saveReflection(missionId, caseId, prompt, newVal);
      setIsSaved(true);
      if (newVal.trim().length > 5) {
        storage.markCaseCompleted(missionId, caseId);
        onCompleted?.();
      }
    }, 600);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <PenLine className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
          {isSaved ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Tersimpan
            </span>
          ) : text.trim() ? (
            <span className="text-amber-400">Menyimpan...</span>
          ) : null}
        </div>
      </div>

      <p className="text-slate-100 text-base sm:text-lg mb-3 font-medium leading-relaxed">
        {prompt}
      </p>

      {/* Text Area */}
      <div className="relative mb-3">
        <textarea
          rows={3}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black/60 border border-purple-500/30 rounded-xl p-3.5 text-slate-100 placeholder:text-slate-500 font-sans text-base focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all touch-target resize-y"
        />
      </div>

      {/* Hint toggle button if provided */}
      {hint && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 hover:text-purple-100 border border-purple-500/25 text-xs sm:text-sm font-semibold transition-colors touch-target cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{hintButtonLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHint ? 'rotate-180' : ''}`} />
          </button>

          {showHint && (
            <div className="mt-2.5 p-3.5 rounded-xl bg-slate-900/90 border border-purple-500/30 text-slate-200 text-sm leading-relaxed animate-fadeIn">
              {hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
