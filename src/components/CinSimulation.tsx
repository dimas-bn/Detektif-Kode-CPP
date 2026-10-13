import React, { useState } from 'react';
import { Terminal, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { CodeViewer } from './CodeViewer';

interface CinSimulationProps {
  className?: string;
}

export const CinSimulation: React.FC<CinSimulationProps> = ({ className = '' }) => {
  const [inputVal, setInputVal] = useState('Budi Santoso');
  const [mode, setMode] = useState<'cin' | 'getline'>('cin');

  // Simulation logic:
  // cin reads until first whitespace
  // getline reads full line
  const simulatedOutputName = mode === 'cin' ? inputVal.trimStart().split(/\s+/)[0] || '' : inputVal;

  const currentCode =
    mode === 'cin'
      ? `string nama;\ncout << "Nama: ";\ncin >> nama;\ncout << "Halo, " << nama << endl;`
      : `string nama;\ncout << "Nama: ";\ngetline(cin, nama);\ncout << "Halo, " << nama << endl;`;

  return (
    <div className={`glass-panel rounded-2xl p-4 sm:p-6 mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
            Laboratorium Interaktif
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            Simulasi: cin &gt;&gt; vs getline()
          </h3>
        </div>
      </div>

      <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
        Bandingkan bagaimana operator ekstraksi standar <code className="text-cyan-300 font-mono">cin &gt;&gt;</code> memperlakukan spasi dibandingkan dengan fungsi <code className="text-pink-300 font-mono">getline(cin, var)</code>.
      </p>

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-mono uppercase text-slate-400 font-bold mr-1">
          Mode Input:
        </span>
        <button
          type="button"
          onClick={() => setMode('cin')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono font-bold border transition-all touch-target cursor-pointer ${
            mode === 'cin'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
              : 'bg-black/40 text-slate-300 border-cyan-500/20 hover:text-white'
          }`}
        >
          {mode === 'cin' ? <ToggleRight className="w-4 h-4 text-slate-950" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
          <span>cin &gt;&gt; nama;</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('getline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono font-bold border transition-all touch-target cursor-pointer ${
            mode === 'getline'
              ? 'bg-[#b026ff] text-white border-purple-400 shadow-md shadow-purple-500/30'
              : 'bg-black/40 text-slate-300 border-purple-500/20 hover:text-white'
          }`}
        >
          {mode === 'getline' ? <ToggleRight className="w-4 h-4 text-white" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
          <span>getline(cin, nama);</span>
        </button>
      </div>

      {/* Input box */}
      <div className="mb-4">
        <label className="block text-xs font-mono text-cyan-300 uppercase font-semibold mb-1.5">
          Ketik Input Nama Uji Coba:
        </label>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ketik nama lengkap dengan spasi, misal: Budi Santoso"
          className="w-full bg-black/60 border border-cyan-500/40 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-base focus:outline-none focus:border-cyan-400 touch-target"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Code View */}
        <div>
          <CodeViewer code={currentCode} title={`KODE MODE: ${mode.toUpperCase()}`} />
        </div>

        {/* Console Box */}
        <div className="bg-black/80 rounded-xl border border-slate-700 p-4 font-mono text-sm flex flex-col justify-between shadow-inner">
          <div>
            <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800 pb-2 mb-3 text-xs">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>TERMINAL KONSOL C++</span>
            </div>

            <div className="text-slate-300 space-y-1">
              <div>
                Nama: <span className="text-cyan-300 underline underline-offset-4">{inputVal || '(kosong)'}</span>
              </div>
              <div className="text-emerald-300 font-bold text-base mt-2">
                Halo, {simulatedOutputName || ''}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            {mode === 'cin' ? (
              <span className="text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>cin berhenti membaca saat menemukan spasi pertama! Kata setelahnya diabaikan/tertinggal di buffer.</span>
              </span>
            ) : (
              <span className="text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>getline() membaca seluruh teks dalam baris tersebut termasuk semua spasinya sampai tombol Enter ditekan!</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
