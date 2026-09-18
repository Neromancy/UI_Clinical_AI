import React from 'react';
import { LLMAnalysis } from '../../types';
import {
  BrainCircuit,
  Award,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Gauge,
  Sparkles,
} from 'lucide-react';

interface AnalysisCardProps {
  analysis: LLMAnalysis;
  showRawJsonToggle?: boolean;
  className?: string;
  isLecturerView?: boolean;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({
  analysis,
  showRawJsonToggle = true,
  className = '',
  isLecturerView = true,
}) => {
  const [showJson, setShowJson] = React.useState(false);

  // Confidence category
  const confidencePercent = Math.round(analysis.confidence * 100);

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-xs ${className}`}
    >
      {/* Header with advisory disclaimer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              AI Diagnostic Analysis (RAG-Assisted)
            </h4>
            <span className="text-xs text-slate-500">
              Model: {analysis.modelUsed} • {analysis.processingTimeMs}ms
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
            Advisory Only
          </span>
          {showRawJsonToggle && (
            <button
              type="button"
              onClick={() => setShowJson(!showJson)}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              {showJson ? 'Hide Raw JSON' : 'Inspect JSON'}
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row: Percentage, Tier, Confidence */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Score Percentage */}
        <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
          <div className="text-xs text-slate-500 font-medium mb-1">Conceptual Score</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {analysis.percentageScore}%
            </span>
            <span className="text-xs text-slate-500">/ 100%</span>
          </div>
        </div>

        {/* Diagnostic Tier */}
        <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
          <div className="text-xs text-slate-500 font-medium mb-1">Diagnostic Tier</div>
          <span className="inline-block text-xs font-semibold px-2 py-1 rounded bg-indigo-100 text-indigo-800">
            {analysis.tierName}
          </span>
        </div>

        {/* Model Confidence */}
        <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
          <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            <span>AI Confidence</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all"
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-700">
              {confidencePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Explanation */}
      <div className="mb-4">
        <h5 className="text-xs uppercase font-semibold tracking-wider text-slate-500 mb-1.5">
          Clinical Reasoning Summary
        </h5>
        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
          {analysis.explanation}
        </p>
      </div>

      {/* Detected Misconceptions */}
      {analysis.detectedMisconceptions.length > 0 && (
        <div className="mb-4">
          <h5 className="text-xs uppercase font-semibold tracking-wider text-rose-700 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Detected Misconceptions ({analysis.detectedMisconceptions.length})</span>
          </h5>
          <div className="space-y-2">
            {analysis.detectedMisconceptions.map((misc, idx) => (
              <div
                key={`${misc.id || 'misc'}-${idx}`}
                className="rounded-lg border border-rose-200 bg-rose-50/60 p-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-rose-900">{misc.label}</span>
                  {misc.isNewCandidate && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-semibold text-[10px]">
                      LLM Candidate Discovery
                    </span>
                  )}
                </div>
                <div className="italic text-slate-600 mb-1">
                  Student Quote: {misc.evidenceQuote}
                </div>
                <div className="text-rose-800">
                  <span className="font-semibold">Correction:</span> {misc.clinicalCorrection}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concept Indicator Breakdown */}
      {analysis.conceptScores && analysis.conceptScores.length > 0 && (
        <div className="mb-4">
          <h5 className="text-xs uppercase font-semibold tracking-wider text-slate-500 mb-2">
            Concept Indicators & Weight Contribution
          </h5>
          <div className="space-y-1.5">
            {analysis.conceptScores.map((c, idx) => (
              <div
                key={`${c.indicatorId || 'concept'}-${idx}`}
                className="flex items-center justify-between gap-2 p-2 rounded bg-slate-50 text-xs border border-slate-100"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 ${
                      c.score >= c.weight * 0.7 ? 'text-emerald-600' : 'text-amber-500'
                    }`}
                  />
                  <span className="text-slate-800 truncate" title={c.label}>
                    {c.label}
                  </span>
                </div>
                <div className="text-slate-600 font-mono shrink-0">
                  <span className="font-bold text-slate-900">{c.score.toFixed(2)}</span> /{' '}
                  <span>{c.weight.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Remediation Materials */}
      {analysis.suggestedMaterials.length > 0 && (
        <div>
          <h5 className="text-xs uppercase font-semibold tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Suggested RAG References</span>
          </h5>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
            {analysis.suggestedMaterials.map((mat, i) => (
              <li key={i} className="truncate" title={mat}>
                {mat}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Raw JSON viewer */}
      {showJson && (
        <div className="mt-4 p-3 rounded-lg bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto">
          <pre>{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
