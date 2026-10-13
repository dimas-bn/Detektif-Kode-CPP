import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, Terminal, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StepTracerData } from '../types';
import { CodeViewer } from './CodeViewer';

interface StepTracerProps {
  data: StepTracerData;
  className?: string;
}

export const StepTracer: React.FC<StepTracerProps> = ({ data, className = '' }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const step = data.steps[currentStepIdx] || data.steps[0];
  const isFirst = currentStepIdx === 0;
  const isLast = currentStepIdx === data.steps.length - 1;

  const handleNext = () => {
    if (!isLast) setCurrentStepIdx((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentStepIdx((prev) => prev - 1);
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
  };

  // Extract variables for current step
  const variables = step.variables || {};
  const changedVars = step.changedVars || [];

  return (
    <div className={`glass-panel rounded-2xl p-4 sm:p-6 mb-6 ${className}`}>
      {/* Title & Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              Step Tracer Interaktif
            </span>
            <span className="text-xs font-mono text-slate-400">
              Langkah {currentStepIdx + 1} dari {data.steps.length}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            {data.title}
          </h3>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={isFirst}
            className="p-2 rounded-lg bg-black/40 hover:bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white border border-cyan-500/20 transition-all touch-target cursor-pointer"
            title="Ulang dari awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-black/40 hover:bg-slate-800 disabled:opacity-40 text-slate-200 border border-cyan-500/20 text-xs sm:text-sm font-semibold transition-all touch-target cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Mundur</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isLast}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all touch-target cursor-pointer"
          >
            <span>Langkah Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid: Code vs Memory Variables & Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Code Column */}
        <div className="lg:col-span-7">
          <CodeViewer
            code={data.code}
            title="KODE DIEKSEKUSI"
            highlightLines={[step.line]}
          />
          <div className="mt-3 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-start gap-2 text-sm text-cyan-200">
            <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Baris {step.line}:</strong> {step.explanation}
            </span>
          </div>
        </div>

        {/* Memory State Column */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Memory Boxes */}
          <div className="bg-black/50 border border-cyan-500/20 rounded-xl p-4 shadow-inner flex-1">
            <div className="flex items-center justify-between mb-3 border-b border-cyan-500/15 pb-2">
              <span className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider">
                Kotak Memori (Variabel RAM)
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {Object.keys(variables).length} variabel aktif
              </span>
            </div>

            {Object.keys(variables).length === 0 ? (
              <div className="text-slate-500 text-sm italic py-6 text-center">
                Belum ada variabel yang dideklarasikan pada langkah ini.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <AnimatePresence>
                  {Object.entries(variables).map(([name, val]) => {
                    const isChanged = changedVars.includes(name);

                    return (
                      <motion.div
                        key={name}
                        layout
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{
                          scale: isChanged ? [1, 1.08, 1] : 1,
                          opacity: 1
                        }}
                        transition={{ duration: 0.3 }}
                        className={`p-3 rounded-xl border transition-colors ${
                          isChanged
                            ? 'bg-cyan-500/20 border-cyan-300 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/20'
                            : 'bg-slate-900/80 border-slate-700/80'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                            var {name}
                          </span>
                          {isChanged && (
                            <span className="text-[10px] font-mono bg-cyan-400 text-slate-950 px-1 rounded font-bold uppercase animate-pulse">
                              BERUBAH
                            </span>
                          )}
                        </div>
                        <div className="text-2xl font-mono font-black text-white text-center py-1">
                          {val}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Terminal Output */}
          <div className="bg-black/80 border border-slate-800 rounded-xl p-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1.5 border-b border-slate-800 pb-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="uppercase text-[11px] tracking-wider text-slate-300 font-bold">
                Layar Terminal (cout)
              </span>
            </div>
            <div className="p-2 min-h-[44px] bg-[#030712] rounded border border-emerald-950/60 text-emerald-300 font-mono text-sm tracking-wide">
              {step.output ? (
                <span>{step.output}</span>
              ) : (
                <span className="text-slate-600 italic">(belum ada output)</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
