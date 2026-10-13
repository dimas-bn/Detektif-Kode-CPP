import React, { useState } from 'react';
import { Layers, Eye, CheckCircle2, Sparkles, Terminal } from 'lucide-react';
import { CodeViewer } from './CodeViewer';
import { storage } from '../utils/storage';

interface NestedLoopVisualizerProps {
  missionId: number;
  caseId: string;
  className?: string;
  onCompleted?: () => void;
}

export const NestedLoopVisualizer: React.FC<NestedLoopVisualizerProps> = ({
  missionId,
  caseId,
  className = '',
  onCompleted
}) => {
  const storageKey = `nestedloop:${missionId}:${caseId}`;

  const [guess, setGuess] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [n, setN] = useState<number>(3);

  // Restore state
  React.useEffect(() => {
    const saved = storage.get<{
      guess: string;
      revealed: boolean;
      n?: number;
    } | null>(storageKey, null);

    if (saved) {
      setGuess(saved.guess || '');
      setRevealed(saved.revealed || false);
      if (saved.n) setN(saved.n);
    }
  }, [storageKey]);

  const handleReveal = () => {
    setRevealed(true);
    storage.set(storageKey, { guess, revealed: true, n });
    storage.savePrediction(
      missionId,
      caseId,
      'Kasus 7.2: Tebakan Pola Segitiga Bintang Bersarang',
      guess,
      '*\n**\n***',
      'same'
    );
    storage.markCaseCompleted(missionId, caseId);
    onCompleted?.();
  };

  const handleNChange = (val: number) => {
    setN(val);
    if (revealed) {
      storage.set(storageKey, { guess, revealed: true, n: val });
    }
  };

  // Generate star rows for given n
  const starRows: string[] = [];
  for (let i = 1; i <= n; i++) {
    starRows.push('*'.repeat(i));
  }

  const generatedCode = `for (int i = 1; i <= ${n}; i++) {
    for (int j = 1; j <= i; j++) {
        cout << "*";
    }
    cout << endl;
}`;

  return (
    <div className={`glass-panel rounded-2xl p-4 sm:p-6 mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Layers className="w-5 h-5" />
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            Kasus 7.2: Visualizer Perulangan Bersarang (Nested Loop)
          </h3>
        </div>
      </div>

      <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
        Perhatikan kode dua lapis perulangan di bawah. Loop luar (<code className="text-cyan-300 font-mono">i</code>) mengontrol jumlah baris, dan loop dalam (<code className="text-purple-300 font-mono">j</code>) mencetak bintang di baris tersebut.
      </p>

      {/* Code Viewer initial with n=3 */}
      <div className="mb-4">
        <CodeViewer
          code={`for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= i; j++) {
        cout << "*";
    }
    cout << endl;
}`}
          title="nested_stars.cpp"
        />
      </div>

      {/* Multi-line guess input */}
      <div className="mb-5 bg-black/40 border border-cyan-500/20 rounded-xl p-4">
        <label className="block text-sm font-semibold text-cyan-300 mb-2">
          Tebakan Anda: Apa tepatnya bentuk keluaran di konsol saat kode di atas dijalankan?
        </label>
        <textarea
          rows={3}
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder={`Ketik tebakan bentuk output bintangmu di sini...\nContoh:\n*\n**\n***`}
          className="w-full bg-black/70 border border-cyan-500/30 rounded-xl p-3 font-mono text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 touch-target mb-3"
        />

        {!revealed && (
          <button
            type="button"
            onClick={handleReveal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm sm:text-base flex items-center gap-2 shadow-md shadow-cyan-500/25 touch-target cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Ungkap Hasil & Buka Slider Interaktif</span>
          </button>
        )}
      </div>

      {/* Revealed interactive slider & dynamic visualizer */}
      {revealed && (
        <div className="mt-6 pt-5 border-t border-cyan-500/20 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>Hasil Terverifikasi: Segitiga Siku-Siku Bintang</span>
          </div>

          {/* Slider n from 1 to 6 */}
          <div className="p-4 rounded-xl bg-[#081226] border border-cyan-500/30 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-200">
                Ubah Batas Putaran Luar (n):
              </span>
              <span className="text-xl font-mono font-bold text-cyan-300 bg-black/60 px-3 py-0.5 rounded border border-cyan-500/30">
                n = {n}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              value={n}
              onChange={(e) => handleNChange(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg touch-target"
            />
            <div className="flex justify-between text-xs font-mono text-slate-400 mt-1">
              <span>n = 1</span>
              <span>n = 2</span>
              <span>n = 3 (asli)</span>
              <span>n = 4</span>
              <span>n = 5</span>
              <span>n = 6</span>
            </div>
          </div>

          {/* Dynamic Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Live Terminal Output */}
            <div className="bg-black/90 rounded-xl border border-slate-700 p-4 font-mono">
              <div className="flex items-center gap-2 text-slate-400 text-xs border-b border-slate-800 pb-2 mb-3">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="uppercase tracking-wider font-bold">Output Layar Terminal</span>
              </div>
              <div className="bg-[#030712] p-3 rounded border border-slate-800/80 text-emerald-300 text-base leading-tight font-mono tracking-widest min-h-[120px]">
                {starRows.map((row, idx) => (
                  <div key={idx} className="hover:text-cyan-200">
                    {row}
                  </div>
                ))}
              </div>
            </div>

            {/* Loop Mechanics Explanation */}
            <div className="bg-cyan-950/20 rounded-xl border border-cyan-500/25 p-4 text-xs sm:text-sm font-mono text-slate-300">
              <div className="text-xs uppercase font-bold text-cyan-400 mb-2 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mekanisme Iterasi Loop Bersarang:</span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                {starRows.map((_, idx) => {
                  const iVal = idx + 1;
                  return (
                    <li key={iVal}>
                      Putaran luar <span className="text-cyan-300 font-bold">i = {iVal}</span>: loop dalam j berputar sebanyak <span className="text-purple-300 font-bold">{iVal} kali</span> mencetak {iVal} buah '*'.
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-950/30 border-l-4 border-cyan-400 text-slate-200 text-sm">
            <strong>Analisis Detektif:</strong> Karena kondisi loop dalam adalah <code className="text-cyan-300 font-mono">j &lt;= i</code>, jumlah iterasi loop dalam bertambah seiring bertambahnya nilai <code className="text-cyan-300 font-mono">i</code> pada tiap baris. Itulah sebabnya pola yang terbentuk adalah segitiga bertingkat!
          </div>
        </div>
      )}
    </div>
  );
};
