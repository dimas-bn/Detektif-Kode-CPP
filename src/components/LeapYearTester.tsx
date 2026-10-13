import React, { useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Code2, Sparkles } from 'lucide-react';
import { CodeViewer } from './CodeViewer';

interface LeapYearTesterProps {
  className?: string;
}

export const LeapYearTester: React.FC<LeapYearTesterProps> = ({ className = '' }) => {
  const [year, setYear] = useState<number>(2024);

  const y = isNaN(year) ? 0 : year;

  // Condition evaluation
  const mod4 = y % 4 === 0;
  const notMod100 = y % 100 !== 0;
  const mod400 = y % 400 === 0;

  const leftBranch = mod4 && notMod100;
  const isLeap = leftBranch || mod400;

  const quickYears = [
    { y: 2024, label: '2024 (Kabisat)', status: 'kabisat' },
    { y: 1900, label: '1900 (Bukan)', status: 'bukan' },
    { y: 2000, label: '2000 (Kabisat)', status: 'kabisat' },
    { y: 2023, label: '2023 (Bukan)', status: 'bukan' }
  ];

  const cppCode = `#include <iostream>
using namespace std;

int main() {
    int tahun;
    cout << "Masukkan tahun: ";
    cin >> tahun;

    if ((tahun % 4 == 0 && tahun % 100 != 0) || tahun % 400 == 0) {
        cout << "Kabisat" << endl;
    } else {
        cout << "Bukan kabisat" << endl;
    }

    return 0;
}`;

  return (
    <div className={`glass-panel rounded-2xl p-4 sm:p-6 mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Calendar className="w-5 h-5" />
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            Penguji Logika Tahun Kabisat
          </h3>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-slate-200 text-sm mb-4 leading-relaxed">
        <strong>Aturan Resmi Kalender Gregorian:</strong> Sebuah tahun adalah kabisat jika habis dibagi 4 (<code className="text-cyan-300 font-mono">tahun % 4 == 0</code>), <em>kecuali</em> jika habis dibagi 100 (<code className="text-pink-300 font-mono">tahun % 100 != 0</code>). Namun, tahun kelipatan 100 tetap kabisat jika habis dibagi 400 (<code className="text-emerald-300 font-mono">tahun % 400 == 0</code>).
      </div>

      {/* Input Year and Quick Year Buttons */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono font-bold text-slate-300 uppercase">
            Masukkan Tahun:
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10) || 0)}
            className="w-28 bg-black/60 border border-cyan-500/40 rounded-xl px-3 py-1.5 text-center font-mono text-lg font-bold text-cyan-300 focus:outline-none focus:border-cyan-400 touch-target"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {quickYears.map((q) => (
            <button
              key={q.y}
              type="button"
              onClick={() => setYear(q.y)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs border touch-target cursor-pointer transition-all ${
                year === q.y
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm'
                  : 'bg-black/40 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logic Decomposition Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5 font-mono text-xs">
        {/* Condition 1 */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400 font-bold">1. tahun % 4 == 0</span>
            <span className={mod4 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {mod4 ? 'TRUE (1)' : 'FALSE (0)'}
            </span>
          </div>
          <div className="text-slate-400 text-[11px]">
            {y} % 4 = {y % 4} {mod4 ? '(= 0, habis dibagi 4)' : '(!= 0, sisa bagi)'}
          </div>
        </div>

        {/* Condition 2 */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400 font-bold">2. tahun % 100 != 0</span>
            <span className={notMod100 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {notMod100 ? 'TRUE (1)' : 'FALSE (0)'}
            </span>
          </div>
          <div className="text-slate-400 text-[11px]">
            {y} % 100 = {y % 100} {notMod100 ? '(bukan kelipatan 100)' : '(kelipatan 100!)'}
          </div>
        </div>

        {/* Condition 3 */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400 font-bold">3. tahun % 400 == 0</span>
            <span className={mod400 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {mod400 ? 'TRUE (1)' : 'FALSE (0)'}
            </span>
          </div>
          <div className="text-slate-400 text-[11px]">
            {y} % 400 = {y % 400} {mod400 ? '(= 0, lolos syarat 400)' : '(!= 0)'}
          </div>
        </div>
      </div>

      {/* Decision Summary Card */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 transition-all ${
        isLeap
          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
          : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
      }`}>
        <div className="flex items-center gap-3">
          {isLeap ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
          )}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider block opacity-80">
              Hasil Keputusan C++:
            </span>
            <div className="text-xl sm:text-2xl font-bold font-orbitron">
              Tahun {y} adalah {isLeap ? 'KABISAT' : 'BUKAN KABISAT'}
            </div>
          </div>
        </div>

        <div className="text-xs font-mono bg-black/60 px-3 py-2 rounded-lg border border-slate-700/60 self-start sm:self-auto">
          cout &lt;&lt; "{isLeap ? 'Kabisat' : 'Bukan kabisat'}"
        </div>
      </div>

      {/* Complete C++ Code */}
      <div>
        <span className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
          Kode Lengkap Logika Percabangan C++:
        </span>
        <CodeViewer code={cppCode} title="tahun_kabisat.cpp" />
      </div>
    </div>
  );
};
