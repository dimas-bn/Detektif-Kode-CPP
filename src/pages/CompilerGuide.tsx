import React from 'react';
import { Terminal, ExternalLink, Lightbulb, Play, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { OnlineCompilerButton } from '../components/OnlineCompilerButton';

export const CompilerGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
          <Terminal className="w-4 h-4" />
          <span>Buku Petunjuk Lapangan</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-orbitron tracking-tight mb-3">
          Panduan Menggunakan Compiler Online
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Aplikasi Detektif Kode bukanlah compiler. Untuk membuktikan hipotesis dan menguji kode yang kamu temukan, gunakan compiler nyata di bawah ini secara gratis tanpa perlu menginstal aplikasi apa pun.
        </p>
      </div>

      {/* Gold Detective Rule Banner */}
      <div className="glass-panel glass-panel-magenta rounded-2xl p-6 mb-8 border-purple-500/40 bg-purple-950/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 shrink-0">
            <Lightbulb className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-orbitron mb-1">
              Aturan Emas Detektif: Ketik Sendiri, Jangan Salin-Tempel!
            </h3>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Meskipun ada tombol "Salin Kode", biasakan untuk <strong>mengetik ulang kode huruf demi huruf</strong> di tab compiler. Mengetik langsung melatih memori otot jari Anda untuk mengenali titik koma (;), tanda kurung kurawal ({ }), huruf besar-kecil (case-sensitive), dan operator C++.
            </p>
          </div>
        </div>
      </div>

      {/* Choice of 2 Online Compilers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* OnlineGDB Card */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PILIHAN 1
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Direkomendasikan untuk cin
              </span>
            </div>
            <h3 className="text-xl font-bold text-white font-orbitron mb-2">
              OnlineGDB C++
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Compiler paling andal untuk latihan input interaktif pengguna (<code className="text-cyan-300 font-mono">cin</code>). Memiliki panel konsol interaktif di bagian bawah layar.
            </p>
            <ol className="text-xs sm:text-sm text-slate-300 space-y-2 list-decimal list-inside mb-4">
              <li>Pilih bahasa di kanan atas: <strong>C++</strong></li>
              <li>Ketikkan kode di area editor utama.</li>
              <li>Klik tombol hijau <strong>Run</strong> (atau F9).</li>
              <li>Jika ada input keyboard, ketik langsung di jendela konsol hitam bawah lalu tekan Enter.</li>
            </ol>
          </div>

          <a
            href="https://www.onlinegdb.com/online_c++_compiler"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 touch-target cursor-pointer"
          >
            <span>Buka OnlineGDB</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Programiz Card */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PILIHAN 2
              </span>
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                Tampilan Modern & Cepat
              </span>
            </div>
            <h3 className="text-xl font-bold text-white font-orbitron mb-2">
              Programiz C++ Compiler
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Antarmuka sangat bersih dan responsif, sangat cocok untuk ponsel dan tablet. Menampilkan editor di kiri dan output instan di kanan.
            </p>
            <ol className="text-xs sm:text-sm text-slate-300 space-y-2 list-decimal list-inside mb-4">
              <li>Buka halaman dan ketikkan kodemu di editor kiri.</li>
              <li>Tekan tombol biru <strong>Run</strong> di bagian atas.</li>
              <li>Lihat hasil eksekusi program di panel Output di sebelah kanan.</li>
            </ol>
          </div>

          <a
            href="https://www.programiz.com/cpp-programming/online-compiler/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 touch-target cursor-pointer"
          >
            <span>Buka Programiz C++</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Common Debugging Checklist */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white font-orbitron mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-cyan-400" />
          <span>Tips Detektif Menghadapi Error Compiler</span>
        </h3>

        <div className="space-y-3 text-sm text-slate-200">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-black/40 border border-slate-800">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Periksa Titik Koma (;)</strong>: Apakah ada instruksi baris yang lupa diberi titik koma di ujungnya? Ingat, compiler sering menunjuk baris di bawahnya!
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-black/40 border border-slate-800">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Huruf Besar dan Kecil</strong>: C++ sangat case-sensitive. <code className="text-cyan-300 font-mono">Main</code> berbeda dengan <code className="text-cyan-300 font-mono">main</code>, dan <code className="text-cyan-300 font-mono">Cout</code> tidak sama dengan <code className="text-cyan-300 font-mono">cout</code>.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-black/40 border border-slate-800">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Arah Tanda Panah I/O</strong>: Aliran input menggunakan panah ke kanan (<code className="text-cyan-300 font-mono">cin &gt;&gt; var;</code>), sedangkan aliran output menggunakan panah ke kiri (<code className="text-cyan-300 font-mono">cout &lt;&lt; var;</code>).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
