import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Map, BookOpen, Terminal, Menu, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { storage } from '../utils/storage';
import { MISSIONS } from '../data/missions';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Calculate completed missions count (out of 10)
  const calculateTotalProgress = () => {
    let completedCount = 0;
    MISSIONS.forEach((m) => {
      const doneCases = storage.getCompletedCases(m.id);
      if (m.isAvailable && doneCases.length >= m.caseCount) {
        completedCount++;
      }
    });
    return completedCount;
  };

  const completedMissions = calculateTotalProgress();
  const progressPercent = Math.round((completedMissions / 10) * 100);

  const navLinks = [
    { to: '/', label: 'Beranda', icon: Search },
    { to: '/peta-misi', label: 'Peta Misi', icon: Map },
    { to: '/catatan', label: 'Buku Catatan', icon: BookOpen },
    { to: '/panduan', label: 'Panduan Compiler', icon: Terminal }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#060b18]/90 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2.5 group touch-target">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-[#b026ff] p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#060b18] rounded-[10px] flex items-center justify-center">
                <Search className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
              </div>
            </div>
            <div>
              <span className="font-orbitron font-extrabold text-base sm:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-[#b026ff]">
                DETEKTIF KODE
              </span>
              <span className="ml-1.5 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                C++
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all touch-target ${
                    active
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Global Progress Indicator */}
          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-cyan-500/20">
            <div className="text-right">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Progres Misi
              </div>
              <div className="text-xs font-mono font-bold text-cyan-300">
                {completedMissions} / 10 Selesai
              </div>
            </div>
            <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden border border-cyan-500/20">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-[#b026ff] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <div className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-500/30">
              {completedMissions}/10
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-200 hover:text-cyan-400 border border-cyan-500/30 touch-target cursor-pointer"
              aria-label="Buka menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Global Progress Bar (Mobile Line) */}
      <div className="w-full bg-slate-900 h-1 overflow-hidden sm:hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-[#b026ff]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-cyan-500/20 bg-[#070e20]/95 backdrop-blur-2xl px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all touch-target ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 mt-2 border-t border-cyan-500/15 flex items-center justify-between text-xs font-mono text-slate-400 px-2">
            <span>Investigasi Detektif Kelas XI SMA</span>
            <span className="text-cyan-300 font-bold">{completedMissions} dari 10 misi</span>
          </div>
        </div>
      )}
    </header>
  );
};
