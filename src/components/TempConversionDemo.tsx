import React, { useState } from 'react';
import { Thermometer, ArrowRight } from 'lucide-react';

interface TempConversionDemoProps {
  className?: string;
}

export const TempConversionDemo: React.FC<TempConversionDemoProps> = ({ className = '' }) => {
  const [celsiusInput, setCelsiusInput] = useState<number>(37);

  const cVal = isNaN(celsiusInput) ? 0 : celsiusInput;

  // Int calculation:
  // int F = c * 9 / 5 + 32;
  // step 1: c * 9
  const intStep1 = Math.trunc(cVal * 9);
  // step 2: intStep1 / 5 (truncated!)
  const intStep2 = Math.trunc(intStep1 / 5);
  const intFinalF = intStep2 + 32;

  // Double calculation:
  // double F = c * 9.0 / 5.0 + 32.0; (or c * 9 / 5.0 + 32)
  const doubleStep1 = cVal * 9;
  const doubleStep2 = doubleStep1 / 5;
  const doubleFinalF = doubleStep2 + 32;

  return (
    <div className={`glass-panel rounded-2xl p-4 sm:p-6 mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Thermometer className="w-5 h-5" />
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            Investigasi Rumus Konversi Suhu (Celsius ke Fahrenheit)
          </h3>
        </div>
      </div>

      <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
        Rumus fisika: <code className="text-cyan-300 font-mono font-bold">F = C * 9 / 5 + 32</code>. Coba masukkan nilai suhu Celsius di bawah dan bandingkan apa yang terjadi jika variabel bertipe <code className="text-amber-300 font-mono font-bold">int</code> dibandingkan dengan <code className="text-emerald-300 font-mono font-bold">double</code>!
      </p>

      {/* Input Celsius */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <label className="text-sm font-semibold text-slate-200">
          Masukkan Suhu Celsius (C):
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={celsiusInput}
            onChange={(e) => setCelsiusInput(parseFloat(e.target.value))}
            className="w-28 bg-black/60 border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-mono text-lg text-center font-bold focus:outline-none focus:border-cyan-400 touch-target"
          />
          <span className="text-cyan-300 font-mono font-bold">°C</span>

          <div className="flex gap-1.5 ml-2">
            {[0, 37, 100].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCelsiusInput(preset)}
                className={`px-2.5 py-1 text-xs font-mono rounded border touch-target cursor-pointer ${
                  celsiusInput === preset
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                    : 'bg-black/40 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {preset}°C
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Int mode card */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-4">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 mb-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Mode 1: Tipe int (Bilangan Bulat)
            </span>
            <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
              int C = {cVal};
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-300 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">1.</span>
              <span>{cVal} * 9 = </span>
              <span className="text-white font-bold">{intStep1}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">2.</span>
              <span>{intStep1} / 5 = </span>
              <span className="text-amber-300 font-bold underline decoration-amber-500/50">
                {intStep2}
              </span>
              <span className="text-[11px] text-amber-400/90 font-sans italic">
                (dipotong / truncate!)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">3.</span>
              <span>{intStep2} + 32 = </span>
              <span className="text-white font-bold">{intFinalF}</span>
            </div>
          </div>

          <div className="p-3 bg-black/60 rounded-lg border border-amber-500/20 flex items-center justify-between">
            <span className="text-xs text-slate-400">Hasil Output Layar:</span>
            <span className="text-2xl font-mono font-black text-amber-300">
              {intFinalF}°F
            </span>
          </div>
        </div>

        {/* Double mode card */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-3">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Mode 2: Tipe double (Pecahan Desimal)
            </span>
            <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
              double C = {cVal}.0;
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-300 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">1.</span>
              <span>{cVal} * 9 = </span>
              <span className="text-white font-bold">{doubleStep1}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">2.</span>
              <span>{doubleStep1} / 5.0 = </span>
              <span className="text-emerald-300 font-bold">
                {doubleStep2}
              </span>
              <span className="text-[11px] text-emerald-400/90 font-sans italic">
                (desimal utuh)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">3.</span>
              <span>{doubleStep2} + 32 = </span>
              <span className="text-white font-bold">{doubleFinalF}</span>
            </div>
          </div>

          <div className="p-3 bg-black/60 rounded-lg border border-emerald-500/20 flex items-center justify-between">
            <span className="text-xs text-slate-400">Hasil Output Layar:</span>
            <span className="text-2xl font-mono font-black text-emerald-300">
              {doubleFinalF.toFixed(1)}°F
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
