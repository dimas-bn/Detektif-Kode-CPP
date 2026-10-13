import React, { useState } from 'react';
import { ExternalLink, Terminal, ChevronDown } from 'lucide-react';

interface OnlineCompilerButtonProps {
  label?: string;
  className?: string;
  compact?: boolean;
}

export const OnlineCompilerButton: React.FC<OnlineCompilerButtonProps> = ({
  label = 'Jalankan di compiler online',
  className = '',
  compact = false
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const compilers = [
    {
      name: 'OnlineGDB C++',
      url: 'https://www.onlinegdb.com/online_c++_compiler',
      desc: 'Lengkap dengan jendela input konsol interaktif (cin)'
    },
    {
      name: 'Programiz C++',
      url: 'https://www.programiz.com/cpp-programming/online-compiler/',
      desc: 'Cepat & ringan, tampilan editor modern'
    }
  ];

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="flex items-center rounded-lg bg-gradient-to-r from-cyan-950/70 to-blue-950/70 border border-cyan-500/40 p-0.5 shadow-sm">
        <a
          href="https://www.onlinegdb.com/online_c++_compiler"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 ${
            compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
          } font-medium text-cyan-200 hover:text-white transition-colors cursor-pointer touch-target`}
        >
          <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{label}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>

        <button
          type="button"
          onClick={() => setOpenDropdown(!openDropdown)}
          className="px-2 py-1.5 text-cyan-400 hover:text-white hover:bg-cyan-800/40 rounded-r border-l border-cyan-500/30 transition-colors touch-target"
          aria-label="Pilih compiler lain"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {openDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpenDropdown(false)}
          />
          <div className="absolute right-0 mt-1 w-64 rounded-xl bg-[#091226] border border-cyan-500/30 shadow-xl z-50 p-2 text-left backdrop-blur-xl">
            <div className="text-[11px] font-mono tracking-wider text-cyan-400/80 px-2 py-1 uppercase font-semibold">
              Pilih Compiler Eksternal
            </div>
            {compilers.map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpenDropdown(false)}
                className="block p-2 rounded-lg hover:bg-cyan-500/10 transition-colors group"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-slate-100 group-hover:text-cyan-300">
                  <span>{c.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400 opacity-60 group-hover:opacity-100" />
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{c.desc}</div>
              </a>
            ))}
            <div className="border-t border-cyan-500/20 mt-1 pt-1.5 px-2">
              <span className="text-[11px] text-amber-300/90 italic block">
                Tips: Ketik sendiri kodenya di sana agar terbiasa dengan sintaks!
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
