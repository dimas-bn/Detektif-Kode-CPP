import React, { useState, useEffect } from 'react';
import { Check, X, CheckCheck, HelpCircle } from 'lucide-react';
import { storage } from '../utils/storage';

interface RoleMatcherProps {
  missionId: number;
  caseId: string;
  onCompleted?: () => void;
}

export const RoleMatcher: React.FC<RoleMatcherProps> = ({
  missionId,
  caseId,
  onCompleted
}) => {
  const storageKey = `rolematcher:${missionId}:${caseId}`;

  const roleOptions = [
    { value: '', label: '-- Pilih Peran Baris --' },
    { value: 'pustaka', label: 'Pustaka (Library / Header)' },
    { value: 'titik_awal', label: 'Titik Awal Program (Main)' },
    { value: 'deklarasi', label: 'Deklarasi Variabel' },
    { value: 'input', label: 'Input Pengguna' },
    { value: 'output', label: 'Output (Tampilan Layar)' },
    { value: 'perhitungan', label: 'Perhitungan / Operasi' },
    { value: 'akhir_program', label: 'Akhir Program' }
  ];

  const targetLines = [
    {
      line: 1,
      code: '#include <iostream>',
      accepted: ['pustaka'],
      explanation: '#include <iostream> memasukkan pustaka standar untuk fungsi input (cin) dan output (cout).'
    },
    {
      line: 4,
      code: 'int main() {',
      accepted: ['titik_awal'],
      explanation: 'int main() adalah fungsi utama di mana komputer mulai mengeksekusi instruksi dari awal.'
    },
    {
      line: 5,
      code: 'int panjang, lebar;',
      accepted: ['deklarasi'],
      explanation: 'Menyiapkan dua kotak variabel bertipe bilangan bulat di memori bernama panjang dan lebar.'
    },
    {
      line: 7,
      code: 'cin >> panjang;',
      accepted: ['input'],
      explanation: 'cin menerima data yang diketikkan pengguna melalui keyboard ke variabel panjang.'
    },
    {
      line: 10,
      code: 'int luas = panjang * lebar;',
      accepted: ['perhitungan', 'deklarasi'],
      explanation: 'Baris ini melakukan perhitungan perkalian sekaligus mendeklarasikan variabel baru bernama luas.'
    },
    {
      line: 11,
      code: 'cout << "Luas = " << luas << endl;',
      accepted: ['output'],
      explanation: 'cout mencetak teks dan isi variabel luas ke layar konsol terminal pengguna.'
    },
    {
      line: 12,
      code: 'return 0;',
      accepted: ['akhir_program'],
      explanation: 'return 0 menandakan program berhasil diselesaikan secara normal tanpa error ke sistem operasi.'
    }
  ];

  const [selections, setSelections] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = storage.get<{
      selections: Record<number, string>;
      checked: boolean;
    } | null>(storageKey, null);

    if (saved) {
      setSelections(saved.selections || {});
      setChecked(saved.checked || false);
    }
  }, [storageKey]);

  const handleSelect = (lineNum: number, value: string) => {
    const next = { ...selections, [lineNum]: value };
    setSelections(next);
    setChecked(false);
    storage.set(storageKey, { selections: next, checked: false });
  };

  const handleCheck = () => {
    setChecked(true);
    storage.set(storageKey, { selections, checked: true });

    const allRight = targetLines.every((t) =>
      t.accepted.includes(selections[t.line] || '')
    );

    if (allRight) {
      storage.markCaseCompleted(missionId, caseId);
      onCompleted?.();
    }
  };

  const handleAutoFill = () => {
    const filled: Record<number, string> = {};
    targetLines.forEach((t) => {
      filled[t.line] = t.accepted[0];
    });
    setSelections(filled);
    setChecked(true);
    storage.set(storageKey, { selections: filled, checked: true });
    storage.markCaseCompleted(missionId, caseId);
    onCompleted?.();
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
            Kasus 1.1: Pencocokan Peran
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            Tebak Peran Setiap Baris Kode
          </h3>
        </div>
      </div>

      <p className="text-slate-300 text-sm sm:text-base mb-4">
        Setiap baris kode C++ memiliki tugas spesifik. Tentukan peran yang paling sesuai untuk baris-baris pilihan di bawah ini:
      </p>

      {/* Matching list */}
      <div className="space-y-3 mb-5">
        {targetLines.map((target) => {
          const userVal = selections[target.line] || '';
          const isCorrect = checked && target.accepted.includes(userVal);
          const isWrong = checked && !target.accepted.includes(userVal);

          return (
            <div
              key={target.line}
              className={`p-3 sm:p-4 rounded-xl border transition-all ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/40'
                  : isWrong
                  ? 'bg-rose-950/40 border-rose-500/40'
                  : 'bg-black/50 border-cyan-500/20'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3 font-mono text-sm">
                  <span className="px-2 py-1 rounded bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30 text-xs shrink-0">
                    Baris {target.line}
                  </span>
                  <span className="text-slate-100 font-semibold overflow-x-auto whitespace-pre">
                    {target.code}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={userVal}
                    onChange={(e) => handleSelect(target.line, e.target.value)}
                    className="bg-[#091226] border border-cyan-500/30 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 touch-target cursor-pointer"
                  >
                    {roleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {checked && (
                    <span className="shrink-0">
                      {isCorrect ? (
                        <Check className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <X className="w-5 h-5 text-rose-400" />
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Explanations shown after check */}
              {checked && (
                <div className="mt-2.5 pt-2.5 border-t border-cyan-500/10 text-xs sm:text-sm text-slate-300 flex items-start gap-1.5">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{target.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCheck}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm sm:text-base shadow-md shadow-cyan-500/20 flex items-center gap-2 touch-target cursor-pointer"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Periksa Jawaban</span>
        </button>

        <button
          type="button"
          onClick={handleAutoFill}
          className="px-4 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 text-xs sm:text-sm touch-target cursor-pointer"
        >
          Lihat Kunci Lengkap
        </button>
      </div>
    </div>
  );
};
