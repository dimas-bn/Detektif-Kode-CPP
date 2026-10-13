import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { highlightCppLine } from '../utils/cppTokenizer';

interface CodeViewerProps {
  code: string;
  title?: string;
  highlightLines?: number[];
  startLineNumber?: number;
  className?: string;
  maxHeight?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  title,
  highlightLines = [],
  startLineNumber = 1,
  className = '',
  maxHeight
}) => {
  const [copied, setCopied] = useState(false);

  const lines = code.trimEnd().split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin:', err);
    }
  };

  const renderToken = (type: string, text: string, idx: number) => {
    switch (type) {
      case 'keyword':
        return <span key={idx} className="text-[#b026ff] font-semibold">{text}</span>;
      case 'type':
        return <span key={idx} className="text-[#00e5ff] font-semibold">{text}</span>;
      case 'io':
        return <span key={idx} className="text-cyan-300 font-medium">{text}</span>;
      case 'string':
        return <span key={idx} className="text-emerald-300">{text}</span>;
      case 'number':
        return <span key={idx} className="text-amber-300 font-mono">{text}</span>;
      case 'comment':
        return <span key={idx} className="text-slate-400 italic">{text}</span>;
      case 'preprocessor':
        return <span key={idx} className="text-pink-400 font-semibold">{text}</span>;
      case 'operator':
        return <span key={idx} className="text-cyan-400 font-bold">{text}</span>;
      default:
        return <span key={idx} className="text-slate-200">{text}</span>;
    }
  };

  return (
    <div className={`rounded-xl border border-cyan-500/20 bg-[#070e20]/90 backdrop-blur-md overflow-hidden shadow-lg ${className}`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-cyan-500/15 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          {title && (
            <span className="text-xs uppercase tracking-wider text-cyan-400/80 font-mono font-medium ml-2">
              {title}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 hover:text-cyan-100 border border-cyan-500/30 transition-all touch-target cursor-pointer"
          title="Salin Kode"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-sans">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-sans">Salin</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div
        className="overflow-x-auto p-3.5 text-sm font-mono leading-relaxed"
        style={{ maxHeight: maxHeight || 'none' }}
      >
        <pre className="m-0 p-0">
          {lines.map((line, index) => {
            const lineNum = startLineNumber + index;
            const isHighlighted = highlightLines.includes(lineNum);
            const tokens = highlightCppLine(line);

            return (
              <div
                key={index}
                className={`flex items-start rounded px-1.5 py-0.5 transition-colors ${
                  isHighlighted
                    ? 'bg-cyan-500/15 border-l-2 border-cyan-400'
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                <span className="w-8 shrink-0 text-right pr-3 select-none text-slate-500 text-xs font-mono">
                  {lineNum}
                </span>
                <span className="flex-1 whitespace-pre">
                  {tokens.map((t, tIdx) => renderToken(t.type, t.text, tIdx))}
                </span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};
