import React, { useState, useMemo } from 'react';
import { MisconceptionCatalogItem } from '../../../types';
import {
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
} from 'lucide-react';

interface LecturerMisconceptionsViewProps {
  misconceptions: MisconceptionCatalogItem[];
  onPromoteCandidate: (id: string, label: string, remediationNote: string) => void;
}

type SortField = 'label' | 'frequency' | 'status' | 'topic';
type SortDirection = 'asc' | 'desc';

export const LecturerMisconceptionsView: React.FC<LecturerMisconceptionsViewProps> = ({
  misconceptions,
  onPromoteCandidate,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'CANDIDATE' | 'ESTABLISHED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('frequency');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Promotion modal form
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<MisconceptionCatalogItem | null>(null);
  const [promoteLabel, setPromoteLabel] = useState('');
  const [promoteRemediation, setPromoteRemediation] = useState('');

  // Counts
  const candidateCount = misconceptions.filter((m) => m.status === 'LLM_CANDIDATE').length;
  const establishedCount = misconceptions.filter(
    (m) => m.status === 'LECTURER_DEFINED' || m.status === 'PROMOTED'
  ).length;

  const handleOpenPromote = (item: MisconceptionCatalogItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedCandidate(item);
    setPromoteLabel(item.label);
    setPromoteRemediation(item.remediationNote);
    setPromoteModalOpen(true);
  };

  const handleConfirmPromote = () => {
    if (!selectedCandidate) return;
    onPromoteCandidate(selectedCandidate.id, promoteLabel, promoteRemediation);
    setPromoteModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'frequency' ? 'desc' : 'asc');
    }
  };

  // Filter & Sort
  const filteredMisconceptions = useMemo(() => {
    return misconceptions
      .filter((item) => {
        const isCandidate = item.status === 'LLM_CANDIDATE';
        if (filterType === 'CANDIDATE' && !isCandidate) return false;
        if (filterType === 'ESTABLISHED' && isCandidate) return false;

        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchLabel = item.label.toLowerCase().includes(term);
          const matchDesc = item.description.toLowerCase().includes(term);
          const matchTopic = item.topicName.toLowerCase().includes(term);
          if (!matchLabel && !matchDesc && !matchTopic) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let valA: any = '';
        let valB: any = '';
        switch (sortField) {
          case 'label':
            valA = a.label.toLowerCase();
            valB = b.label.toLowerCase();
            break;
          case 'frequency':
            valA = a.frequency;
            valB = b.frequency;
            break;
          case 'topic':
            valA = a.topicName.toLowerCase();
            valB = b.topicName.toLowerCase();
            break;
          case 'status':
            valA = a.status;
            valB = b.status;
            break;
        }
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [misconceptions, filterType, searchTerm, sortField, sortDirection]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header (Rule 1: Optimize for Scanning) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Misconceptions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cataloged learning gaps used to evaluate responses and suggested misconceptions awaiting review.
          </p>
        </div>

        {/* Triage Summary Metrics */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500">Established:</span>
            <span className="text-sm font-bold text-slate-900 font-mono">{establishedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2">
            <span className="text-[11px] font-medium text-amber-900">Suggested:</span>
            <span className="text-sm font-bold text-amber-700 font-mono">{candidateCount}</span>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Filters, and Tabs (Rule 9 & Rule 19) */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        {/* Left: Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search misconceptions or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Segmented Filter */}
        <div className="flex items-center gap-1.5 p-0.5 bg-slate-100 rounded-md">
          <button
            type="button"
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filterType === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({misconceptions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('CANDIDATE')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              filterType === 'CANDIDATE'
                ? 'bg-white text-amber-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Suggested ({candidateCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('ESTABLISHED')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              filterType === 'ESTABLISHED'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3 h-3 text-slate-600" />
            <span>Established ({establishedCount})</span>
          </button>
        </div>
      </div>

      {/* Comparison Table (Rule 1 & Rule 3: Prefer Tables for Comparable Data) */}
      {filteredMisconceptions.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-2xs">
          <p className="text-xs text-slate-500 mb-2">No misconceptions match your filters.</p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setFilterType('ALL');
            }}
            className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200 select-none">
                <tr>
                  {/* Misconception Name & Topic */}
                  <th
                    className="px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort('label')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Misconception</span>
                      {sortField === 'label' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* Status */}
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

                  {/* Topic */}
                  <th
                    className="px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort('topic')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Topic</span>
                      {sortField === 'topic' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* Frequency (Right-aligned) */}
                  <th
                    className="px-4 py-2.5 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort('frequency')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Students Affected</span>
                      {sortField === 'frequency' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* Clinical Consequence */}
                  <th className="px-4 py-2.5">Clinical Consequence</th>

                  {/* Action */}
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMisconceptions.map((item) => {
                  const isCandidate = item.status === 'LLM_CANDIDATE';
                  const isExpanded = expandedId === item.id;

                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                          isCandidate ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        {/* Primary Label */}
                        <td className="px-4 py-2.5 max-w-sm">
                          <div className="font-semibold text-slate-900">{item.label}</div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {item.description}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          {isCandidate ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                              <Sparkles className="w-3 h-3 text-amber-600" />
                              <span>Suggested</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                              <CheckCircle2 className="w-3 h-3 text-slate-500" />
                              <span>{item.status === 'PROMOTED' ? 'Promoted' : 'Established'}</span>
                            </span>
                          )}
                        </td>

                        {/* Topic */}
                        <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">
                          {item.topicName}
                        </td>

                        {/* Frequency (Right-aligned number) */}
                        <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                          {item.frequency}
                        </td>

                        {/* Clinical Consequence (Left-aligned) */}
                        <td className="px-4 py-2.5 text-[11px] text-slate-600 max-w-xs truncate" title={item.clinicalConsequence}>
                          {item.clinicalConsequence}
                        </td>

                        {/* Actions (Rule 20: Keep primary action obvious) */}
                        <td className="px-4 py-2.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            {isCandidate ? (
                              <button
                                type="button"
                                onClick={(e) => handleOpenPromote(item, e)}
                                className="px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition-colors flex items-center gap-1"
                              >
                                <ArrowUpRight className="w-3 h-3" />
                                <span>Promote</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedId(isExpanded ? null : item.id);
                                }}
                                className="px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors"
                              >
                                {isExpanded ? 'Hide' : 'Details'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Details Row (Rule 14: Use expandable rows only for secondary details) */}
                      {isExpanded && (
                        <tr className="bg-slate-50/60 border-b border-slate-200">
                          <td colSpan={6} className="px-6 py-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="p-3 rounded-md bg-white border border-slate-200 space-y-1">
                                <div className="text-[11px] font-bold text-rose-800 uppercase">
                                  Clinical Hazard / Consequence
                                </div>
                                <p className="text-slate-700 leading-relaxed">
                                  {item.clinicalConsequence}
                                </p>
                              </div>

                              <div className="p-3 rounded-md bg-white border border-slate-200 space-y-1">
                                <div className="text-[11px] font-bold text-slate-800 uppercase">
                                  Remediation Guidance
                                </div>
                                <p className="text-slate-700 leading-relaxed">
                                  {item.remediationNote}
                                </p>
                              </div>
                            </div>

                            {/* Evidence quotes if present */}
                            {item.evidenceQuotes && item.evidenceQuotes.length > 0 && (
                              <div className="space-y-1.5 pt-1">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                  Student Response Citations ({item.evidenceQuotes.length})
                                </div>
                                <div className="space-y-1">
                                  {item.evidenceQuotes.map((quote, idx) => (
                                    <div
                                      key={idx}
                                      className="p-2 rounded-md bg-white border border-slate-200 text-xs italic text-slate-600 font-serif"
                                    >
                                      &ldquo;{quote}&rdquo;
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {isCandidate && (
                              <div className="flex justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={(e) => handleOpenPromote(item, e)}
                                  className="px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors"
                                >
                                  Review &amp; Promote to Catalog
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Promotion Modal (Rule 8: Consequence Clear & Jargon-free) */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden space-y-4 p-5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Promote Misconception to Catalog</span>
            </div>

            <p className="text-xs text-slate-600">
              Promoting this misconception adds it to the active curriculum catalog. It will be used for future student response evaluations in this subject.
            </p>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Misconception Name
              </label>
              <input
                type="text"
                value={promoteLabel}
                onChange={(e) => setPromoteLabel(e.target.value)}
                className="w-full p-2 text-xs rounded-md border border-slate-300 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Remediation Guidance
              </label>
              <textarea
                rows={3}
                value={promoteRemediation}
                onChange={(e) => setPromoteRemediation(e.target.value)}
                className="w-full p-2 text-xs rounded-md border border-slate-300 font-sans leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPromoteModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPromote}
                className="px-4 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
              >
                Promote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
