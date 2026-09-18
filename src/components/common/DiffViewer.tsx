import React from 'react';
import { StructuredDiff } from '../../types';
import { GitCompare, ArrowRight, Check, AlertCircle } from 'lucide-react';

interface DiffViewerProps {
  diff?: StructuredDiff;
  className?: string;
  emptyMessage?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  diff,
  className = '',
  emptyMessage = 'No differences: Lecturer validated the AI analysis with exact agreement (stored as few-shot candidate).',
}) => {
  if (!diff || Object.keys(diff).length === 0) {
    return (
      <div className={`p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 ${className}`}>
        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>{emptyMessage}</span>
      </div>
    );
  }

  const hasScoreDiff = diff.score !== undefined;
  const hasTierDiff = diff.tier !== undefined;
  const hasExplanationDiff = diff.explanation !== undefined;
  const hasMisconceptionsDiff = diff.misconceptions !== undefined;

  return (
    <div className={`rounded-xl border border-indigo-200 bg-white p-4 shadow-xs ${className}`}>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 text-indigo-900 font-semibold text-xs">
        <GitCompare className="w-4 h-4 text-indigo-600" />
        <span>Audit Structured Diff (LLM Baseline vs Lecturer Validation)</span>
      </div>

      <div className="space-y-3 text-xs">
        {/* Score Diff */}
        {hasScoreDiff && (
          <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
            <span className="text-slate-600 font-medium">Conceptual Score:</span>
            <div className="flex items-center gap-2 font-mono">
              <span className="line-through text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                {diff.score?.original}%
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {diff.score?.modified}%
              </span>
            </div>
          </div>
        )}

        {/* Tier Diff */}
        {hasTierDiff && (
          <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
            <span className="text-slate-600 font-medium">Diagnostic Tier:</span>
            <div className="flex items-center gap-2">
              <span className="line-through text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                {diff.tier?.original}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {diff.tier?.modified}
              </span>
            </div>
          </div>
        )}

        {/* Explanation Diff */}
        {hasExplanationDiff && (
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-slate-600 font-medium block">Clinical Feedback Explanation:</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="p-2 rounded bg-rose-50/70 border border-rose-200 text-rose-950">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                  Original LLM Text
                </span>
                <p className="leading-relaxed">{diff.explanation?.original}</p>
              </div>
              <div className="p-2 rounded bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  Lecturer Final Text
                </span>
                <p className="leading-relaxed">{diff.explanation?.modified}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
