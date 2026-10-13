import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ArrowRight, CheckCircle2, Clock, CircleDot, ShieldCheck } from 'lucide-react';
import { MISSIONS } from '../data/missions';
import { storage } from '../utils/storage';

export const MissionList: React.FC = () => {
  const getProgress = (id: number) => {
    return storage.getCompletedCases(id).length;
  };

  const totalDone = MISSIONS.filter((m) => getProgress(m.id) >= m.caseCount).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
            <Map className="w-4 h-4" />
            <span>Peta Investigasi Lengkap</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-orbitron tracking-tight mb-2">
            10 Misi Detektif Kode C++
          </h1>
          <p className="text-slate-300 text-base max-w-2xl leading-relaxed">
            Semua misi terbuka bebas dan tidak dikunci. Kamu boleh memilih dan menyelidiki topik kasus mana pun secara fleksibel.
          </p>
        </div>

        <div className="bg-black/50 border border-cyan-500/20 px-4 py-2.5 rounded-xl self-center sm:self-auto flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <div className="text-left font-mono">
            <span className="text-[11px] text-slate-400 block uppercase">Progres Keseluruhan</span>
            <span className="text-sm font-bold text-white">
              {totalDone} dari 10 Misi Selesai
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 10 Missions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MISSIONS.map((mission) => {
          const completedCases = getProgress(mission.id);
          const isFinished = completedCases >= mission.caseCount;
          const isInProgress = completedCases > 0 && !isFinished;

          let statusBadge = (
            <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
              <CircleDot className="w-3.5 h-3.5 text-slate-500" />
              <span>Belum Dikerjakan</span>
            </span>
          );

          if (isFinished) {
            statusBadge = (
              <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40 font-bold shadow-sm shadow-emerald-500/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Misi Selesai</span>
              </span>
            );
          } else if (isInProgress) {
            statusBadge = (
              <span className="flex items-center gap-1.5 text-xs font-mono text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/40">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Sedang Dikerjakan ({completedCases}/{mission.caseCount})</span>
              </span>
            );
          }

          return (
            <Link
              key={mission.id}
              to={`/misi/${mission.id}`}
              className={`glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between group touch-target transition-all ${
                isFinished ? 'border-emerald-500/30' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    MISI {mission.id}
                  </span>
                  {statusBadge}
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors font-orbitron mb-1">
                  {mission.title}
                </h3>
                <div className="text-xs font-mono text-purple-400 font-semibold mb-3">
                  {mission.subtitle}
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {mission.description}
                </p>
              </div>

              <div className="pt-4 border-t border-cyan-500/15 flex items-center justify-between">
                <div className="text-xs font-mono text-slate-400">
                  <span>{completedCases} dari {mission.caseCount} kasus terjawab</span>
                </div>

                <div className="text-cyan-400 group-hover:text-cyan-200 flex items-center gap-1 text-sm font-semibold font-mono">
                  <span>Buka Kasus</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
