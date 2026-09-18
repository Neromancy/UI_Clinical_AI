import React from 'react';
import { Subject, Submission, DiagnosticTier } from '../../../types';
import {
  FileCheck2,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  BookOpen,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface LecturerDashboardViewProps {
  subject: Subject;
  submissions: Submission[];
  tiers: DiagnosticTier[];
  onNavigateToQueue: (submissionId?: string) => void;
  onNavigateToMisconceptions: () => void;
  onNavigateToKB: () => void;
}

export const LecturerDashboardView: React.FC<LecturerDashboardViewProps> = ({
  subject,
  submissions,
  tiers,
  onNavigateToQueue,
  onNavigateToMisconceptions,
  onNavigateToKB,
}) => {
  const pendingSubmissions = submissions.filter((s) => s.status === 'PENDING_VALIDATION');
  const validatedSubmissions = submissions.filter((s) => s.status === 'VALIDATED');
  const criticalSubmissions = pendingSubmissions.filter(
    (s) => s.analysis?.tierId === 'tier-4' || (s.analysis && s.analysis.confidence < 0.75)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-semibold mb-2 border border-teal-500/30">
            <Sparkles className="w-3 h-3" />
            <span>Faculty Triage &amp; Clinical Audit Center</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, Dr. Evelyn Vance
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            Active specialty: <strong>{subject.name} ({subject.code})</strong>. 
            All AI-evaluated student submissions require clinical faculty verification before results are released.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateToQueue()}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-sm flex items-center gap-2"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Open Validation Queue ({pendingSubmissions.length})</span>
        </button>
      </div>

      {/* KPI Triage Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateToQueue()}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Pending Validation</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100">
              <FileCheck2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {pendingSubmissions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">14 min</span> mean lock duration
          </div>
        </div>

        <div
          onClick={() => onNavigateToQueue()}
          className="p-4 rounded-xl bg-white border border-rose-200 shadow-2xs hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-700 text-xs font-semibold mb-2">
            <span>High Risk / Tier-4 Alerts</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-100">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-700">
            {criticalSubmissions.length}
          </div>
          <div className="text-[11px] text-rose-600/80 mt-1">
            Clinical safety or low confidence
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Faculty Sign-Offs (Total)</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {validatedSubmissions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            100% Cryptographic verification
          </div>
        </div>

        <div
          onClick={onNavigateToMisconceptions}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Cataloged Misconceptions</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            18 <span className="text-xs font-semibold text-indigo-600 font-sans">(+3 new)</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Active across cohort responses
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Interventions & Knowledge Base Sync */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Urgent Submissions Awaiting Validation */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Priority Clinical Intervention Queue
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Top submissions requiring preceptor validation before student grade release.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToQueue()}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View All ({pendingSubmissions.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {pendingSubmissions.slice(0, 4).map((sub) => {
                const conf = sub.analysis?.confidence || 0.7;
                const isTier4 = sub.analysis?.tierId === 'tier-4';

                return (
                  <div
                    key={sub.id}
                    onClick={() => onNavigateToQueue(sub.id)}
                    className="py-3 px-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          {sub.studentName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          #{sub.id.toUpperCase()}
                        </span>
                        {isTier4 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            Safety Hazard
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600">
                        {sub.questionTitle}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Attempt #{sub.attemptNo} • Submitted 24m ago
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <div className="text-xs font-bold font-mono text-slate-900">
                          {sub.analysis?.percentageScore}%
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {Math.round(conf * 100)}% Conf
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Quick Tools & Curriculum Status */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Curriculum Grounding &amp; RAG
            </h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-slate-700 font-semibold">
                  <span>Harrison's Principles (Ch. 121)</span>
                  <span className="text-teal-700 font-mono text-[11px]">0.914 sim</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pneumonia &amp; Infiltrative Lung Disease vector index synchronized.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-slate-700 font-semibold">
                  <span>IDSA/ATS Community Pneumonia</span>
                  <span className="text-teal-700 font-mono text-[11px]">0.887 sim</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Empiric antimicrobial stewardship guidelines active.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToKB}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              <span>Manage Textbooks &amp; Vectors</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Cognitive Mastery Rubric
            </h3>
            <p className="text-xs text-slate-500">
              Tier 1 (Mastery) to Tier 4 (Critical Safety Gap) enforced across questions.
            </p>
            <div className="space-y-1.5">
              {tiers.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="font-medium text-slate-700">{t.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">{t.code} • Level {t.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
