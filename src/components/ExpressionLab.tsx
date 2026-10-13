import React, { useState } from 'react';
import { Calculator, ArrowRight, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { evaluateCppExpression, EvalResult } from '../utils/expressionParser';

interface ExpressionLabProps {
  initialExpression?: string;
  presetList?: string[];
  title?: string;
  className?: string;
}

export const ExpressionLab: React.FC<ExpressionLabProps> = ({
  initialExpression = '7 / 2',
  presetList = [
    '7 / 2',
    '7.0 / 2',
    '2 + 3 * 4',
    '(2 + 3) * 4',
    '17 % 5 + 17 / 5',
    '10 - 4 - 3',
    '5 > 3 && 2 > 4 || 1 < 2',
    '!(7 % 2 == 1)'
  ],
  title = 'Laboratorium Ekspresi C++',
  className = ''
}) => {
  const [expr, setExpr] = useState(initialExpression);
  const [result, setResult] = useState<EvalResult | null>(() => evaluateCppExpression(initialExpression));

  const handleCalculate = (targetExpr: string) => {
    const res = evaluateCppExpression(targetExpr);
    setResult(res);
  };

  const handlePresetClick = (p: string) => {
    setExpr(p);
    handleCalculate(p);
  };

  return (
    <div className={`glass-panel rounded-2xl p-4 sm:p-6 mb-6 ${className}`}>
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
          <Calculator className="w-5 h-5" />
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
          {title}
        </h3>
      </div>

      <p className="text-slate-300 text-sm mb-4">
        Evaluasi ekspresi matematika dan logika secara instan mengikuti <strong>aturan ketat C++</strong> (integer truncation, prioritas operator, dan evaluasi boolean 1/0).
      </p>

      {/* Preset Chips */}
      {presetList && presetList.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-mono text-cyan-400 mb-2 font-semibold uppercase tracking-wider">
            Coba Contoh Ekspresi:
          </div>
          <div className="flex flex-wrap gap-2">
            {presetList.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border touch-target cursor-pointer ${
                  expr === preset
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-100 shadow-sm'
                    : 'bg-black/40 border-cyan-500/20 text-slate-300 hover:text-white hover:border-cyan-500/50'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input row */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={expr}
            onChange={(e) => {
              setExpr(e.target.value);
              handleCalculate(e.target.value);
            }}
            placeholder="Ketik ekspresi C++, misal: 7 / 2 atau 5 > 2 && 4 < 1"
            className="w-full bg-black/60 border border-cyan-500/40 rounded-xl px-4 py-3 text-slate-100 font-mono text-base focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 touch-target"
          />
        </div>

        <button
          type="button"
          onClick={() => handleCalculate(expr)}
          className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-sans text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 touch-target cursor-pointer shrink-0"
        >
          <span>Hitung Nilai</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Result Card */}
      {result && (
        <div className="rounded-xl border border-cyan-500/25 bg-black/50 p-4">
          {result.success ? (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/15 pb-3 mb-3">
                <span className="text-xs uppercase font-mono text-slate-400">
                  Hasil Akhir C++:
                </span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xl sm:text-2xl font-mono font-black text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-400/40">
                    {result.formattedResult}
                  </span>
                </div>
              </div>

              {/* Step by step reduction */}
              {result.steps.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Langkah Penyederhanaan (Operator Precedence):</span>
                  </div>
                  <div className="space-y-1.5">
                    {result.steps.map((st, sIdx) => (
                      <div
                        key={sIdx}
                        className="text-xs sm:text-sm font-mono text-slate-200 bg-cyan-950/20 border-l-2 border-cyan-400 px-3 py-1.5 rounded-r"
                      >
                        <span className="text-cyan-400 mr-2 font-bold">{sIdx + 1}.</span>
                        {st}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-3 text-rose-300">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-rose-200">Kompilasi / Evaluasi Gagal</span>
                <p className="text-sm mt-0.5">{result.error}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
