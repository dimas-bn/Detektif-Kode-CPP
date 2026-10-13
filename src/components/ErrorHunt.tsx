import React, { useState, useEffect } from 'react';
import { Bug, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { ErrorHuntData } from '../types';
import { CodeViewer } from './CodeViewer';
import { highlightCppLine } from '../utils/cppTokenizer';
import { storage } from '../utils/storage';

interface ErrorHuntProps {
  missionId: number;
  caseId: string;
  data: ErrorHuntData;
  onCompleted?: () => void;
}

export const ErrorHunt: React.FC<ErrorHuntProps> = ({
  missionId,
  caseId,
  data,
  onCompleted
}) => {
  const storageKey = `errorhunt:${missionId}:${caseId}`;

  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong-line' | 'wrong-option'>('idle');
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    const saved = storage.get<{
      selectedLine: number | null;
      selectedOptionId: string | null;
      status: 'idle' | 'correct' | 'wrong-line' | 'wrong-option';
      showSolution: boolean;
    } | null>(storageKey, null);

    if (saved) {
      setSelectedLine(saved.selectedLine);
      setSelectedOptionId(saved.selectedOptionId);
      setStatus(saved.status || 'idle');
      setShowSolution(saved.showSolution || false);
    }
  }, [storageKey]);

  const saveState = (
    line: number | null,
    opt: string | null,
    st: 'idle' | 'correct' | 'wrong-line' | 'wrong-option',
    sol: boolean
  ) => {
    storage.set(storageKey, {
      selectedLine: line,
      selectedOptionId: opt,
      status: st,
      showSolution: sol
    });
  };

  const lines = data.code.trimEnd().split('\n');

  const handleLineClick = (lineNum: number) => {
    setSelectedLine(lineNum);
    setStatus('idle');
    saveState(lineNum, selectedOptionId, 'idle', showSolution);
  };

  const handleOptionClick = (optId: string) => {
    setSelectedOptionId(optId);
    setStatus('idle');
    saveState(selectedLine, optId, 'idle', showSolution);
  };

  const handleCheck = () => {
    if (selectedLine === null) {
      alert('Pilih baris yang mengandung bug/error terlebih dahulu.');
      return;
    }
    if (selectedOptionId === null) {
      alert('Pilih jenis kesalahan yang terjadi.');
      return;
    }

    if (selectedLine !== data.correctErrorLine) {
      setStatus('wrong-line');
      saveState(selectedLine, selectedOptionId, 'wrong-line', showSolution);
      return;
    }

    if (selectedOptionId !== data.correctOptionId) {
      setStatus('wrong-option');
      saveState(selectedLine, selectedOptionId, 'wrong-option', showSolution);
      return;
    }

    setStatus('correct');
    setShowSolution(true);
    saveState(selectedLine, selectedOptionId, 'correct', true);
    storage.markCaseCompleted(missionId, caseId);
    onCompleted?.();
  };

  const handleRevealSolution = () => {
    setSelectedLine(data.correctErrorLine);
    setSelectedOptionId(data.correctOptionId);
    setStatus('correct');
    setShowSolution(true);
    saveState(data.correctErrorLine, data.correctOptionId, 'correct', true);
    storage.markCaseCompleted(missionId, caseId);
    onCompleted?.();
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
          <Bug className="w-4 h-4" />
        </span>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
          Berburu Bug (Error Hunt)
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide ml-1">
          {data.title}
        </h3>
      </div>

      <p className="text-slate-300 text-sm sm:text-base mb-4">
        Klik baris yang menurutmu bermasalah, lalu pilih diagnosa kesalahan yang tepat.
      </p>

      {/* Interactive Code Viewer with clickable lines */}
      <div className="rounded-xl border border-cyan-500/30 bg-[#070e20] overflow-hidden mb-5">
        <div className="px-4 py-2 bg-black/50 border-b border-cyan-500/20 text-xs font-mono text-cyan-400 flex items-center justify-between">
          <span>KLIK SATU BARIS KODE YANG BERMASALAH</span>
          {selectedLine !== null && (
            <span className="text-amber-400 font-bold">
              Baris {selectedLine} dipilih
            </span>
          )}
        </div>

        <div className="p-3 text-sm font-mono overflow-x-auto">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isSelected = selectedLine === lineNum;
            const isCorrectErrorLine = showSolution && lineNum === data.correctErrorLine;
            const tokens = highlightCppLine(line);

            return (
              <div
                key={lineNum}
                onClick={() => handleLineClick(lineNum)}
                className={`flex items-start rounded px-2 py-1.5 cursor-pointer transition-all touch-target select-none ${
                  isSelected
                    ? 'bg-rose-500/25 border-l-4 border-rose-400 text-white font-medium shadow-sm'
                    : isCorrectErrorLine
                    ? 'bg-amber-500/20 border-l-4 border-amber-400'
                    : 'hover:bg-cyan-500/10'
                }`}
              >
                <span className="w-8 shrink-0 text-right pr-3 text-slate-500 text-xs font-mono select-none">
                  {lineNum}
                </span>
                <span className="flex-1 whitespace-pre">
                  {tokens.map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className={
                        t.type === 'keyword'
                          ? 'text-[#b026ff]'
                          : t.type === 'type'
                          ? 'text-cyan-400'
                          : t.type === 'string'
                          ? 'text-emerald-300'
                          : t.type === 'number'
                          ? 'text-amber-300'
                          : 'text-slate-200'
                      }
                    >
                      {t.text}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Diagnosa Options */}
      <div className="mb-5">
        <span className="block text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 mb-2">
          Pilih Diagnosa Kesalahan:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {data.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleOptionClick(opt.id)}
              className={`p-3 rounded-xl text-left text-sm transition-all border flex items-center justify-between touch-target cursor-pointer ${
                selectedOptionId === opt.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                  : 'bg-black/40 border-cyan-500/20 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{opt.label}</span>
              <span className={`w-3.5 h-3.5 rounded-full border ${selectedOptionId === opt.id ? 'bg-cyan-400 border-cyan-300' : 'border-slate-500'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCheck}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm sm:text-base shadow-md shadow-cyan-500/20 touch-target cursor-pointer"
        >
          Periksa Temuan
        </button>

        <button
          type="button"
          onClick={handleRevealSolution}
          className="px-4 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 text-xs sm:text-sm touch-target cursor-pointer"
        >
          Buka Solusi
        </button>

        {status === 'wrong-line' && (
          <div className="flex items-center gap-1.5 text-rose-400 text-sm font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Belum tepat. Coba periksa baris yang lain.</span>
          </div>
        )}

        {status === 'wrong-option' && (
          <div className="flex items-center gap-1.5 text-amber-400 text-sm font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Baris yang dipilih sudah benar ({selectedLine}), namun diagnosanya belum pas.</span>
          </div>
        )}

        {status === 'correct' && (
          <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-bold">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Tepat sekali! Bug berhasil diidentifikasi.</span>
          </div>
        )}
      </div>

      {/* Explanation & Fixed Code */}
      {showSolution && (
        <div className="mt-5 pt-4 border-t border-cyan-500/20 space-y-4">
          <div className="p-4 rounded-xl bg-blue-950/40 border-l-4 border-cyan-400 text-slate-200 text-sm">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Penjelasan Detektif:</span>
            </div>
            <p className="leading-relaxed">{data.explanation}</p>
          </div>

          <div>
            <span className="block text-xs font-mono font-bold uppercase text-emerald-400 mb-1.5">
              Kode Yang Sudah Diperbaiki:
            </span>
            <CodeViewer code={data.fixedCode} title="KODE SOLUSI BERSIH" />
          </div>
        </div>
      )}
    </div>
  );
};
