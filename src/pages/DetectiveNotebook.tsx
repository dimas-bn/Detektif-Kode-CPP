import React, { useState, useEffect } from 'react';
import { BookOpen, Download, Trash2, CheckCircle2, XCircle, PenLine, AlertTriangle, ShieldCheck, Filter, User, Sparkles } from 'lucide-react';
import { storage } from '../utils/storage';
import { MISSIONS } from '../data/missions';

export const DetectiveNotebook: React.FC = () => {
  const [studentName, setStudentName] = useState<string>('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'predictions' | 'reflections' | 'tf' | 'notes'>('all');
  const [selectedMission, setSelectedMission] = useState<number | 'all'>('all');
  const [showClearModal, setShowClearModal] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  // Free notes per mission
  const [missionNotes, setMissionNotes] = useState<Record<number, string>>({});

  // Reload data
  useEffect(() => {
    setStudentName(storage.getStudentName());

    const notes: Record<number, string> = {};
    for (let m = 1; m <= 10; m++) {
      const saved = storage.get<{ text: string } | null>(`freenote:${m}`, null);
      if (saved && saved.text) {
        notes[m] = saved.text;
      }
    }
    setMissionNotes(notes);
  }, [dataVersion]);

  const handleNameChange = (val: string) => {
    setStudentName(val);
    storage.setStudentName(val);
    if (val.trim()) {
      setNameError(null);
    }
  };

  const allStorage = storage.getAllWithPrefix();

  // Extract predictions
  const predictions: Array<{
    missionId: number;
    caseId: string;
    title: string;
    userGuess: string;
    actualOutput: string;
    status: 'same' | 'missed';
    timestamp: number;
  }> = [];

  // Extract reflections
  const reflections: Array<{
    missionId: number;
    caseId: string;
    prompt: string;
    noteText: string;
    timestamp: number;
  }> = [];

  // Extract TrueFalse reasons
  const tfReasons: Array<{
    missionId: number;
    caseId: string;
    statement: string;
    userChoice: boolean;
    isCorrect: boolean;
    reason: string;
    timestamp: number;
  }> = [];

  Object.entries(allStorage).forEach(([key, val]) => {
    if (key.startsWith('prediction:') && val) {
      predictions.push(val);
    } else if (key.startsWith('reflection:') && val) {
      reflections.push(val);
    } else if (key.startsWith('tf_reason:') && val) {
      tfReasons.push(val);
    }
  });

  // Sort by timestamp desc
  predictions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  reflections.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  tfReasons.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  // Filtered by mission
  const filteredPredictions = selectedMission === 'all'
    ? predictions
    : predictions.filter((p) => p.missionId === selectedMission);

  const filteredReflections = selectedMission === 'all'
    ? reflections
    : reflections.filter((r) => r.missionId === selectedMission);

  const filteredTFReasons = selectedMission === 'all'
    ? tfReasons
    : tfReasons.filter((t) => t.missionId === selectedMission);

  // Completed missions count
  const completedMissionsCount = MISSIONS.filter((m) => {
    const done = storage.getCompletedCases(m.id);
    return done.length >= m.caseCount;
  }).length;

  const handleFreeNoteChange = (mId: number, text: string) => {
    setMissionNotes((prev) => ({ ...prev, [mId]: text }));
    storage.saveFreeNote(mId, text);
  };

  const handleDownloadTxt = () => {
    if (!studentName.trim()) {
      setNameError('Nama siswa wajib diisi di bagian atas sebelum mengunduh berkas catatan!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const textContent = storage.exportNotebookAsText();
    const cleanFilename = studentName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Catatan_Detektif_CPP_${cleanFilename}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    storage.clearAllDkcData();
    setShowClearModal(false);
    setStudentName('');
    setDataVersion((v) => v + 1);
  };

  const sameCount = predictions.filter((p) => p.status === 'same').length;
  const missedCount = predictions.filter((p) => p.status === 'missed').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Student Name Card (Mandatory before download) */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-8 border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 to-purple-950/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <label htmlFor="student-name-input" className="text-sm font-bold font-orbitron text-white block">
                Identitas Siswa Detektif (Wajib untuk Unduh Laporan):
              </label>
              <span className="text-xs text-slate-400">
                Nama ini akan dicantumkan di kepala berkas laporan .txt untuk diserahkan ke guru.
              </span>
            </div>
          </div>

          <div className="w-full sm:w-72">
            <input
              id="student-name-input"
              type="text"
              value={studentName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ketik Nama Lengkap Anda..."
              className={`w-full bg-black/60 border rounded-xl px-3.5 py-2 text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none touch-target transition-all ${
                nameError
                  ? 'border-rose-500 ring-2 ring-rose-500/30'
                  : 'border-cyan-500/40 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
              }`}
            />
            {nameError && (
              <span className="text-xs text-rose-400 mt-1 block font-medium">
                {nameError}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-purple-400 mb-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Dokumen Portofolio Investigasi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-orbitron tracking-tight">
            Buku Catatan Detektif
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-1">
            Rekam jejak seluruh hipotesis, tebakan kode, refleksi temuan, dan catatan bebas belajarmu.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/20 transition-all touch-target cursor-pointer font-orbitron"
          >
            <Download className="w-4 h-4" />
            <span>Unduh sebagai .txt</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-500/30 text-sm font-semibold transition-all touch-target cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Semua Data</span>
          </button>
        </div>
      </div>

      {/* Summary Stats (Sederhana, Bukan Nilai/Ranking) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="glass-panel rounded-xl p-4">
          <span className="text-xs font-mono text-slate-400 uppercase block">Total Prediksi</span>
          <span className="text-2xl font-mono font-black text-white">{predictions.length}</span>
        </div>
        <div className="glass-panel rounded-xl p-4 border-amber-500/30">
          <span className="text-xs font-mono text-amber-400 uppercase block">Tebakan Meleset</span>
          <span className="text-2xl font-mono font-black text-amber-300">{missedCount}</span>
        </div>
        <div className="glass-panel rounded-xl p-4 border-purple-500/30">
          <span className="text-xs font-mono text-purple-400 uppercase block">Refleksi Terisi</span>
          <span className="text-2xl font-mono font-black text-purple-300">{reflections.length}</span>
        </div>
        <div className="glass-panel rounded-xl p-4 border-emerald-500/30">
          <span className="text-xs font-mono text-emerald-400 uppercase block">Misi Selesai</span>
          <span className="text-2xl font-mono font-black text-emerald-300">{completedMissionsCount} / 10</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-black/40 p-3 rounded-xl border border-cyan-500/20">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'Semua Catatan' },
            { id: 'predictions', label: 'Tebakan & Prediksi' },
            { id: 'reflections', label: 'Refleksi Temuan' },
            { id: 'tf', label: 'Alasan Benar/Salah' },
            { id: 'notes', label: 'Catatan Bebas' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all touch-target cursor-pointer ${
                activeTab === t.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={selectedMission}
            onChange={(e) => setSelectedMission(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))}
            className="bg-[#091226] border border-cyan-500/30 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 touch-target"
          >
            <option value="all">Semua Misi (1-10)</option>
            {MISSIONS.map((m) => (
              <option key={m.id} value={m.id}>
                Misi {m.id}: {m.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Sections */}

      {/* 1. Predictions list */}
      {(activeTab === 'all' || activeTab === 'predictions') && (
        <div className="mb-10">
          <h3 className="text-xl font-bold text-white font-orbitron mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
            <span>Hasil Investigasi & Tebakan Kasus</span>
          </h3>

          {filteredPredictions.length === 0 ? (
            <div className="glass-panel rounded-xl p-6 text-center text-slate-400 text-sm italic">
              Belum ada data tebakan kasus yang disimpan pada misi ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPredictions.map((p, idx) => (
                <div
                  key={`${p.missionId}-${p.caseId}-${idx}`}
                  className="glass-panel rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        MISI {p.missionId}
                      </span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                        p.status === 'same'
                          ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/30'
                          : 'text-amber-300 bg-amber-950/60 border border-amber-500/30'
                      }`}>
                        {p.status === 'same' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-amber-400" />}
                        {p.status === 'same' ? 'Tepat' : 'Meleset'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-100 mb-3">
                      {p.title}
                    </h4>

                    <div className="space-y-2 text-xs font-mono mb-2">
                      <div className="bg-black/50 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase">Tebakanmu:</span>
                        <span className="text-slate-200">{p.userGuess || '(kosong)'}</span>
                      </div>
                      <div className="bg-cyan-950/30 p-2 rounded border border-cyan-500/20">
                        <span className="text-cyan-400 block text-[10px] uppercase">Hasil Sebenarnya:</span>
                        <span className="text-cyan-200 font-bold">{p.actualOutput}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. TrueFalse Reasons list */}
      {(activeTab === 'all' || activeTab === 'tf') && (
        <div className="mb-10">
          <h3 className="text-xl font-bold text-white font-orbitron mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span>Alasan Siswa pada Uji Benar / Salah</span>
          </h3>

          {filteredTFReasons.length === 0 ? (
            <div className="glass-panel rounded-xl p-6 text-center text-slate-400 text-sm italic">
              Belum ada alasan uji Benar/Salah yang dicatat. Jawab pernyataan pada Misi 9!
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTFReasons.map((tf, idx) => (
                <div key={idx} className="glass-panel rounded-xl p-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      MISI {tf.missionId} &bull; UJI BENAR/SALAH
                    </span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      tf.isCorrect ? 'text-emerald-300 bg-emerald-950/80' : 'text-rose-300 bg-rose-950/80'
                    }`}>
                      Jawabanmu: {tf.userChoice ? 'BENAR' : 'SALAH'} ({tf.isCorrect ? 'Tepat' : 'Meleset'})
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2">
                    {tf.statement}
                  </h4>
                  <div className="text-xs text-slate-300 bg-black/50 p-2.5 rounded-lg border border-slate-800 font-sans">
                    <strong>Alasan Pribadimu:</strong> {tf.reason || <span className="text-slate-500 italic">(tidak menuliskan alasan)</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Reflections list */}
      {(activeTab === 'all' || activeTab === 'reflections') && (
        <div className="mb-10">
          <h3 className="text-xl font-bold text-white font-orbitron mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
            <span>Refleksi & Temuan Detektif</span>
          </h3>

          {filteredReflections.length === 0 ? (
            <div className="glass-panel rounded-xl p-6 text-center text-slate-400 text-sm italic">
              Belum ada refleksi yang kamu tulis pada misi ini.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReflections.map((r, idx) => (
                <div
                  key={`${r.missionId}-${r.caseId}-${idx}`}
                  className="glass-panel glass-panel-magenta rounded-xl p-4 sm:p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                      MISI {r.missionId}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {r.timestamp ? new Date(r.timestamp).toLocaleDateString('id-ID') : ''}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-semibold text-slate-200 mb-2.5">
                    {r.prompt}
                  </h4>

                  <div className="p-3 bg-black/60 rounded-xl border border-purple-500/20 text-slate-100 text-sm leading-relaxed font-sans">
                    {r.noteText || <span className="text-slate-500 italic">(kosong)</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Free Notes per mission */}
      {(activeTab === 'all' || activeTab === 'notes') && (
        <div className="mb-10">
          <h3 className="text-xl font-bold text-white font-orbitron mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 inline-block" />
            <span>Catatan Bebas per Misi</span>
          </h3>

          <div className="space-y-5">
            {MISSIONS.filter((m) => selectedMission === 'all' || m.id === selectedMission).map((m) => (
              <div key={m.id} className="glass-panel rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      Misi {m.id}
                    </span>
                    <span className="text-sm font-bold text-white">{m.title}</span>
                  </div>
                  <PenLine className="w-4 h-4 text-slate-500" />
                </div>

                <textarea
                  rows={2}
                  value={missionNotes[m.id] || ''}
                  onChange={(e) => handleFreeNoteChange(m.id, e.target.value)}
                  placeholder={`Tuliskan catatan bebas atau pengingat khusus untuk Misi ${m.id}...`}
                  className="w-full bg-black/50 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 touch-target"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 border-rose-500/40 bg-[#091226]">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold font-orbitron text-white">
                Hapus Semua Data Progres?
              </h3>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Tindakan ini akan menghapus seluruh data tebakan, jawaban refleksi, catatan bebas, nama siswa, dan status penyelesaian misi yang tersimpan di browser ini. Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold touch-target cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-md shadow-rose-600/30 touch-target cursor-pointer"
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
