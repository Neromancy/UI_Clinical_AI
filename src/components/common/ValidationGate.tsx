import React from 'react';
import { SubmissionStatus } from '../../types';
import { ShieldCheck, Lock, Clock } from 'lucide-react';

interface ValidationGateProps {
  status: SubmissionStatus;
  userRole: 'student' | 'lecturer' | 'researcher' | 'admin';
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

/**
 * ValidationGate: Strictly enforces Cross-Cutting Rule #3:
 * "Students never see raw LLM output; only validated feedback."
 * Non-validated submissions show a secure lock message for students.
 * Lecturers/Admins can see preview indicators if permitted.
 */
export const ValidationGate: React.FC<ValidationGateProps> = ({
  status,
  userRole,
  children,
  fallbackTitle = 'Clinical Validation in Progress',
  fallbackMessage = 'Your answer has been safely recorded. Under medical curriculum governance, all AI diagnoses are independently reviewed and verified by your subject faculty before feedback release.',
}) => {
  const isValidated = status === 'VALIDATED';

  // If user is a student and submission is NOT validated, show gate
  if (userRole === 'student' && !isValidated) {
    return (
      <div
        className="rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-xs"
        role="region"
        aria-label="Validation Gate Notice"
      >
        <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          {status === 'ANALYZING' ? (
            <Clock className="w-6 h-6 animate-spin text-indigo-600" />
          ) : (
            <Lock className="w-6 h-6 text-indigo-600" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {fallbackTitle}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {fallbackMessage}
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Governance Policy: Lecturer Decides; LLM Advises</span>
        </div>
      </div>
    );
  }

  // Otherwise, render full content
  return <>{children}</>;
};
