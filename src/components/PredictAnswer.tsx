import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react';
import { CodeViewer } from './CodeViewer';
import { OnlineCompilerButton } from './OnlineCompilerButton';
import { storage } from '../utils/storage';

interface PredictAnswerProps {
  missionId: number;
  caseId: string;
  title: string;
  question: string;
  code?: string;
  actualOutput: string;
  explanation: string;
  contextNote?: string;
  showCompilerButton?: boolean;
}

export const PredictAnswer: React.FC<PredictAnswerProps> = ({
  missionId,
  caseId,
  title,
  question,
  code,
  actualOutput,
  explanation,
  contextNote,
  showCompilerButton = true
}) => {
  const storageKey = `predict:${missionId}:${caseId}`;

  const [guess, setGuess] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [matchStatus, setMatchStatus] = useState<'same' | 'missed' | null>(null);

  // Restore state on mount
  useEffect(() => {
    const saved = storage.get<{
      guess: string;
      revealed: boolean;
      matchStatus: 'same' | 'missed' | null;
    } | null>(storageKey, null);

    if (saved) {
      setGuess(saved.guess || '');
      setRevealed(saved.revealed || false);
      setMatchStatus(saved.matchStatus || null);
    }
  }, [storageKey]);

  const handleReveal = () => {
    if (!guess.trim() && !revealed) {
      // Allow reveal even if empty, but good to have prompt
    }
    setRevealed(true);
    saveState(guess, true, matchStatus);
    storage.markCaseCompleted(missionId, caseId);
  };

  const handleMatchSelect = (status: 'same' | 'missed') => {
    setMatchStatus(status);
    saveState(guess, revealed, status);
    storage.savePrediction(missionId, caseId, title, guess, actualOutput, status);
    storage.markCaseCompleted(missionId, caseId);
  };

  const saveState = (currentGuess: string, isRevealed: boolean, status: 'same' | 'missed' | null) => {
    storage.set(storageKey, {
      guess: currentGuess,
      revealed: isRevealed,
      matchStatus: status
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-6 relative overflow-hidden transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
            Prediksi Kasus
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            {title}
          </h3>
        </div>
        {showCompilerButton && code && (
          <OnlineCompilerButton compact />
        )}
      </div>

      {/* Question / Instruction */}
      <p className="text-slate-200 text-base sm:text-lg mb-4 font-normal leading-relaxed">
        {question}
      </p>

      {/* Code Viewer if available */}
      {code && (
        <div className="mb-4">
          <CodeViewer code={code} title="KODE KASUS" />
        </div>
      )}

      {contextNote && (
        <div className="mb-4 text-sm text-cyan-300/90 bg-cyan-950/30 border border-cyan-500/20 rounded-lg p-3">
          {contextNote}
        </div>
      )}

      {/* Guess Input Section */}
      <div className="mt-4 pt-4 border-t border-cyan-500/15">
        <label className="block text-sm font-semibold text-cyan-300 mb-1.5">
          Tebakan Anda (Ketik apa output atau dampaknya):
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={guess}
            onChange={(e) => {
              setGuess(e.target.value);
              saveState(e.target.value, revealed, matchStatus);
            }}
            placeholder="Ketik tebakanmu di sini..."
            disabled={revealed && matchStatus !== null}
            className="flex-1 bg-black/50 border border-cyan-500/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder:text-slate-500 font-mono text-base focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all touch-target"
          />

          {!revealed ? (
            <button
              onClick={handleReveal}
              type="button"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-sans text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all touch-target cursor-pointer shrink-0"
            >
              <Eye className="w-5 h-5" />
              <span>Ungkap Hasil</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Revealed Section */}
      {revealed && (
        <div className="mt-6 pt-5 border-t border-cyan-500/20 animate-fadeIn">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-black/40 border border-slate-700/60 rounded-xl p-3.5">
              <span className="text-xs uppercase font-mono text-slate-400 block mb-1">
                Tebakan Kamu:
              </span>
              <div className="font-mono text-base sm:text-lg text-slate-200 break-words">
                {guess.trim() ? guess : <span className="text-slate-500 italic">(tidak diisi)</span>}
              </div>
            </div>

            <div className="bg-cyan-950/40 border border-cyan-500/40 rounded-xl p-3.5 shadow-inner">
              <span className="text-xs uppercase font-mono text-cyan-300 block mb-1 font-semibold">
                Hasil Sebenarnya:
              </span>
              <div className="font-mono text-base sm:text-lg text-cyan-100 font-bold break-words">
                {actualOutput}
              </div>
            </div>
          </div>

          {/* Self-assessment buttons */}
          <div className="bg-black/30 border border-cyan-500/15 rounded-xl p-3.5 mb-4">
            <p className="text-sm text-slate-300 mb-2.5 font-medium">
              Bagaimana perbandingan tebakanmu dengan hasil sebenarnya?
            </p>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => handleMatchSelect('same')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all touch-target cursor-pointer ${
                  matchStatus === 'same'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 border border-emerald-400'
                    : 'bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Tebakanku Sama</span>
              </button>

              <button
                type="button"
                onClick={() => handleMatchSelect('missed')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all touch-target cursor-pointer ${
                  matchStatus === 'missed'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30 border border-amber-400'
                    : 'bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-500/30'
                }`}
              >
                <XCircle className="w-4 h-4 text-amber-400" />
                <span>Tebakanku Meleset</span>
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-400 italic">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Tebakan yang meleset itu wajar. Justru di situ belajarnya.</span>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-gradient-to-r from-blue-950/40 to-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl">
            <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              Penjelasan Detektif
            </h4>
            <p className="text-slate-200 text-base leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
