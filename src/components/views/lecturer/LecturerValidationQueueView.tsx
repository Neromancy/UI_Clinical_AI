import React, { useState, useMemo } from 'react';
import {
  Submission,
  DiagnosticTier,
  ValidationAction,
  StructuredDiff,
} from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { AnalysisCard } from '../../common/AnalysisCard';
import { RAGContextPanel } from '../../common/RAGContextPanel';
import { DiffViewer } from '../../common/DiffViewer';
import { ConfirmModal } from '../../common/ConfirmModal';
import {
  CheckCircle2,
  Edit3,
  XCircle,
  ArrowLeft,
  FileCheck2,
  AlertTriangle,
  BookOpen,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Send,
} from 'lucide-react';

interface LecturerValidationQueueViewProps {
  submissions: Submission[];
  tiers: DiagnosticTier[];
  activeSubmissionId?: string;
  onSelectSubmission: (id?: string) => void;
  onValidate: (
    submissionId: string,
    action: ValidationAction,
    data: {
      score?: number;
      tierId?: string;
      tierName?: string;
      explanation?: string;
      notes?: string;
      diff?: StructuredDiff;
    }
  ) => void;
}

type SortField = 'student' | 'question' | 'score' | 'date' | 'status';
type SortDirection = 'asc' | 'desc';

export const LecturerValidationQueueView: React.FC<LecturerValidationQueueViewProps> = ({
  submissions,
  tiers,
  activeSubmissionId,
  onSelectSubmission,
  onValidate,
}) => {
  const activeSubmission = submissions.find((s) => s.id === activeSubmissionId);

  // Filter & Search states (preserved during queue navigation)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING_VALIDATION' | 'VALIDATED' | 'REJECTED'>('PENDING_VALIDATION');
  const [setFilter, setSetFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Decision form state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedScore, setEditedScore] = useState<number>(75);
  const [editedTierId, setEditedTierId] = useState<string>('tier-2');
  const [editedExplanation, setEditedExplanation] = useState<string>('');
  const [lecturerNotes, setLecturerNotes] = useState<string>('');

  // Modals state
  const [modalType, setModalType] = useState<'accept' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Escalation / Second opinion modal
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [escalateFacultyName, setEscalateFacultyName] = useState('Dr. Marcus Vance, MD');
  const [escalateNote, setEscalateNote] = useState('');
  const [escalatedNotice, setEscalatedNotice] = useState(false);

  // Rubric Drawer toggle
  const [showRubricSidebar, setShowRubricSidebar] = useState(false);

  // Unique question sets for filtering
  const availableQuestionSets = useMemo(() => {
    const sets = new Map<string, string>();
    submissions.forEach((s) => {
      if (s.questionSetName) {
        sets.set(s.questionSetName, s.questionSetName);
      }
    });
    return Array.from(sets.values());
  }, [submissions]);

  // Sync edit form when activeSubmission changes
  React.useEffect(() => {
    if (activeSubmission?.analysis) {
      setEditedScore(activeSubmission.analysis.percentageScore);
      setEditedTierId(activeSubmission.analysis.tierId);
      setEditedExplanation(activeSubmission.analysis.explanation);
      setLecturerNotes('');
      setIsEditing(false);
    }
  }, [activeSubmissionId, activeSubmission]);

  // Handle Accept
  const handleConfirmAccept = () => {
    if (!activeSubmission || !activeSubmission.analysis) return;
    onValidate(activeSubmission.id, 'ACCEPTED', {
      score: activeSubmission.analysis.percentageScore,
      tierId: activeSubmission.analysis.tierId,
      tierName: activeSubmission.analysis.tierName,
      explanation: activeSubmission.analysis.explanation,
      notes: 'Accepted analysis as-is.',
    });
    setModalType(null);
  };

  // Handle Edit Submit
  const handleSaveEdits = () => {
    if (!activeSubmission || !activeSubmission.analysis) return;
    const orig = activeSubmission.analysis;
    const selectedTier = tiers.find((t) => t.id === editedTierId);

    const diff: StructuredDiff = {};
    if (editedScore !== orig.percentageScore) {
      diff.score = { original: orig.percentageScore, modified: editedScore };
    }
    if (editedTierId !== orig.tierId) {
      diff.tier = { original: orig.tierName, modified: selectedTier?.name || editedTierId };
    }
    if (editedExplanation.trim() !== orig.explanation.trim()) {
      diff.explanation = { original: orig.explanation, modified: editedExplanation };
    }

    onValidate(activeSubmission.id, 'EDITED', {
      score: editedScore,
      tierId: editedTierId,
      tierName: selectedTier?.name,
      explanation: editedExplanation,
      notes: lecturerNotes || 'Adjusted score and clinical explanation.',
      diff,
    });
    setIsEditing(false);
  };

  // Handle Reject
  const handleConfirmReject = () => {
    if (!activeSubmission) return;
    onValidate(activeSubmission.id, 'REJECTED', {
      notes: rejectionReason || 'Analysis rejected; scheduled for re-analysis.',
    });
    setModalType(null);
    setRejectionReason('');
  };

  // Handle Escalation
  const handleConfirmEscalation = () => {
    setIsEscalateModalOpen(false);
    setEscalatedNotice(true);
    setTimeout(() => setEscalatedNotice(false), 4000);
  };

  // Sorting Handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtered & Sorted Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      // Status filter
      if (statusFilter !== 'ALL' && sub.status !== statusFilter) {
        return false;
      }
      // Question set filter
      if (setFilter !== 'ALL' && sub.questionSetName !== setFilter) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const studentMatch = sub.studentName.toLowerCase().includes(term);
        const questionMatch = sub.questionTitle.toLowerCase().includes(term);
        const setMatch = (sub.questionSetName || '').toLowerCase().includes(term);
        if (!studentMatch && !questionMatch && !setMatch) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      switch (sortField) {
        case 'student':
          valA = a.studentName.toLowerCase();
          valB = b.studentName.toLowerCase();
          break;
        case 'question':
          valA = a.questionTitle.toLowerCase();
          valB = b.questionTitle.toLowerCase();
          break;
        case 'score':
          valA = a.analysis?.percentageScore ?? -1;
          valB = b.analysis?.percentageScore ?? -1;
          break;
        case 'status':
          valA = a.status;
          valB = b.status;
          break;
        case 'date':
        default:
          valA = new Date(a.submittedAt).getTime();
          valB = new Date(b.submittedAt).getTime();
          break;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [submissions, statusFilter, setFilter, searchTerm, sortField, sortDirection]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / pageSize));
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubmissions.slice(start, start + pageSize);
  }, [filteredSubmissions, currentPage, pageSize]);

  // Metrics for quick scan
  const pendingCount = submissions.filter((s) => s.status === 'PENDING_VALIDATION').length;
  const validatedCount = submissions.filter((s) => s.status === 'VALIDATED').length;
  const flaggedCount = submissions.filter(
    (s) => s.analysis?.tierId === 'tier-4' || (s.analysis && s.analysis.confidence < 0.75)
  ).length;

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setSetFilter('ALL');
    setCurrentPage(1);
  };

  // RENDER TABLE VIEW (QUEUE)
  if (!activeSubmission) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto">
        {/* Page Title & Context */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Validation Queue</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and verify student responses before feedback is sent.
            </p>
          </div>

          {/* Scannable Triage Metrics (Rule 15: Avoid Dashboard Metric Overload) */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-500">Needs Review:</span>
              <span className="text-sm font-bold text-rose-600 font-mono">{pendingCount}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-500">Reviewed:</span>
              <span className="text-sm font-bold text-emerald-700 font-mono">{validatedCount}</span>
            </div>
            {flaggedCount > 0 && (
              <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2">
                <span className="text-[11px] font-medium text-amber-900">Flagged:</span>
                <span className="text-sm font-bold text-amber-700 font-mono">{flaggedCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar: Filters, Search, and Sort (Rule 9 & Rule 19) */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
          {/* Left: Search input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or question..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right: Filters & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING_VALIDATION">Needs Review</option>
                <option value="VALIDATED">Reviewed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Set Filter */}
            {availableQuestionSets.length > 1 && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Set:</span>
                <select
                  value={setFilter}
                  onChange={(e) => {
                    setSetFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 max-w-[150px] truncate"
                >
                  <option value="ALL">All Sets</option>
                  {availableQuestionSets.map((setName) => (
                    <option key={setName} value={setName}>
                      {setName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Clear filters button if active */}
            {(searchTerm || statusFilter !== 'ALL' || setFilter !== 'ALL') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Table (Rule 1, 3, 4, 5, 6, 7, 8) */}
        {filteredSubmissions.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-2xs">
            <p className="text-xs text-slate-500 mb-2">No submissions match the current filters.</p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200 select-none">
                  <tr>
                    {/* Student (Left) */}
                    <th
                      className="px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('student')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Student</span>
                        {sortField === 'student' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-300" />
                        )}
                      </div>
                    </th>

                    {/* Question (Left) */}
                    <th
                      className="px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('question')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Question</span>
                        {sortField === 'question' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-300" />
                        )}
                      </div>
                    </th>

                    {/* Score (Right) */}
                    <th
                      className="px-4 py-2.5 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('score')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Score</span>
                        {sortField === 'score' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-300" />
                        )}
                      </div>
                    </th>

                    {/* Performance Level (Left) */}
                    <th className="px-4 py-2.5">Level</th>

                    {/* Status (Left) */}
                    <th
                      className="px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Status</span>
                        {sortField === 'status' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-300" />
                        )}
                      </div>
                    </th>

                    {/* Submitted Date (Left) */}
                    <th
                      className="px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Submitted</span>
                        {sortField === 'date' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-300" />
                        )}
                      </div>
                    </th>

                    {/* Action (Right) */}
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedSubmissions.map((sub) => {
                    const isFlagged = sub.analysis?.tierId === 'tier-4';
                    return (
                      <tr
                        key={sub.id}
                        onClick={() => onSelectSubmission(sub.id)}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                          isFlagged ? 'bg-amber-50/30' : ''
                        }`}
                      >
                        {/* Student Primary + Attempt Secondary */}
                        <td className="px-4 py-2.5">
                          <div className="font-semibold text-slate-900">{sub.studentName}</div>
                          <div className="text-[11px] text-slate-400">Attempt #{sub.attemptNo}</div>
                        </td>

                        {/* Question Title Primary + Set Name Secondary */}
                        <td className="px-4 py-2.5 max-w-xs">
                          <div className="font-medium text-slate-800 truncate" title={sub.questionTitle}>
                            {sub.questionTitle}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{sub.questionSetName}</div>
                        </td>

                        {/* Numeric Score (Right-aligned) */}
                        <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                          {sub.analysis?.percentageScore ?? '—'}%
                        </td>

                        {/* Performance Level */}
                        <td className="px-4 py-2.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                            {sub.analysis?.tierName || 'Unassigned'}
                          </span>
                        </td>

                        {/* Status (Restrained badge) */}
                        <td className="px-4 py-2.5">
                          {sub.status === 'PENDING_VALIDATION' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                              Needs Review
                            </span>
                          )}
                          {sub.status === 'VALIDATED' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Reviewed
                            </span>
                          )}
                          {sub.status === 'REJECTED' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                              Rejected
                            </span>
                          )}
                        </td>

                        {/* Submitted Date */}
                        <td className="px-4 py-2.5 text-[11px] text-slate-500 whitespace-nowrap">
                          {new Date(sub.submittedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>

                        {/* Single Obvious Action Button (Rule 20) */}
                        <td className="px-4 py-2.5 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectSubmission(sub.id);
                            }}
                            className="px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls (Rule 22) */}
            <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                Showing{' '}
                <span className="font-semibold text-slate-900">
                  {(currentPage - 1) * pageSize + 1}–
                  {Math.min(currentPage * pageSize, filteredSubmissions.length)}
                </span>{' '}
                of <span className="font-semibold text-slate-900">{filteredSubmissions.length}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
                >
                  Previous
                </button>
                <span className="px-2 text-slate-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RENDER DETAIL VIEW (Rule 13: The table identifies the item; the detail screen explains it)
  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Detail View Header */}
      <div className="p-3 rounded-lg bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">Reviewing Submission:</span>
          <span className="text-slate-300">
            {activeSubmission.studentName} • {activeSubmission.questionTitle}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectSubmission(undefined)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Back to Queue
          </button>
        </div>
      </div>

      {/* Escalation Success Notice */}
      {escalatedNotice && (
        <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Second opinion request submitted to {escalateFacultyName}.</span>
          </div>
        </div>
      )}

      {/* Action Toolbar above side-by-side */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => onSelectSubmission(undefined)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Queue</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRubricSidebar(!showRubricSidebar)}
            className={`px-3 py-1.5 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showRubricSidebar
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>{showRubricSidebar ? 'Hide Rubric & Model Answer' : 'View Rubric & Model Answer'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEscalateModalOpen(true)}
            className="px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Request Second Opinion</span>
          </button>

          <StatusBadge status={activeSubmission.status} viewingRole="lecturer" size="md" />
        </div>
      </div>

      {/* Persistent Rubric Drawer */}
      {showRubricSidebar && (
        <div className="p-4 rounded-lg border border-indigo-200 bg-indigo-50/40 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
            <h4 className="text-xs uppercase font-bold text-indigo-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Reference Rubric &amp; Model Answer</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-800">
            <div className="p-3 rounded-md bg-white border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold text-slate-600 uppercase">Case Scenario</div>
              <p className="text-slate-700 leading-relaxed">
                68yo male with dyspnea on exertion, preserved LVEF (58%), severe concentric LV hypertrophy, and elevated BNP. Distinguish diastolic filling impairment from systolic failure.
              </p>
            </div>
            <div className="p-3 rounded-md bg-white border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold text-emerald-800 uppercase">Model Clinical Answer</div>
              <p className="text-slate-700 leading-relaxed">
                Patient displays Heart Failure with Preserved Ejection Fraction (HFpEF). Symptoms stem from ventricular stiffness and impaired diastolic relaxation elevating filling pressures, rather than contractile failure.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 cols): Student Answer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-900">
                  {activeSubmission.studentName}
                </span>
                <span className="font-mono text-slate-400">Attempt #{activeSubmission.attemptNo}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {activeSubmission.questionTitle}
              </h3>
            </div>

            {/* Student Essay Response */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
                  Student Response
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activeSubmission.answer.split(/\s+/).length} words
                </span>
              </div>
              <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-900 leading-relaxed font-sans whitespace-pre-wrap">
                {activeSubmission.answer}
              </div>
            </div>

            {/* In-situ misconception alert */}
            {activeSubmission.analysis?.tierId && activeSubmission.analysis.tierId !== 'tier-1' && (
              <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Potential Misconception Detected</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                    {activeSubmission.analysis.tierName}
                  </span>
                </div>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  The analysis flagged conceptual deviation. Verify the suggested level and feedback before releasing.
                </p>
              </div>
            )}

            {/* Existing validation if already reviewed */}
            {activeSubmission.validation && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <h4 className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
                  Recorded Review
                </h4>
                <div className="p-3 rounded-md bg-emerald-50 text-xs text-emerald-900 border border-emerald-200 space-y-1">
                  <div><strong>Status:</strong> {activeSubmission.validation.status}</div>
                  <div><strong>Score:</strong> {activeSubmission.validation.finalScore}%</div>
                  <div><strong>Notes:</strong> {activeSubmission.validation.notes}</div>
                </div>
                {activeSubmission.validation.structuredDiff && (
                  <DiffViewer diff={activeSubmission.validation.structuredDiff} className="mt-2" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 cols): AI Suggestion & Lecturer Decision Form */}
        <div className="lg:col-span-7 space-y-4">
          {activeSubmission.analysis && (
            <>
              {/* Analysis Card */}
              <AnalysisCard analysis={activeSubmission.analysis} isLecturerView={true} />

              {/* Learning Materials Context Panel */}
              <RAGContextPanel
                chunks={activeSubmission.analysis.retrievedChunks}
                userRole="lecturer"
              />

              {/* Decision Card */}
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs uppercase font-bold text-slate-900 flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-slate-700" />
                    <span>Review Decision</span>
                  </h4>
                </div>

                {isEditing ? (
                  /* Edit Form */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Adjust Score (0–100%)
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={editedScore}
                          onChange={(e) => setEditedScore(Number(e.target.value))}
                          className="w-full p-2 text-xs rounded-md border border-slate-300 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Performance Level
                        </label>
                        <select
                          value={editedTierId}
                          onChange={(e) => setEditedTierId(e.target.value)}
                          className="w-full p-2 text-xs rounded-md border border-slate-300 font-medium"
                        >
                          {tiers.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Feedback Explanation (Student-Facing)
                      </label>
                      <textarea
                        rows={4}
                        value={editedExplanation}
                        onChange={(e) => setEditedExplanation(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-md border border-slate-300 leading-relaxed font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Internal Notes
                      </label>
                      <input
                        type="text"
                        placeholder="Reason for adjustment..."
                        value={lecturerNotes}
                        onChange={(e) => setLecturerNotes(e.target.value)}
                        className="w-full p-2 text-xs rounded-md border border-slate-300 text-slate-700"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveEdits}
                        className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                      >
                        Save &amp; Verify
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard 3 Actions */
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Select an action. Verified feedback will be released to the student feedback portal.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {/* Accept */}
                      <button
                        type="button"
                        onClick={() => setModalType('accept')}
                        className="p-3 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 flex flex-col items-center justify-center text-center transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-1" />
                        <span className="text-xs font-bold">Accept</span>
                        <span className="text-[10px] text-emerald-700 mt-0.5">
                          Release to Student
                        </span>
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="p-3 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-900 flex flex-col items-center justify-center text-center transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-slate-700 mb-1" />
                        <span className="text-xs font-bold">Edit</span>
                        <span className="text-[10px] text-slate-600 mt-0.5">
                          Adjust Score &amp; Feedback
                        </span>
                      </button>

                      {/* Reject */}
                      <button
                        type="button"
                        onClick={() => setModalType('reject')}
                        className="p-3 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-900 flex flex-col items-center justify-center text-center transition-colors"
                      >
                        <XCircle className="w-4 h-4 text-rose-600 mb-1" />
                        <span className="text-xs font-bold">Reject</span>
                        <span className="text-[10px] text-rose-700 mt-0.5">
                          Analyze Again
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Accept Confirm Modal */}
      <ConfirmModal
        isOpen={modalType === 'accept'}
        onClose={() => setModalType(null)}
        onConfirm={handleConfirmAccept}
        variant="success"
        title="Accept Evaluation"
        message={`Approve the evaluation for ${activeSubmission.studentName} with score ${activeSubmission.analysis?.percentageScore}% (${activeSubmission.analysis?.tierName})? Feedback will be released to the student.`}
        confirmText="Release Feedback"
      />

      {/* Reject Confirm Modal */}
      <ConfirmModal
        isOpen={modalType === 'reject'}
        onClose={() => setModalType(null)}
        onConfirm={handleConfirmReject}
        variant="danger"
        title="Reject Evaluation"
        message="Rejecting will remove this analysis and schedule the submission for re-analysis."
        confirmText="Reject"
        requiresInput={true}
        inputLabel="Reason for Rejection"
        inputPlaceholder="Reason for rejecting evaluation..."
        inputValue={rejectionReason}
        onInputChange={setRejectionReason}
      />

      {/* Escalation Modal */}
      {isEscalateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-lg border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Users className="w-4 h-4 text-slate-700" />
              <span>Request Second Opinion</span>
            </div>
            <p className="text-xs text-slate-600">
              Assign this submission to a colleague for secondary clinical evaluation.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Reviewer</label>
              <select
                value={escalateFacultyName}
                onChange={(e) => setEscalateFacultyName(e.target.value)}
                className="w-full text-xs font-medium p-2 rounded-md border border-slate-200 bg-white"
              >
                <option value="Dr. Marcus Vance, MD">Dr. Marcus Vance, MD</option>
                <option value="Prof. David Chen, MD">Prof. David Chen, MD</option>
                <option value="Dr. Emily Thorne, MD">Dr. Emily Thorne, MD</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Query or Notes</label>
              <textarea
                rows={3}
                placeholder="Specific clinical questions for reviewer..."
                value={escalateNote}
                onChange={(e) => setEscalateNote(e.target.value)}
                className="w-full p-2 text-xs rounded-md border border-slate-200"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEscalateModalOpen(false)}
                className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEscalation}
                className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Request</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
