import React from 'react';
import { Submission } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { ValidationGate } from '../../common/ValidationGate';
import {
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  UserCheck,
  Calendar,
  FileText,
} from 'lucide-react';

interface StudentFeedbackViewProps {
  submission: Submission;
  onBack: () => void;
}

export const StudentFeedbackView: React.FC<StudentFeedbackViewProps> = ({
  submission,
  onBack,
}) => {
  const isValidated = submission.status === 'VALIDATED';
  const validation = submission.validation;
  const analysis = submission.analysis;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Submissions</span>
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={submission.status} viewingRole="student" size="md" />
        </div>
      </div>

      {/* Submission Meta Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          {submission.questionSetName}
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
          {submission.questionTitle}
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Submitted: {new Date(submission.submittedAt).toLocaleString()}</span>
          </span>
          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
            Attempt #{submission.attemptNo}
          </span>
        </div>
      </div>

      {/* Student Original Answer (Collapsible or visible) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>Your Submitted Essay Response</span>
        </h4>
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans italic">
          "{submission.answer}"
        </div>
      </div>

      {/* Validation Gate Protected Section: Only shown if VALIDATED */}
      <ValidationGate
        status={submission.status}
        userRole="student"
        fallbackTitle="Clinical Feedback Withheld Pending Faculty Review"
        fallbackMessage="Your conceptual essay has been safely ingested and processed by the diagnostic engine. Under strict academic clinical governance, all preliminary AI analyses are held until a designated subject lecturer independently validates or refines the diagnostic findings."
      >
        {isValidated && validation && (
          <div className="space-y-6">
            {/* Lecturer Validated Score Banner */}
            <div className="rounded-2xl bg-linear-to-br from-emerald-900 to-slate-900 text-white p-6 sm:p-8 shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Faculty Validated Clinical Assessment</span>
                  </div>
                  <h3 className="text-xl font-bold">Evaluation Outcome</h3>
                  <p className="text-xs text-emerald-100/80 mt-1">
                    Validated by {validation.lecturerName} on{' '}
                    {new Date(validation.validatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                      Final Score
                    </div>
                    <div className="text-3xl font-extrabold font-mono text-white">
                      {validation.finalScore ?? analysis?.percentageScore}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnostic Tier Badge */}
              <div className="mt-4 pt-4 border-t border-emerald-700/50 flex items-center gap-2">
                <span className="text-xs text-emerald-200">Diagnostic Tier:</span>
                <span className="px-3 py-1 rounded-lg bg-emerald-800 text-white font-semibold text-xs border border-emerald-600">
                  {validation.finalTierName ?? analysis?.tierName}
                </span>
              </div>
            </div>

            {/* Faculty Feedback & Clinical Reasoning */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">Faculty Review &amp; Guidance</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                {validation.finalExplanation || analysis?.explanation}
              </p>
            </div>

            {/* Suggested Remediation Materials */}
            {((validation.finalMaterials && validation.finalMaterials.length > 0) ||
              (analysis?.suggestedMaterials && analysis.suggestedMaterials.length > 0)) && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Curriculum Reading &amp; Remediation References
                  </h4>
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700">
                  {(validation.finalMaterials || analysis?.suggestedMaterials || []).map(
                    (item, idx) => (
                      <li key={idx} className="leading-normal">
                        <span className="font-medium text-slate-900">{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </ValidationGate>
    </div>
  );
};
