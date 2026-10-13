import React, { useState, useEffect } from 'react';
import { Check, X, CheckCheck, Eye, HelpCircle } from 'lucide-react';
import { TraceTableData } from '../types';
import { storage } from '../utils/storage';

interface TraceTableProps {
  missionId: number;
  caseId: string;
  data: TraceTableData;
  onCompleted?: () => void;
}

export const TraceTable: React.FC<TraceTableProps> = ({
  missionId,
  caseId,
  data,
  onCompleted
}) => {
  const storageKey = `tracetable:${missionId}:${caseId}`;

  // cellInputs: rowIdx -> colKey -> string
  const [inputs, setInputs] = useState<Record<number, Record<string, string>>>({});
  const [checked, setChecked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const saved = storage.get<{
      inputs: Record<number, Record<string, string>>;
      checked: boolean;
      showAnswer: boolean;
    } | null>(storageKey, null);

    if (saved) {
      setInputs(saved.inputs || {});
      setChecked(saved.checked || false);
      setShowAnswer(saved.showAnswer || false);
    }
  }, [storageKey]);

  const handleCellChange = (rowIndex: number, col: string, value: string) => {
    const updated = {
      ...inputs,
      [rowIndex]: {
        ...(inputs[rowIndex] || {}),
        [col]: value
      }
    };
    setInputs(updated);
    setChecked(false); // Reset check status when modifying
    storage.set(storageKey, {
      inputs: updated,
      checked: false,
      showAnswer
    });
  };

  const isCellCorrect = (rowIndex: number, col: string): boolean => {
    const expected = data.rows[rowIndex].values[col]?.trim() || '';
    const userVal = inputs[rowIndex]?.[col]?.trim() || '';

    // If expected is empty (variable not yet initialized / declared), user empty is correct!
    if (expected === '' || expected === '(kosong)') {
      return userVal === '' || userVal === '-' || userVal.toLowerCase() === 'kosong';
    }

    return userVal === expected;
  };

  const handleCheck = () => {
    setChecked(true);
    storage.set(storageKey, {
      inputs,
      checked: true,
      showAnswer
    });

    // Check if all are correct
    let allRight = true;
    data.rows.forEach((row, rIdx) => {
      data.columns.forEach((col) => {
        if (!isCellCorrect(rIdx, col)) {
          allRight = false;
        }
      });
    });

    if (allRight) {
      storage.markCaseCompleted(missionId, caseId);
      onCompleted?.();
    }
  };

  const handleShowAnswers = () => {
    const autoFilled: Record<number, Record<string, string>> = {};
    data.rows.forEach((row, rIdx) => {
      autoFilled[rIdx] = {};
      data.columns.forEach((col) => {
        const expected = row.values[col]?.trim() || '';
        autoFilled[rIdx][col] = expected === '(kosong)' ? '' : expected;
      });
    });

    setInputs(autoFilled);
    setShowAnswer(true);
    setChecked(true);
    storage.set(storageKey, {
      inputs: autoFilled,
      checked: true,
      showAnswer: true
    });
    storage.markCaseCompleted(missionId, caseId);
    onCompleted?.();
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-magenta-500/20 text-[#b026ff] border border-purple-500/30 uppercase tracking-wider">
            Tabel Penelusuran (Trace Table)
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            {data.title}
          </h3>
        </div>
      </div>

      <p className="text-slate-300 text-sm sm:text-base mb-4">
        Lengkapi jejak perubahan nilai setiap variabel di bawah. Jika variabel belum memiliki nilai, biarkan sel kosong.
      </p>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-cyan-500/25 bg-black/40 shadow-inner mb-4">
        <table className="w-full text-left text-sm font-mono border-collapse min-w-[340px]">
          <thead>
            <tr className="bg-cyan-950/40 border-b border-cyan-500/25 text-cyan-300">
              <th className="py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Titik Eksekusi
              </th>
              {data.columns.map((col) => (
                <th key={col} className="py-2.5 px-3 font-bold text-center text-sm uppercase">
                  var <span className="text-white bg-cyan-500/20 px-1.5 py-0.5 rounded">{col}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/15">
            {data.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-cyan-500/5 transition-colors">
                <td className="py-2.5 px-3 text-slate-300 font-medium text-xs sm:text-sm whitespace-nowrap">
                  {row.label}
                </td>
                {data.columns.map((col) => {
                  const userVal = inputs[rIdx]?.[col] || '';
                  const correct = checked && isCellCorrect(rIdx, col);
                  const wrong = checked && !isCellCorrect(rIdx, col);

                  return (
                    <td key={col} className="py-1.5 px-2 text-center">
                      <div className="relative inline-block w-full max-w-[90px]">
                        <input
                          type="text"
                          value={userVal}
                          onChange={(e) => handleCellChange(rIdx, col, e.target.value)}
                          placeholder="-"
                          className={`w-full text-center py-1 px-2 rounded-lg font-mono text-sm border transition-all focus:outline-none touch-target ${
                            correct
                              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                              : wrong
                              ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                              : 'bg-black/60 border-cyan-500/30 text-white focus:border-cyan-400'
                          }`}
                        />
                        {checked && (
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            {correct ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 inline" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-rose-400 inline" />
                            )}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCheck}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all touch-target cursor-pointer"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Periksa Jawaban</span>
        </button>

        <button
          type="button"
          onClick={handleShowAnswers}
          className="px-4 py-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 hover:text-white border border-purple-500/30 text-sm font-semibold flex items-center gap-2 transition-all touch-target cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>Lihat Jawaban</span>
        </button>
      </div>

      {/* Explanation after checking */}
      {checked && (
        <div className="mt-4 p-4 rounded-xl bg-blue-950/30 border border-cyan-500/20 text-slate-200 text-sm leading-relaxed flex items-start gap-2.5">
          <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-cyan-300 block mb-1">Catatan Detektif:</span>
            {data.explanation}
          </div>
        </div>
      )}
    </div>
  );
};
