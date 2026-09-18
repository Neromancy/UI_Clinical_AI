import React, { useState } from 'react';
import { Copy, Check, QrCode, Share2, Sparkles } from 'lucide-react';

interface CodeCardProps {
  code: string;
  title: string;
  topicName: string;
  subjectCode?: string;
  estimatedMinutes?: number;
  questionCount?: number;
  onCodeClick?: (code: string) => void;
}

export const CodeCard: React.FC<CodeCardProps> = ({
  code,
  title,
  topicName,
  subjectCode,
  estimatedMinutes = 30,
  questionCount = 2,
  onCodeClick,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {subjectCode && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                {subjectCode}
              </span>
            )}
            <span className="text-xs text-slate-500">{topicName}</span>
          </div>
          <h4 className="text-base font-semibold text-slate-900 leading-snug">{title}</h4>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setShowQR(!showQR)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Toggle QR Code"
            aria-label="Toggle QR Code for Student Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code display banner */}
      <div className="rounded-lg bg-slate-900 p-3.5 flex items-center justify-between text-white">
        <div>
          <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
            Student Access Code
          </div>
          <div
            onClick={() => onCodeClick && onCodeClick(code)}
            className={`font-mono text-xl font-bold tracking-widest text-emerald-400 ${
              onCodeClick ? 'cursor-pointer hover:underline' : ''
            }`}
          >
            {code}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors border border-slate-700"
          aria-label="Copy Code to Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Simulated QR Code Drawer */}
      {showQR && (
        <div className="mt-3 p-4 rounded-lg bg-slate-50 border border-slate-200 text-center animate-fadeIn">
          <div className="w-32 h-32 mx-auto bg-white border border-slate-300 p-2 rounded shadow-xs flex items-center justify-center">
            {/* SVG QR Code Pattern */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
              <rect x="10" y="10" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="17" y="17" width="11" height="11" />
              <rect x="65" y="10" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="72" y="17" width="11" height="11" />
              <rect x="10" y="65" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="17" y="72" width="11" height="11" />
              <rect x="42" y="15" width="8" height="8" />
              <rect x="42" y="32" width="15" height="6" />
              <rect x="65" y="45" width="20" height="8" />
              <rect x="40" y="60" width="10" height="25" />
              <rect x="65" y="75" width="15" height="12" />
            </svg>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Scan to directly open this question set on mobile
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span>{questionCount} Clinical Vignettes</span>
        <span>~{estimatedMinutes} mins completion</span>
      </div>
    </div>
  );
};
