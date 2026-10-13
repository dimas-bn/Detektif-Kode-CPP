import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Plus, Minus, CheckCircle, XCircle, RotateCcw, HelpCircle, GripVertical } from 'lucide-react';
import { LineOrderData } from '../types';
import { storage } from '../utils/storage';

interface LineOrderProps {
  missionId: number;
  caseId: string;
  data: LineOrderData;
  onCompleted?: () => void;
}

export const LineOrder: React.FC<LineOrderProps> = ({
  missionId,
  caseId,
  data,
  onCompleted
}) => {
  const storageKey = `lineorder:${missionId}:${caseId}`;

  // activeSequence: array of item IDs currently in the main assembly
  // availableItems: array of item IDs in the pool/distractor tray
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [poolIds, setPoolIds] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showAnswer, setShowAnswer] = useState(false);

  // Initialize order
  useEffect(() => {
    const saved = storage.get<{
      activeIds: string[];
      poolIds: string[];
      status: 'idle' | 'correct' | 'wrong';
    } | null>(storageKey, null);

    if (saved && saved.activeIds && saved.activeIds.length > 0) {
      setActiveIds(saved.activeIds);
      setPoolIds(saved.poolIds || []);
      setStatus(saved.status || 'idle');
    } else {
      // Default: If any items have distractors or if needed, put all items in pool or active
      // For user friendliness: If items have distractors, put all items in available pool first
      const hasDistractors = data.items.some((i) => i.isDistractor);
      if (hasDistractors) {
        // Shuffle or present all in pool
        setPoolIds(data.items.map((i) => i.id));
        setActiveIds([]);
      } else {
        // Shuffle initial active order
        const shuffled = [...data.items].sort(() => Math.random() - 0.5).map((i) => i.id);
        setActiveIds(shuffled);
        setPoolIds([]);
      }
    }
  }, [storageKey, data]);

  const saveState = (newActive: string[], newPool: string[], newStatus: 'idle' | 'correct' | 'wrong') => {
    storage.set(storageKey, {
      activeIds: newActive,
      poolIds: newPool,
      status: newStatus
    });
  };

  const getItem = (id: string) => data.items.find((i) => i.id === id);

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...activeIds];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setActiveIds(next);
    setStatus('idle');
    saveState(next, poolIds, 'idle');
  };

  const moveDown = (index: number) => {
    if (index >= activeIds.length - 1) return;
    const next = [...activeIds];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setActiveIds(next);
    setStatus('idle');
    saveState(next, poolIds, 'idle');
  };

  const moveToActive = (id: string) => {
    const nextPool = poolIds.filter((item) => item !== id);
    const nextActive = [...activeIds, id];
    setActiveIds(nextActive);
    setPoolIds(nextPool);
    setStatus('idle');
    saveState(nextActive, nextPool, 'idle');
  };

  const removeFromActive = (id: string) => {
    const nextActive = activeIds.filter((item) => item !== id);
    const nextPool = [...poolIds, id];
    setActiveIds(nextActive);
    setPoolIds(nextPool);
    setStatus('idle');
    saveState(nextActive, nextPool, 'idle');
  };

  const handleReset = () => {
    const hasDistractors = data.items.some((i) => i.isDistractor);
    if (hasDistractors) {
      setPoolIds(data.items.map((i) => i.id));
      setActiveIds([]);
      saveState([], data.items.map((i) => i.id), 'idle');
    } else {
      const shuffled = [...data.items].sort(() => Math.random() - 0.5).map((i) => i.id);
      setActiveIds(shuffled);
      setPoolIds([]);
      saveState(shuffled, [], 'idle');
    }
    setStatus('idle');
    setShowAnswer(false);
  };

  const handleCheck = () => {
    // Check if activeIds match any of the validSequences
    const isCorrect = data.validSequences.some((validSeq) => {
      if (validSeq.length !== activeIds.length) return false;
      return validSeq.every((id, idx) => id === activeIds[idx]);
    });

    const newStatus = isCorrect ? 'correct' : 'wrong';
    setStatus(newStatus);
    saveState(activeIds, poolIds, newStatus);

    if (isCorrect) {
      storage.markCaseCompleted(missionId, caseId);
      onCompleted?.();
    }
  };

  const handleShowAnswer = () => {
    const preferredSeq = data.validSequences[0];
    const remainingPool = data.items
      .map((i) => i.id)
      .filter((id) => !preferredSeq.includes(id));

    setActiveIds(preferredSeq);
    setPoolIds(remainingPool);
    setStatus('correct');
    setShowAnswer(true);
    saveState(preferredSeq, remainingPool, 'correct');
    storage.markCaseCompleted(missionId, caseId);
    onCompleted?.();
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
            Susun Baris Kode
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            {data.title}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto touch-target cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Acak Ulang</span>
        </button>
      </div>

      <p className="text-slate-200 text-sm sm:text-base mb-4 font-normal">
        {data.instructions}
      </p>

      {/* Assembly Area */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
          <span className="font-bold uppercase tracking-wider">
            Urutan Program C++ (Siswa Menyusun):
          </span>
          <span>{activeIds.length} baris terpasang</span>
        </div>

        <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-2 sm:p-3 min-h-[140px] flex flex-col gap-2">
          {activeIds.length === 0 ? (
            <div className="text-slate-500 text-sm italic py-8 text-center flex-1 flex items-center justify-center">
              Pilih baris kode dari kotak persediaan di bawah untuk menyusun di sini.
            </div>
          ) : (
            activeIds.map((id, index) => {
              const item = getItem(id);
              if (!item) return null;

              return (
                <div
                  key={id}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#0a1428] border border-cyan-500/20 text-slate-100 font-mono text-xs sm:text-sm shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2.5 flex-1 overflow-x-auto">
                    <span className="w-6 h-6 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-slate-200 whitespace-pre">{item.text}</span>
                  </div>

                  {/* Buttons for touch friendly mobile ordering */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white touch-target cursor-pointer"
                      title="Geser ke atas"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === activeIds.length - 1}
                      className="p-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white touch-target cursor-pointer"
                      title="Geser ke bawah"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    {poolIds.length > 0 || data.items.some((i) => i.isDistractor) ? (
                      <button
                        type="button"
                        onClick={() => removeFromActive(id)}
                        className="p-2 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 touch-target cursor-pointer"
                        title="Keluarkan dari susunan"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Available Pool / Distractor Tray */}
      {poolIds.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-mono text-purple-300 font-bold uppercase tracking-wider mb-2">
            Persediaan Baris Kode / Baris Cadangan:
          </div>
          <div className="grid grid-cols-1 gap-2 bg-purple-950/20 border border-purple-500/20 rounded-xl p-2.5">
            {poolIds.map((id) => {
              const item = getItem(id);
              if (!item) return null;
              return (
                <div
                  key={id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/40 border border-purple-500/30 text-slate-200 font-mono text-xs sm:text-sm"
                >
                  <span className="overflow-x-auto whitespace-pre">{item.text}</span>
                  <button
                    type="button"
                    onClick={() => moveToActive(id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shrink-0 touch-target cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Pakai</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-cyan-500/15">
        <button
          type="button"
          onClick={handleCheck}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm sm:text-base shadow-md shadow-cyan-500/20 flex items-center gap-2 touch-target cursor-pointer"
        >
          <span>Periksa Urutan</span>
        </button>

        <button
          type="button"
          onClick={handleShowAnswer}
          className="px-4 py-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 text-xs sm:text-sm font-semibold flex items-center gap-1.5 touch-target cursor-pointer"
        >
          <span>Lihat Kunci Jawaban</span>
        </button>

        {status === 'correct' && (
          <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-bold">
            <CheckCircle className="w-5 h-5" />
            <span>Urutan tepat! Program dapat dikompilasi dengan benar.</span>
          </div>
        )}

        {status === 'wrong' && (
          <div className="flex items-center gap-1.5 text-rose-400 text-sm font-bold">
            <XCircle className="w-5 h-5" />
            <span>Belum tepat. Coba periksa urutan baris atau singkirkan baris yang tidak perlu.</span>
          </div>
        )}
      </div>

      {/* Explanation when checked or revealed */}
      {(status === 'correct' || showAnswer) && (
        <div className="mt-4 p-4 rounded-xl bg-blue-950/40 border-l-4 border-cyan-400 text-slate-200 text-sm leading-relaxed">
          <div className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Analisis Logika:</span>
          </div>
          <p>{data.explanation}</p>
        </div>
      )}
    </div>
  );
};
