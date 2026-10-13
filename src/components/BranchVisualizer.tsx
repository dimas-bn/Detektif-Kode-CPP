import React, { useState } from 'react';
import { Check, X, ArrowRight, GitFork } from 'lucide-react';

interface BranchRule {
  lineNum: number;
  conditionText: string;
  actionText: string;
  outputGrade: string;
  predicate: (score: number) => boolean;
}

interface BranchVisualizerProps {
  title?: string;
  rules: BranchRule[];
  defaultChips?: number[];
  allowCustomInput?: boolean;
  className?: string;
}

export const BranchVisualizer: React.FC<BranchVisualizerProps> = ({
  title = 'Visualizer Jalur Percabangan C++',
  rules,
  defaultChips = [95, 85, 80, 70, 69],
  allowCustomInput = true,
  className = ''
}) => {
  const [currentScore, setCurrentScore] = useState<number>(95);
  const [customVal, setCustomVal] = useState<string>('95');

  const handleSelectScore = (val: number) => {
    setCurrentScore(val);
    setCustomVal(val.toString());
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customVal, 10);
    if (!isNaN(parsed)) {
      setCurrentScore(parsed);
    }
  };

  // Evaluate execution flow
  // Conditions are checked top-to-bottom until the first one evaluates to true
  let chosenBranchIndex = -1;
  const evaluationResults = rules.map((r, idx) => {
    if (chosenBranchIndex !== -1) {
      // Skipped because earlier branch matched
      return { checked: false, passed: false, skipped: true };
    }

    const passed = r.predicate(currentScore);
    if (passed) {
      chosenBranchIndex = idx;
      return { checked: true, passed: true, skipped: false };
    }

    return { checked: true, passed: false, skipped: false };
  });

  const finalOutput = chosenBranchIndex !== -1 ? rules[chosenBranchIndex].outputGrade : '-';

  return (
    <div className={`glass-panel rounded-2xl p-4 sm:p-6 mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <GitFork className="w-5 h-5" />
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            {title}
          </h3>
        </div>
      </div>

      <p className="text-slate-300 text-sm mb-4">
        Pilih nilai uji atau masukkan nilai sendiri untuk melihat bagaimana komputer mengevaluasi setiap cabang if/else secara sekuensial.
      </p>

      {/* Preset Score Chips & Custom Input */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase mr-1">
          Pilih Nilai:
        </span>
        {defaultChips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleSelectScore(chip)}
            className={`px-3 py-1.5 rounded-xl font-mono text-sm transition-all border touch-target cursor-pointer ${
              currentScore === chip
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-black/40 text-slate-300 border-cyan-500/20 hover:text-white hover:border-cyan-500/40'
            }`}
          >
            nilai = {chip}
          </button>
        ))}

        {allowCustomInput && (
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-1.5 ml-auto">
            <input
              type="number"
              value={customVal}
              onChange={(e) => setCustomVal(e.target.value)}
              placeholder="Nilai..."
              className="w-20 bg-black/60 border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-mono text-white text-center focus:outline-none focus:border-cyan-400 touch-target"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-bold border border-cyan-500/30 touch-target cursor-pointer"
            >
              Uji
            </button>
          </form>
        )}
      </div>

      {/* Interactive Branching Visualization Stack */}
      <div className="space-y-2.5 mb-5 font-mono text-xs sm:text-sm">
        {rules.map((rule, idx) => {
          const evalRes = evaluationResults[idx];
          const isTriggered = evalRes.passed;
          const isFailed = evalRes.checked && !evalRes.passed;
          const isSkipped = evalRes.skipped;

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                isTriggered
                  ? 'bg-emerald-950/50 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-500/10'
                  : isFailed
                  ? 'bg-rose-950/30 border-rose-500/30 text-slate-400'
                  : 'bg-black/30 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-[11px] text-slate-400 font-bold shrink-0">
                  {rule.lineNum}
                </span>
                <div>
                  <span className={isTriggered ? 'text-white font-bold' : isFailed ? 'text-slate-300' : 'text-slate-500'}>
                    {rule.conditionText}
                  </span>
                  <span className="text-cyan-400 ml-2 font-semibold">
                    {rule.actionText}
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 font-sans">
                {isTriggered && (
                  <span className="flex items-center gap-1 text-emerald-300 bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-400 text-xs font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>BENAR &bull; Cabang Dijalankan!</span>
                  </span>
                )}

                {isFailed && (
                  <span className="flex items-center gap-1 text-rose-400 bg-rose-900/40 px-2 py-0.5 rounded text-xs">
                    <X className="w-3.5 h-3.5 text-rose-400" />
                    <span>Salah ({currentScore} tidak memenuhi)</span>
                  </span>
                )}

                {isSkipped && (
                  <span className="text-slate-500 text-xs italic">
                    (Dilewati, cabang sebelumnya sudah terpenuhi)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Output Banner */}
      <div className="p-3.5 rounded-xl bg-black/80 border border-cyan-500/30 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Output Layar Console (cout):
        </span>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-400 text-xs">Mencetak:</span>
          <span className="text-2xl font-black text-cyan-300 bg-cyan-950/70 px-3 py-0.5 rounded-lg border border-cyan-400/40">
            "{finalOutput}"
          </span>
        </div>
      </div>
    </div>
  );
};
