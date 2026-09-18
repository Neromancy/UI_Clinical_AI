import React, { useState } from 'react';
import { QuestionSet, Submission } from '../../../types';
import { CodeCard } from '../../common/CodeCard';
import { StatusBadge } from '../../common/StatusBadge';
import {
  KeyRound,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface StudentDashboardViewProps {
  questionSets: QuestionSet[];
  submissions: Submission[];
  onEnterCode: (code: string) => void;
  onOpenQuestion: (setId: string, questionId: string) => void;
  onViewFeedback: (submissionId: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  questionSets,
  submissions,
  onEnterCode,
  onOpenQuestion,
  onViewFeedback,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      setCodeError('Please enter a valid question set code.');
      return;
    }
    const cleanCode = inputCode.trim().toUpperCase();
    const matched = questionSets.find((s) => s.code.toUpperCase() === cleanCode);
    if (!matched) {
      setCodeError(`Code "${cleanCode}" not found. Try sample: CARD-2026-Q1 or NEUR-VASC-88`);
      return;
    }
    setCodeError('');
    onEnterCode(cleanCode);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner & Quick Code Entry */}
      <div className="rounded-2xl bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Clinical Reasoning Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
            Welcome, Elena Rostova (Year 3 Clinical Candidate)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            Enter your lecturer's assigned vignette code to begin conceptual essay responses. Your
            submissions are analyzed by clinical AI and independently validated by subject faculty.
          </p>

          {/* Quick Code Input Box */}
          <form onSubmit={handleCodeSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg">
            <div className="relative flex-1">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Enter Access Code (e.g. CARD-2026-Q1)"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  setCodeError('');
                }}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-400 uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Join Set</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {codeError && (
            <div className="flex items-center gap-1.5 text-xs text-rose-300 mt-2">
              <AlertCircle className="w-4 h-4" />
              <span>{codeError}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Enrolled Question Sets (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Enrolled Question Sets ({questionSets.length})
            </h3>
            <span className="text-xs text-slate-500">Subject Isolated</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questionSets.map((set) => (
              <div
                key={set.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono">
                      {set.code}
                    </span>
                    <span className="text-xs text-slate-500">{set.estimatedMinutes} mins</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">{set.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{set.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-600">{set.questions.length} Vignettes</span>
                  <button
                    type="button"
                    onClick={() => onOpenQuestion(set.id, set.questions[0].id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>Begin / Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Submissions & Feedback (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              My Submissions &amp; Status
            </h3>
            <span className="text-xs text-slate-500">{submissions.length} Total</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            {submissions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No submissions yet. Complete a vignette to track feedback.
              </div>
            ) : (
              submissions.map((sub) => {
                const isValidated = sub.status === 'VALIDATED';
                return (
                  <div
                    key={sub.id}
                    onClick={() => onViewFeedback(sub.id)}
                    className="p-3 rounded-lg border border-slate-100 hover:border-indigo-200 bg-slate-50/60 hover:bg-slate-50 transition-all cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <StatusBadge status={sub.status} viewingRole="student" size="sm" />
                      <span className="text-[10px] text-slate-400 font-mono">
                        Attempt #{sub.attemptNo}
                      </span>
                    </div>

                    <h5 className="font-semibold text-slate-800 line-clamp-1 mb-1" title={sub.questionTitle}>
                      {sub.questionTitle}
                    </h5>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                      <span className="font-medium text-indigo-600 flex items-center gap-0.5">
                        {isValidated ? 'View Score & Materials' : 'Review Status'}
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
