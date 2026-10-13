import React, { useState, useEffect } from 'react';
import { Copy, Check, Terminal, ExternalLink, Lightbulb, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { CodeViewer } from './CodeViewer';
import { OnlineCompilerButton } from './OnlineCompilerButton';
import { storage } from '../utils/storage';

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface ProjectData {
  id: 'A' | 'B' | 'C';
  title: string;
  badge: string;
  description: string;
  testCases: TestCase[];
  sampleSolution: string;
}

interface ProjectWorkspaceProps {
  projects: ProjectData[];
  missionId: number;
  caseId: string;
  onCompleted?: () => void;
}

export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  projects,
  missionId,
  caseId,
  onCompleted
}) => {
  const storageKey = `project:${missionId}:${caseId}`;

  const [selectedProjectId, setSelectedProjectId] = useState<'A' | 'B' | 'C'>('A');
  const [userCode, setUserCode] = useState<Record<string, string>>({
    A: '',
    B: '',
    C: ''
  });
  const [userTestResults, setUserTestResults] = useState<Record<string, Record<number, string>>>({
    A: {},
    B: {},
    C: {}
  });
  const [solutionUnlocked, setSolutionUnlocked] = useState<Record<string, boolean>>({
    A: false,
    B: false,
    C: false
  });
  const [copied, setCopied] = useState(false);

  // Restore state
  useEffect(() => {
    const saved = storage.get<{
      selectedProjectId: 'A' | 'B' | 'C';
      userCode: Record<string, string>;
      userTestResults: Record<string, Record<number, string>>;
      solutionUnlocked: Record<string, boolean>;
    } | null>(storageKey, null);

    if (saved) {
      if (saved.selectedProjectId) setSelectedProjectId(saved.selectedProjectId);
      if (saved.userCode) setUserCode(saved.userCode);
      if (saved.userTestResults) setUserTestResults(saved.userTestResults);
      if (saved.solutionUnlocked) setSolutionUnlocked(saved.solutionUnlocked);
    }
  }, [storageKey]);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const currentCode = userCode[selectedProjectId] || '';
  const currentTestResults = userTestResults[selectedProjectId] || {};
  const isUnlocked = solutionUnlocked[selectedProjectId] || false;

  const saveAll = (
    nextProjectId: 'A' | 'B' | 'C',
    nextCode: Record<string, string>,
    nextResults: Record<string, Record<number, string>>,
    nextUnlocked: Record<string, boolean>
  ) => {
    storage.set(storageKey, {
      selectedProjectId: nextProjectId,
      userCode: nextCode,
      userTestResults: nextResults,
      solutionUnlocked: nextUnlocked
    });
  };

  const handleCodeChange = (text: string) => {
    const updated = { ...userCode, [selectedProjectId]: text };
    setUserCode(updated);
    saveAll(selectedProjectId, updated, userTestResults, solutionUnlocked);

    if (text.trim().length > 10) {
      storage.markCaseCompleted(missionId, caseId);
      onCompleted?.();
    }
  };

  const handleTestResultChange = (tIdx: number, val: string) => {
    const updated = {
      ...userTestResults,
      [selectedProjectId]: {
        ...(userTestResults[selectedProjectId] || {}),
        [tIdx]: val
      }
    };
    setUserTestResults(updated);
    saveAll(selectedProjectId, userCode, updated, solutionUnlocked);
    storage.markCaseCompleted(missionId, caseId);
    onCompleted?.();
  };

  const handleUnlockSolution = () => {
    if (!currentCode.trim()) {
      const confirmOpen = window.confirm(
        'Kamu belum menuliskan kode di editor. Kami sangat menyarankan mencoba menuliskan logika terlebih dahulu di editor atau compiler online. Tetap ingin membuka contoh solusi?'
      );
      if (!confirmOpen) return;
    }

    const updated = { ...solutionUnlocked, [selectedProjectId]: true };
    setSolutionUnlocked(updated);
    saveAll(selectedProjectId, userCode, userTestResults, updated);
    storage.markCaseCompleted(missionId, caseId);
    onCompleted?.();
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-8">
      {/* Project Selector Tabs */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            Pilih 1 dari 3 Proyek yang Ingin Kamu Kerjakan:
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Bebas memilih topik
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {projects.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => {
                  setSelectedProjectId(proj.id);
                  saveAll(proj.id, userCode, userTestResults, solutionUnlocked);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all touch-target cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/15'
                    : 'bg-black/40 border-cyan-500/20 text-slate-300 hover:text-white hover:border-cyan-500/40'
                }`}
              >
                <div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/60 text-cyan-300 border border-cyan-500/30 uppercase inline-block mb-1.5">
                    {proj.badge}
                  </span>
                  <h4 className="font-orbitron font-bold text-sm sm:text-base">
                    {proj.title}
                  </h4>
                </div>
                <div className="mt-2 text-xs font-mono text-cyan-400 flex items-center gap-1">
                  <span>{isSelected ? 'Sedang Dipilih' : 'Pilih Proyek'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Project Details */}
      <div className="p-4 sm:p-5 rounded-xl bg-black/50 border border-cyan-500/25 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
            PROYEK {activeProject.id}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white font-orbitron">
            {activeProject.title}
          </h3>
        </div>
        <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
          {activeProject.description}
        </p>
      </div>

      {/* Test Cases Table */}
      <div className="mb-6">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 mb-2">
          Tabel Data Uji (Verifikasi di Compiler Online):
        </h4>
        <div className="overflow-x-auto rounded-xl border border-cyan-500/20 bg-black/60 shadow-inner">
          <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-cyan-950/40 border-b border-cyan-500/20 text-cyan-300">
                <th className="py-2.5 px-3">No</th>
                <th className="py-2.5 px-3">Data Input</th>
                <th className="py-2.5 px-3">Output yang Diharapkan</th>
                <th className="py-2.5 px-3">Hasil Programku (Ketik Temuanmu)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10">
              {activeProject.testCases.map((tc, idx) => (
                <tr key={idx} className="hover:bg-cyan-500/5">
                  <td className="py-2.5 px-3 text-slate-400 font-bold">{idx + 1}</td>
                  <td className="py-2.5 px-3 text-slate-100 whitespace-pre">{tc.input}</td>
                  <td className="py-2.5 px-3 text-emerald-300 font-bold whitespace-pre">{tc.expectedOutput}</td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={currentTestResults[idx] || ''}
                      onChange={(e) => handleTestResultChange(idx, e.target.value)}
                      placeholder="Ketik hasil yang keluar di compilermu..."
                      className="w-full bg-black/80 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400 touch-target"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Writing Editor Area */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            Editor Rancangan Kode C++ (Ketik kodemu di sini):
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCode}
              disabled={!currentCode.trim()}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-300 text-xs border border-cyan-500/25 touch-target cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-sans">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="font-sans">Salin Kode</span>
                </>
              )}
            </button>
            <OnlineCompilerButton compact label="Jalankan di Compiler Online" />
          </div>
        </div>

        <textarea
          rows={10}
          value={currentCode}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder={`// Tuliskan rancangan kode C++ lengkap untuk Proyek ${activeProject.id} di sini...\n// Setelah itu, salin dan jalankan di OnlineGDB atau Programiz!\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Kodingmu di sini\n\n    return 0;\n}`}
          className="w-full bg-[#050a17] border border-cyan-500/30 rounded-xl p-4 font-mono text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 touch-target"
        />
        <div className="mt-1 text-[11px] text-slate-500 font-mono">
          *Web ini bukan compiler; jalankan kodenya di tab OnlineGDB / Programiz untuk membuktikannya.
        </div>
      </div>

      {/* Solution Reveal Section */}
      <div className="pt-4 border-t border-cyan-500/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white font-orbitron">
              Contoh Solusi Detektif
            </h4>
            <p className="text-xs text-slate-400">
              Ada banyak cara benar. Yang penting programmu menghasilkan jawaban yang benar untuk semua data uji.
            </p>
          </div>

          {!isUnlocked ? (
            <button
              type="button"
              onClick={handleUnlockSolution}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-purple-600/30 touch-target cursor-pointer shrink-0"
            >
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span>Saya Sudah Mencoba, Tampilkan Contoh Solusi</span>
            </button>
          ) : (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Solusi Terbuka</span>
            </span>
          )}
        </div>

        {isUnlocked && (
          <div className="animate-fadeIn mt-3">
            <CodeViewer
              code={activeProject.sampleSolution}
              title={`CONTOH SOLUSI PROYEK ${activeProject.id}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
