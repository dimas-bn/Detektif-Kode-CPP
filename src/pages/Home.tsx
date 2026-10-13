import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Play, Search, RefreshCw, PenTool, ArrowRight, ShieldCheck, Sparkles, BookOpen, Award, CheckCircle2 } from 'lucide-react';
import { MISSIONS } from '../data/missions';
import { storage } from '../utils/storage';

export const Home: React.FC = () => {
  // Check completed cases across missions
  const getMissionProgress = (id: number) => {
    return storage.getCompletedCases(id).length;
  };

  const totalCompletedMissions = MISSIONS.filter(
    (m) => getMissionProgress(m.id) >= m.caseCount
  ).length;

  const allMissionsCompleted = totalCompletedMissions === 10;

  const fiveSteps = [
    {
      step: '01',
      title: 'Prediksi',
      desc: 'Tebak apa yang akan tercetak atau terjadi sebelum kode dijalankan. Melatih intuisi alur kerja mesin.',
      icon: Eye,
      accent: 'border-cyan-500/40 text-cyan-300'
    },
    {
      step: '02',
      title: 'Jalankan',
      desc: 'Buktikan tebakanmu di compiler sungguhan (OnlineGDB / Programiz). Temukan apakah tebakanmu tepat atau meleset.',
      icon: Play,
      accent: 'border-blue-500/40 text-blue-300'
    },
    {
      step: '03',
      title: 'Selidiki',
      desc: 'Bongkar alasan di balik keanehan kode. Mengapa 7 / 2 menghasilkan 3? Di mana compiler menyembunyikan bug?',
      icon: Search,
      accent: 'border-purple-500/40 text-[#b026ff]'
    },
    {
      step: '04',
      title: 'Modifikasi',
      desc: 'Ubah satu bagian kecil kode (misal hapus titik koma atau ganti int ke double) dan amati perubahan hasilnya.',
      icon: RefreshCw,
      accent: 'border-pink-500/40 text-pink-300'
    },
    {
      step: '05',
      title: 'Buat',
      desc: 'Rangkai baris-baris kode baru untuk menuntaskan tantangan pemecahan masalah secara mandiri.',
      icon: PenTool,
      accent: 'border-emerald-500/40 text-emerald-300'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-mono mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Eksplorasi C++ Interaktif Kelas XI SMA</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-5">
          Jadilah <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-[#b026ff]">Detektif Kode</span> C++
        </h1>

        <p className="text-slate-300 text-lg sm:text-xl font-normal leading-relaxed mb-8">
          Belajar koding bukan tentang menghafal rumus sintaks, melainkan menyelidiki perilaku komputer: 
          <strong> tebak lebih dulu</strong>, <strong>buktikan hasilnya</strong>, lalu <strong>selidiki alasannya</strong> jika tebakan meleset.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/misi/1"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-orbitron tracking-wider text-base flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/25 transition-all touch-target cursor-pointer"
          >
            <span>Mulai Misi 1</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/peta-misi"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-cyan-500/30 text-base font-semibold flex items-center justify-center gap-2 transition-all touch-target cursor-pointer"
          >
            <span>Buka Peta Misi (1-10)</span>
          </Link>
        </div>
      </div>

      {/* Master Badge "Detektif Kode" when all 10 missions completed */}
      {allMissionsCompleted && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 mb-12 border-emerald-500/50 bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-purple-950/40 shadow-2xl relative overflow-hidden animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 p-1 shadow-lg shadow-emerald-500/30 shrink-0">
                <div className="w-full h-full bg-[#060b18] rounded-[14px] flex items-center justify-center">
                  <Award className="w-10 h-10 text-emerald-300" />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold mb-1.5 border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>GELAR KEHORMATAN</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-orbitron">
                  Lencana Master: Detektif Kode C++
                </h3>
                <p className="text-slate-300 text-sm sm:text-base mt-1 max-w-xl">
                  Selamat! Kamu telah menyelesaikan seluruh rangkaian 10 misi investigasi C++. Buka Buku Catatan untuk mengunduh laporan portofoliomu.
                </p>
              </div>
            </div>

            <Link
              to="/catatan"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-bold font-orbitron tracking-wide text-sm shadow-lg shadow-emerald-500/20 touch-target cursor-pointer shrink-0"
            >
              Unduh Catatan Lengkap
            </Link>
          </div>
        </div>
      )}

      {/* Progress Summary Banner if user already started (and not finished all 10) */}
      {!allMissionsCompleted && totalCompletedMissions > 0 && (
        <div className="glass-panel rounded-2xl p-5 mb-12 border-cyan-500/30 bg-cyan-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-orbitron">
                Lencana Investigasi Aktif
              </h4>
              <p className="text-sm text-slate-300">
                Kamu sudah menyelesaikan <strong>{totalCompletedMissions} dari 10 misi</strong>. Catatan investigasimu aman tersimpan.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to="/catatan"
              className="px-4 py-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 text-sm font-semibold flex items-center gap-2 touch-target cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka Buku Catatan</span>
            </Link>
          </div>
        </div>
      )}

      {/* Five Step Framework Cards */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1">
            Metode Kerja Detektif
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            5 Langkah Investigasi Kode
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {fiveSteps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      FASE {st.step}
                    </span>
                    <div className={`p-2 rounded-xl bg-black/40 border ${st.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white font-orbitron mb-2">
                    {st.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of All 10 Missions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1">
              Kasus Lengkap
            </span>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              10 Kasus Investigasi C++
            </h2>
          </div>
          <Link
            to="/peta-misi"
            className="text-sm text-cyan-300 hover:text-cyan-100 flex items-center gap-1 font-mono font-semibold"
          >
            <span>Buka Peta Misi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MISSIONS.map((m) => {
            const completed = getMissionProgress(m.id);
            const isDone = completed >= m.caseCount;

            return (
              <Link
                key={m.id}
                to={`/misi/${m.id}`}
                className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between group touch-target cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      MISI {m.id}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {completed} / {m.caseCount} kasus
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-orbitron mb-1">
                    {m.title}
                  </h3>
                  <div className="text-xs font-mono text-purple-400 mb-2 font-semibold">
                    {m.subtitle}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">
                    {m.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-cyan-500/15 text-xs font-mono">
                  <span className={isDone ? 'text-emerald-400 font-bold' : completed > 0 ? 'text-amber-400' : 'text-slate-500'}>
                    {isDone ? 'Selesai' : completed > 0 ? 'Sedang Dikerjakan' : 'Belum Mulai'}
                  </span>
                  <span className="text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Buka Kasus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
