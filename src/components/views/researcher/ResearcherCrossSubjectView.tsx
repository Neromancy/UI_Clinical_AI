import React, { useState } from 'react';
import { Subject, Submission } from '../../../types';
import {
  GitCompare,
  ShieldCheck,
  Award,
  AlertTriangle,
  FileSpreadsheet,
  TrendingUp,
  BookOpen,
  Info,
} from 'lucide-react';

interface ResearcherCrossSubjectViewProps {
  subjects: Subject[];
  allSubmissions?: Submission[];
}

export const ResearcherCrossSubjectView: React.FC<ResearcherCrossSubjectViewProps> = ({
  subjects,
  allSubmissions,
}) => {
  const [primarySubjId, setPrimarySubjId] = useState(subjects[0]?.id || 'subj-cardio');
  const [secondarySubjId, setSecondarySubjId] = useState(subjects[1]?.id || 'subj-neuro');

  const primarySubj = subjects.find((s) => s.id === primarySubjId) || subjects[0];
  const secondarySubj = subjects.find((s) => s.id === secondarySubjId) || subjects[1];

  // Mock cross-subject comparative analytics
  const metrics = {
    [primarySubj.id]: {
      totalValidated: 48,
      tier1Rate: 42,
      tier2Rate: 35,
      tier3Rate: 15,
      tier4Rate: 8,
      avgScore: 79.4,
      topMisconception: 'Conflating Ejection Fraction with Diastolic Reserve (38%)',
      facultyAgreementRate: 91.2,
    },
    [secondarySubj.id]: {
      totalValidated: 36,
      tier1Rate: 47,
      tier2Rate: 31,
      tier3Rate: 14,
      tier4Rate: 8,
      avgScore: 81.2,
      topMisconception: 'Misclassifying Upper Motor Neuron Hyperreflexia as Spinal Shock (31%)',
      facultyAgreementRate: 94.4,
    },
  };

  const pData = metrics[primarySubj.id] || metrics['subj-cardio'];
  const sData = metrics[secondarySubj.id] || metrics['subj-neuro'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-0.5">
            Researcher Multi-Disciplinary Synthesis (P6.6)
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Cross-Subject Cohort Comparison
          </h2>
          <p className="text-xs text-slate-500">
            Side-by-side comparative diagnostics across isolated clinical disciplines. All student PII is irreversibly pseudonymized.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Privacy Enforced: De-Identified Salted Hashes</span>
        </div>
      </div>

      {/* Subject Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
          <label className="text-xs uppercase font-bold text-slate-500">Primary Subject A</label>
          <select
            value={primarySubjId}
            onChange={(e) => setPrimarySubjId(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
          <label className="text-xs uppercase font-bold text-slate-500">Comparison Subject B</label>
          <select
            value={secondarySubjId}
            onChange={(e) => setSecondarySubjId(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subject A Column */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase">
                {primarySubj.code}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">{primarySubj.name}</h3>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Validated Sample</div>
              <div className="text-lg font-mono font-bold text-slate-800">{pData.totalValidated} Essays</div>
            </div>
          </div>

          {/* Average Mastery Score */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-600 font-medium">Cohort Average Mastery Score</span>
            <span className="text-lg font-bold font-mono text-indigo-600">{pData.avgScore}%</span>
          </div>

          {/* Tier Breakdown Bars */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700">Diagnostic Tier Distribution</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tier 1: Mastered Concept</span>
                <span className="font-bold text-emerald-700">{pData.tier1Rate}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pData.tier1Rate}%` }} />
              </div>

              <div className="flex justify-between text-slate-600 pt-1">
                <span>Tier 2: Minor Gaps</span>
                <span className="font-bold text-indigo-700">{pData.tier2Rate}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${pData.tier2Rate}%` }} />
              </div>

              <div className="flex justify-between text-slate-600 pt-1">
                <span>Tier 3: Significant Misconception</span>
                <span className="font-bold text-amber-700">{pData.tier3Rate}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pData.tier3Rate}%` }} />
              </div>

              <div className="flex justify-between text-slate-600 pt-1">
                <span className="text-rose-700 font-semibold">Tier 4: Critical Safety Hazard</span>
                <span className="font-bold text-rose-700">{pData.tier4Rate}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-rose-600 rounded-full" style={{ width: `${pData.tier4Rate}%` }} />
              </div>
            </div>
          </div>

          {/* Top Misconception */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
            <div className="font-bold text-amber-900 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Leading Cohort Misconception</span>
            </div>
            <p className="text-amber-800">{pData.topMisconception}</p>
          </div>
        </div>

        {/* Subject B Column */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase">
                {secondarySubj.code}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">{secondarySubj.name}</h3>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Validated Sample</div>
              <div className="text-lg font-mono font-bold text-slate-800">{sData.totalValidated} Essays</div>
            </div>
          </div>

          {/* Average Mastery Score */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-600 font-medium">Cohort Average Mastery Score</span>
            <span className="text-lg font-bold font-mono text-indigo-600">{sData.avgScore}%</span>
          </div>

          {/* Tier Breakdown Bars */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700">Diagnostic Tier Distribution</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tier 1: Mastered Concept</span>
                <span className="font-bold text-emerald-700">{sData.tier1Rate}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${sData.tier1Rate}%` }} />
              </div>

              <div className="flex justify-between text-slate-600 pt-1">
                <span>Tier 2: Minor Gaps</span>
                <span className="font-bold text-indigo-700">{sData.tier2Rate}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${sData.tier2Rate}%` }} />
              </div>

              <div className="flex justify-between text-slate-600 pt-1">
                <span>Tier 3: Significant Misconception</span>
                <span className="font-bold text-amber-700">{sData.tier3Rate}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${sData.tier3Rate}%` }} />
              </div>

              <div className="flex justify-between text-slate-600 pt-1">
                <span className="text-rose-700 font-semibold">Tier 4: Critical Safety Hazard</span>
                <span className="font-bold text-rose-700">{sData.tier4Rate}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-rose-600 rounded-full" style={{ width: `${sData.tier4Rate}%` }} />
              </div>
            </div>
          </div>

          {/* Top Misconception */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
            <div className="font-bold text-amber-900 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Leading Cohort Misconception</span>
            </div>
            <p className="text-amber-800">{sData.topMisconception}</p>
          </div>
        </div>
      </div>

      {/* Human-AI Agreement Comparison */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 text-xs text-indigo-950 space-y-2">
        <div className="font-bold flex items-center gap-1.5 text-indigo-900">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>Faculty &amp; LLM Inter-Rater Reliability (P6.6 Metrics)</span>
        </div>
        <p className="leading-relaxed text-indigo-900/90">
          Cardiovascular Pathophysiology demonstrates an exact faculty-LLM agreement rate of <strong>{pData.facultyAgreementRate}%</strong> (rejection rate 4.2%), whereas Clinical Neurology exhibits <strong>{sData.facultyAgreementRate}%</strong> agreement (rejection rate 2.8%). All calculations exclude rejected analyses from clinical grade distributions while capturing rejection frequency as a prompt drift indicator.
        </p>
      </div>
    </div>
  );
};
