import React from 'react';
import { SubmissionStatus } from '../../types';
import {
  Clock,
  Cpu,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export interface StatusBadgeProps {
  status: SubmissionStatus;
  viewingRole?: 'student' | 'lecturer' | 'admin' | 'researcher';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const STATUS_CONFIG: Record<
  SubmissionStatus,
  {
    studentLabel: string;
    lecturerLabel: string;
    colorClasses: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }
> = {
  SUBMITTED: {
    studentLabel: 'Answer Received',
    lecturerLabel: 'SUBMITTED (In Ingestion Queue)',
    colorClasses: 'bg-slate-100 text-slate-700 border-slate-300',
    icon: Clock,
    description: 'Answer received and recorded; worker pickup pending.',
  },
  ANALYZING: {
    studentLabel: 'Processing',
    lecturerLabel: 'ANALYZING (Celery Worker + RAG)',
    colorClasses: 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse',
    icon: Cpu,
    description: 'LLM RAG retrieval and misconception analysis in progress.',
  },
  ANALYSIS_FAILED: {
    studentLabel: 'Processing Queued',
    lecturerLabel: 'ANALYSIS FAILED (Retry Scheduled)',
    colorClasses: 'bg-amber-50 text-amber-800 border-amber-300',
    icon: AlertTriangle,
    description: 'Transient worker error; auto-retry task enqueued.',
  },
  PENDING_VALIDATION: {
    studentLabel: 'Awaiting Lecturer Review',
    lecturerLabel: 'PENDING VALIDATION (Queue Ready)',
    colorClasses: 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-1 ring-indigo-200',
    icon: FileCheck2,
    description: 'Analysis completed by LLM; awaiting subject lecturer decision.',
  },
  VALIDATED: {
    studentLabel: 'Feedback Ready',
    lecturerLabel: 'VALIDATED (Approved / Released)',
    colorClasses: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    icon: CheckCircle2,
    description: 'Lecturer validated; feedback released to student and profiles.',
  },
  REJECTED: {
    studentLabel: 'Awaiting Re-Analysis',
    lecturerLabel: 'REJECTED (Flagged for Re-Run)',
    colorClasses: 'bg-rose-50 text-rose-800 border-rose-300',
    icon: XCircle,
    description: 'Lecturer rejected analysis; excluded from feedback and analytics.',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  viewingRole = 'lecturer',
  size = 'md',
  showIcon = true,
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.SUBMITTED;
  const label = viewingRole === 'student' ? config.studentLabel : config.lecturerLabel;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium whitespace-nowrap select-none ${config.colorClasses} ${sizeClasses}`}
      title={config.description}
      role="status"
      aria-label={`Status: ${label}`}
    >
      {showIcon && <Icon className={`${iconSizes} shrink-0`} />}
      <span>{label}</span>
    </span>
  );
};
