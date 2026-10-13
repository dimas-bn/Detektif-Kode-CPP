import React, { useState, useEffect } from 'react';
import { Bug, CheckCircle, XCircle, AlertCircle, HelpCircle, Terminal } from 'lucide-react';
import { CodeViewer } from './CodeViewer';
import { OnlineCompilerButton } from './OnlineCompilerButton';
import { DiagnosticCase } from '../data/mission8';
import { storage } from '../utils/storage';

interface DiagnosticHuntProps {
  missionId: number;
  caseId: string;
  data: DiagnosticCase;
  onCompleted?: () => void;
}

export const DiagnosticHunt: React.FC<DiagnosticHuntProps> = ({
  missionId,
  caseId,
  data,
  onCompleted
}) => {
  const storageKey = `diagnostichunt:${missionId}:${caseId}`;

  const [chosenCategory, setChosenCategory] = useState<'sintaks' | 'logika' | null>(null);
  const [chosenOptionId, setChosenOptionId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = storage.get<{
      chosenCategory: 'sintaks' | 'logika' | null;
      chosenOptionId: string | null;
      checked: boolean;
    } | null>(storageKey, null);

    if (saved) {
      setChosenCategory(saved.chosenCategory);
      setChosenOptionId(saved.chosenOptionId);
      setChecked(saved.checked || false);
    }
  }, [storageKey]);

  const saveState = (
    cat: 'sintaks' | 'logika' | null,
    opt: string | null,
    isChk: boolean
  ) => {
    storage.set(storageKey, {
      chosenCategory: cat,
      chosenOptionId: opt,
      checked: isChk
    });
  };

  const isCatCorrect = chosenCategory === data.errorCategory;
  const isOptCorrect = chosenOptionId === data.correctOptionId;
  const isAllCorrect = isCatCorrect && isOptCorrect;

  const handleCheck = () => {
    if (!chosenCategory) {
      alert('Tentukan jenis kesalahannya terlebih dahulu (Sintaks atau Logika)!');
      return;
    }
    if (!chosenOptionId) {
      alert('Pilih tindakan perbaikan yang tepat!');
      return;
    }

    setChecked(true);
    saveState(chosenCategory, chosenOptionId, true);
    storage.markCaseCompleted(missionId, caseId);
    onCompleted?.();
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Bug className="w-4 h-4" />
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            {data.title}
          </h3>
        </div>
        <OnlineCompilerButton compact />
      </div>

      <div className="mb-4">
        <CodeViewer code={data.code} title="KASUS KODE BERMASALAH" />
      </div>

      {data.contextNote && (
        <div className="mb-4 text-xs sm:text-sm text-cyan-300/90 bg-cyan-950/25 border border-cyan-500/20 rounded-xl p-3">
          {data.contextNote}
        </div>
      )}

      {/* Step 1: Choose Error Category */}
      <div className="mb-4 p-3.5 rounded-xl bg-black/40 border border-cyan-500/15">
        <span className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
          1. Tentukan Jenis Kesalahan Kasus Ini:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              setChosenCategory('sintaks');
              saveState('sintaks', chosenOptionId, checked);
            }}
            className={`p-3 rounded-xl border text-left font-mono text-sm transition-all touch-target cursor-pointer flex items-center justify-between ${
              chosenCategory === 'sintaks'
                ? 'bg-rose-500/20 border-rose-400 text-white font-bold shadow-md shadow-rose-500/10'
                : 'bg-black/40 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <div>
              <span className="block font-bold">Error Sintaks</span>
              <span className="text-[11px] text-slate-400 font-sans block">Compiler menolak menjalankan program</span>
            </div>
            <span className={`w-3.5 h-3.5 rounded-full border ${chosenCategory === 'sintaks' ? 'bg-rose-400 border-rose-300' : 'border-slate-600'}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              setChosenCategory('logika');
              saveState('logika', chosenOptionId, checked);
            }}
            className={`p-3 rounded-xl border text-left font-mono text-sm transition-all touch-target cursor-pointer flex items-center justify-between ${
              chosenCategory === 'logika'
                ? 'bg-amber-500/20 border-amber-400 text-white font-bold shadow-md shadow-amber-500/10'
                : 'bg-black/40 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <div>
              <span className="block font-bold">Error Logika</span>
              <span className="text-[11px] text-slate-400 font-sans block">Program berjalan normal namun outputnya salah</span>
            </div>
            <span className={`w-3.5 h-3.5 rounded-full border ${chosenCategory === 'logika' ? 'bg-amber-400 border-amber-300' : 'border-slate-600'}`} />
          </button>
        </div>
      </div>

      {/* Step 2: Choose Fix Action */}
      <div className="mb-5 p-3.5 rounded-xl bg-black/40 border border-cyan-500/15">
        <span className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
          2. Pilih Tindakan Perbaikan yang Tepat:
        </span>
        <div className="space-y-2">
          {data.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setChosenOptionId(opt.id);
                saveState(chosenCategory, opt.id, checked);
              }}
              className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all touch-target cursor-pointer flex items-center justify-between ${
                chosenOptionId === opt.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-white font-medium'
                  : 'bg-black/30 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span>{opt.label}</span>
              <span className={`w-3 h-3 rounded-full border shrink-0 ml-2 ${chosenOptionId === opt.id ? 'bg-cyan-400 border-cyan-300' : 'border-slate-600'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Check Button */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          type="button"
          onClick={handleCheck}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm sm:text-base shadow-md shadow-cyan-500/20 touch-target cursor-pointer"
        >
          Periksa Diagnosa
        </button>

        {checked && isAllCorrect && (
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
            <CheckCircle className="w-5 h-5" />
            <span>Diagnosa tepat! Bug berhasil dijinakkan.</span>
          </div>
        )}

        {checked && !isAllCorrect && (
          <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-sm">
            <XCircle className="w-5 h-5" />
            <span>
              {!isCatCorrect ? 'Kategori jenis error belum tepat. ' : ''}
              {!isOptCorrect ? 'Opsi perbaikan belum sesuai. ' : ''}
              Pelajari penjelasan di bawah.
            </span>
          </div>
        )}
      </div>

      {/* Explanation & Clean Fixed Code */}
      {checked && (
        <div className="mt-4 pt-4 border-t border-cyan-500/20 space-y-4 animate-fadeIn">
          <div className="p-4 rounded-xl bg-blue-950/40 border-l-4 border-cyan-400 text-slate-200 text-sm leading-relaxed">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Penjelasan Detektif:</span>
            </div>
            <p>{data.explanation}</p>
          </div>

          <div>
            <span className="block text-xs font-mono font-bold uppercase text-emerald-400 mb-1.5">
              Kode Solusi Bersih:
            </span>
            <CodeViewer code={data.fixedCode} title="KODE SOLUSI" />
          </div>
        </div>
      )}
    </div>
  );
};
