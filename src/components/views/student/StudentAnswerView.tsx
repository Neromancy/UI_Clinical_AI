import React, { useState } from 'react';
import { QuestionSet, Question, Submission } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import {
  FileText,
  Send,
  Save,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

interface StudentAnswerViewProps {
  questionSet: QuestionSet;
  question: Question;
  existingSubmission?: Submission;
  onSubmitAnswer: (answerText: string) => Promise<void>;
  onBackToDashboard: () => void;
  onViewFeedback: (submissionId: string) => void;
}

export const StudentAnswerView: React.FC<StudentAnswerViewProps> = ({
  questionSet,
  question,
  existingSubmission,
  onSubmitAnswer,
  onBackToDashboard,
  onViewFeedback,
}) => {
  const activeVersion =
    question.versions.find((v) => v.id === question.activeVersionId) || question.versions[0];

  const [answerText, setAnswerText] = useState(
    existingSubmission ? existingSubmission.answer : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const charCount = answerText.length;
  const minChars = 50;
  const maxChars = 20000;
  const isValidLength = charCount >= minChars && charCount <= maxChars;

  const handleSaveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidLength) {
      setErrorMessage(`Your essay answer must be between ${minChars} and ${maxChars} characters.`);
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await onSubmitAnswer(answerText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard ({questionSet.code})</span>
        </button>

        <div className="flex items-center gap-2">
          {existingSubmission ? (
            <StatusBadge status={existingSubmission.status} viewingRole="student" size="md" />
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
              Not Yet Submitted (Attempt #1)
            </span>
          )}
        </div>
      </div>

      {/* Main Answer Workspace: Split Left (Scenario) and Right (Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vignette & Prompt (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1 text-xs text-indigo-700 font-semibold uppercase tracking-wider">
                <span>Vignette {question.order} of {questionSet.questions.length}</span>
                <span>•</span>
                <span>{question.clinicalDomain}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{question.title}</h3>
            </div>

            {/* Clinical Scenario Box */}
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-700 space-y-1.5">
              <div className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                Clinical Vignette Scenario
              </div>
              <p className="leading-relaxed italic">"{activeVersion.clinicalScenario}"</p>
            </div>

            {/* Essay Prompt Box */}
            <div className="rounded-lg bg-indigo-50/70 border border-indigo-100 p-3.5 text-xs text-indigo-950 space-y-1.5">
              <div className="text-[11px] uppercase font-bold text-indigo-700 tracking-wider">
                Conceptual Essay Prompt
              </div>
              <p className="leading-relaxed font-medium">{activeVersion.prompt}</p>
            </div>

            {/* Instructions */}
            <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
              <p className="font-semibold text-slate-700">Clinical Reasoning Guidelines:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Demonstrate complete pathophysiological mechanisms.</li>
                <li>Identify key diagnostic thresholds and contraindications.</li>
                <li>Your submission will undergo AI diagnosis followed by faculty review.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Essay Authoring Form (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Your Clinical Response</span>
              </h4>

              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`font-mono font-medium ${
                    isValidLength ? 'text-slate-600' : 'text-rose-600 font-bold'
                  }`}
                >
                  {charCount.toLocaleString()} / {maxChars.toLocaleString()} chars
                </span>
              </div>
            </div>

            {/* Textarea */}
            <div>
              <textarea
                rows={12}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                disabled={isSubmitting || (existingSubmission?.status === 'VALIDATED')}
                placeholder="Compose your comprehensive clinical rationale here. Explain underlying physiological mechanisms, pressure-volume dynamics, and pharmacologic contraindications..."
                className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting || !answerText}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{draftSaved ? 'Draft Saved Locally' : 'Save Draft'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {existingSubmission && existingSubmission.status === 'VALIDATED' ? (
                  <button
                    type="button"
                    onClick={() => onViewFeedback(existingSubmission.id)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Validated Feedback</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValidLength}
                    className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Cpu className="w-4 h-4 animate-spin text-white" />
                        <span>Worker Analyzing (RAG + LLM)...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Conceptual Answer</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Submission notice */}
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Under System Governance (P3–P5), students never see raw LLM outputs. Your answer
                enters the faculty validation queue immediately after automated analysis.
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
