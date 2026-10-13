import React, { useState } from 'react';
import { Cpu, ArrowRight, Sparkles } from 'lucide-react';
import { CodeViewer } from './CodeViewer';

interface DigitSplitterDemoProps {
  className?: string;
}

export const DigitSplitterDemo: React.FC<DigitSplitterDemoProps> = ({ className = '' }) => {
  const [numInput, setNumInput] = useState<number>(472);

  // Bound to 3 digits (100 to 999)
  const n = isNaN(numInput) ? 100 : Math.min(999, Math.max(100, numInput));

  const ratusan = Math.trunc(n / 100);
  const puluhanDiv10 = Math.trunc(n / 10);
  const puluhan = puluhanDiv10 % 10;
  const satuan = n % 10;
  const total = ratusan + puluhan + satuan;

  const cppCode = `#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Masukkan bilangan 3 digit (100-999): ";
    cin >> n;

    int ratusan = n / 100;
    int puluhan = (n / 10) % 10;
    int satuan  = n % 10;
    int jumlah  = ratusan + puluhan + satuan;

    cout << "Ratusan : " << ratusan << endl;
    cout << "Puluhan : " << puluhan << endl;
    cout << "Satuan  : " << satuan << endl;
    cout << "Jumlah  : " << jumlah << endl;

    return 0;
}`;

  return (
    <div className={`glass-panel rounded-2xl p-4 sm:p-6 mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-5 h-5" />
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            Kasus 5.3: Mesin Pemecah Digit Tiga Angka
          </h3>
        </div>
      </div>

      <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
        Bagaimana komputer memisahkan angka ratusan, puluhan, dan satuan tanpa manipulasi teks? Gunakan kombinasi sakti pembagian integer <code className="text-cyan-300 font-mono">/</code> dan sisa bagi modulo <code className="text-pink-300 font-mono">%</code>!
      </p>

      {/* Input Slider & Number Input */}
      <div className="mb-6 p-4 rounded-xl bg-black/50 border border-cyan-500/25">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <label className="text-sm font-semibold text-slate-200">
            Pilih atau Ketik Bilangan 3 Digit (100 - 999):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={100}
              max={999}
              value={numInput}
              onChange={(e) => setNumInput(parseInt(e.target.value) || 100)}
              className="w-28 bg-[#091226] border border-cyan-500/40 rounded-xl px-3 py-1.5 text-center font-mono text-xl font-black text-cyan-300 focus:outline-none focus:border-cyan-400 touch-target"
            />
            <div className="flex gap-1">
              {[472, 815, 309, 999].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setNumInput(val)}
                  className={`px-2 py-1 text-xs font-mono rounded border touch-target cursor-pointer ${
                    n === val
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'bg-black/40 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>

        <input
          type="range"
          min={100}
          max={999}
          value={n}
          onChange={(e) => setNumInput(parseInt(e.target.value))}
          className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg touch-target"
        />
      </div>

      {/* Step by step formulas with real numbers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {/* Ratusan */}
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5">
          <span className="text-xs font-mono uppercase text-cyan-400 font-bold block mb-1">
            Digit Ratusan
          </span>
          <div className="font-mono text-xs text-slate-400 mb-1">
            rumus: <code className="text-slate-200">n / 100</code>
          </div>
          <div className="font-mono text-sm sm:text-base text-cyan-200 font-bold bg-black/40 p-2 rounded border border-cyan-500/20">
            {n} / 100 = <span className="text-cyan-300 text-lg font-black">{ratusan}</span>
          </div>
        </div>

        {/* Puluhan */}
        <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3.5">
          <span className="text-xs font-mono uppercase text-purple-300 font-bold block mb-1">
            Digit Puluhan
          </span>
          <div className="font-mono text-xs text-slate-400 mb-1">
            rumus: <code className="text-slate-200">(n / 10) % 10</code>
          </div>
          <div className="font-mono text-sm sm:text-base text-purple-200 font-bold bg-black/40 p-2 rounded border border-purple-500/20">
            ({n} / 10) % 10 = {puluhanDiv10} % 10 = <span className="text-purple-300 text-lg font-black">{puluhan}</span>
          </div>
        </div>

        {/* Satuan */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5">
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold block mb-1">
            Digit Satuan
          </span>
          <div className="font-mono text-xs text-slate-400 mb-1">
            rumus: <code className="text-slate-200">n % 10</code>
          </div>
          <div className="font-mono text-sm sm:text-base text-emerald-200 font-bold bg-black/40 p-2 rounded border border-emerald-500/20">
            {n} % 10 = <span className="text-emerald-300 text-lg font-black">{satuan}</span>
          </div>
        </div>
      </div>

      {/* Summary calculation */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-blue-950/40 border border-cyan-500/30 flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-sm sm:text-base font-mono">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Jumlah total ketiga digit:</span>
          <span className="font-bold text-white">
            {ratusan} + {puluhan} + {satuan}
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-mono font-black text-cyan-300 px-3 py-0.5 rounded bg-black/60 border border-cyan-400/40">
          = {total}
        </div>
      </div>

      {/* Complete C++ Code */}
      <div>
        <span className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5 tracking-wider">
          Kode C++ Lengkap Pemecah Digit:
        </span>
        <CodeViewer code={cppCode} title="digit_splitter.cpp" />
      </div>
    </div>
  );
};
