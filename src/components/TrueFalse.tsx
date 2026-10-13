import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { TrueFalseData } from '../types';
import { CodeViewer } from './CodeViewer';
import { storage } from '../utils/storage';

interface TrueFalseProps {
  missionId: number;
  caseId: string;
  data: TrueFalseData;
  onCompleted?: (isFirstAttemptCorrect: boolean) => void;
}

export const TrueFalse: React.FC<TrueFalseProps> = ({
  missionId,
  caseId,
  data,
  onCompleted
}) => {
  const storageKey = `truefalse:${missionId}:${caseId}`;

  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [userReason, setUserReason] = useState('');
  const [answered, setAnswered] = useState(false);
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const saved = storage.get<{
      userChoice: boolean | null;
      userReason: string;
      answered: boolean;
      firstAttemptCorrect?: boolean;
    } | null>(storageKey, null);

    if (saved) {
      setUserChoice(saved.userChoice);
      setUserReason(saved.userReason || '');
      setAnswered(saved.answered || false);
      if (saved.firstAttemptCorrect !== undefined) {
        setFirstAttemptCorrect(saved.firstAttemptCorrect);
      }
    }
  }, [storageKey]);

  const handleSelect = (choice: boolean) => {
    const isCorrect = choice === data.isTrue;
    const isFirst = !answered;
    const firstCorrectVal = isFirst ? isCorrect : (firstAttemptCorrect ?? isCorrect);

    setUserChoice(choice);
    setAnswered(true);
    setFirstAttemptCorrect(firstCorrectVal);

    storage.set(storageKey, {
      userChoice: choice,
      userReason,
      answered: true,
      firstAttemptCorrect: firstCorrectVal
    });

    storage.saveTrueFalseReason(
      missionId,
      caseId,
      data.statement,
      choice,
      isCorrect,
      userReason
    );

    storage.markCaseCompleted(missionId, caseId);
    onCompleted?.(firstCorrectVal);
  };

  const handleReasonChange = (text: string) => {
    setUserReason(text);
    storage.set(storageKey, {
      userChoice,
      userReason: text,
      answered,
      firstAttemptCorrect
    });
    if (answered && userChoice !== null) {
      storage.saveTrueFalseReason(
        missionId,
        caseId,
        data.statement,
        userChoice,
        userChoice === data.isTrue,
        text
      );
    }
  };

  const isUserCorrect = userChoice === data.isTrue;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
          Uji Kebenaran (Benar / Salah)
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
          {data.title}
        </h3>
      </div>

      <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-4 my-3 text-slate-100 text-base sm:text-lg font-medium leading-relaxed">
        {data.statement}
      </div>

      {data.code && (
        <div className="mb-4">
          <CodeViewer code={data.code} title="KODE KASUS" />
        </div>
      )}

      {/* Optional Reason Input before answer */}
      <div className="mb-4">
        <label className="block text-xs font-mono text-slate-400 mb-1">
          Alasan pribadimu (opsional, dicatat ke Buku Catatan):
        </label>
        <input
          type="text"
          value={userReason}
          onChange={(e) => handleReasonChange(e.target.value)}
          placeholder="Misal: karena operator pembagian membuang sisa..."
          className="w-full bg-black/50 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 touch-target"
        />
      </div>

      {/* Buttons Benar / Salah */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          type="button"
          onClick={() => handleSelect(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-base transition-all touch-target cursor-pointer ${
            answered && userChoice === true
              ? data.isTrue
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400'
                : 'bg-rose-700 text-white border border-rose-500'
              : 'bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>BENAR</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelect(false)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-base transition-all touch-target cursor-pointer ${
            answered && userChoice === false
              ? !data.isTrue
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400'
                : 'bg-rose-700 text-white border border-rose-500'
              : 'bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30'
          }`}
        >
          <XCircle className="w-5 h-5 text-rose-400" />
          <span>SALAH</span>
        </button>

        {answered && (
          <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold">
            {isUserCorrect ? (
              <span className="text-emerald-400">Pilihanmu tepat!</span>
            ) : (
              <span className="text-rose-400">Belum tepat. Coba periksa alasan di bawah.</span>
            )}
          </div>
        )}
      </div>

      {/* Explanation */}
      {answered && (
        <div className="p-4 rounded-xl bg-blue-950/40 border-l-4 border-cyan-400 text-slate-200 text-sm leading-relaxed">
          <div className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Alasan:</span>
          </div>
          <p>{data.explanation}</p>
        </div>
      )}
    </div>
  );
};
