import React from 'react';
import { Search, ExternalLink, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FOOTER_CREDIT = {
  creator: 'Dimas BN',
  tagline: 'Belajar • Berbagi • Berkarya • Menginspirasi',
  url: 'https://www.dimasbn.my.id/'
};

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-cyan-500/15 bg-[#040813] py-10 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center">
              <Search className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="font-orbitron font-bold text-slate-200">
                Detektif Kode C++
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Metode Investigasi Koding untuk Siswa SMA Kelas XI (Prediksi, Jalankan, Selidiki, Modifikasi, Buat)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono">
            <Link to="/peta-misi" className="hover:text-cyan-300 transition-colors">
              Peta Misi (1-10)
            </Link>
            <Link to="/catatan" className="hover:text-cyan-300 transition-colors">
              Buku Catatan Detektif
            </Link>
            <Link to="/panduan" className="hover:text-cyan-300 transition-colors">
              Panduan Compiler Online
            </Link>
            <a
              href="https://www.onlinegdb.com/online_c++_compiler"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>OnlineGDB</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Semua progres tersimpan otomatis di perangkat browser lokal. Tanpa akun, tanpa batas waktu.
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span>Dibuat oleh</span>
            <a
              href={FOOTER_CREDIT.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-cyan-300 hover:text-cyan-100 underline underline-offset-4 flex items-center gap-0.5"
            >
              <span>{FOOTER_CREDIT.creator}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-500">•</span>
            <span className="text-purple-300 italic">{FOOTER_CREDIT.tagline}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
