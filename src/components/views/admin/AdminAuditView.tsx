import React, { useState, useMemo } from 'react';
import { AuditLogItem } from '../../../types';
import {
  Search,
  ExternalLink,
  Lock,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

interface AdminAuditViewProps {
  logs: AuditLogItem[];
}

export const AdminAuditView: React.FC<AdminAuditViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');
  const [activeLogItem, setActiveLogItem] = useState<AuditLogItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const actionLabels: Record<string, string> = {
    VALIDATE_ANALYSIS_ACCEPTED: 'Accepted Evaluation',
    VALIDATE_ANALYSIS_EDITED: 'Edited Evaluation',
    VALIDATE_ANALYSIS_REJECTED: 'Rejected Evaluation',
    PUBLISH_QUESTION_VERSION: 'Published Question Version',
    RECORD_LLM_ANALYSIS: 'Generated Analysis',
    CREATE_SUBJECT: 'Created Subject',
    PROMOTE_MISCONCEPTION: 'Promoted Misconception',
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
      const matchesSearch =
        searchTerm === '' ||
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesAction && matchesSearch;
    });
  }, [logs, selectedAction, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Audit Log</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            System activity history recording question publishing, reviews, and modifications.
          </p>
        </div>

        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
          {logs.length} Total Events
        </span>
      </div>

      {/* Filters & Search Toolbar (Rule 9 & Rule 19) */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search actor, action, or details..."
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
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Action:</span>
          <select
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value);
              setCurrentPage(1);
            }}
            className="p-1.5 text-xs rounded-md border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="ALL">All Actions</option>
            <option value="VALIDATE_ANALYSIS_ACCEPTED">Accepted Evaluation</option>
            <option value="VALIDATE_ANALYSIS_EDITED">Edited Evaluation</option>
            <option value="VALIDATE_ANALYSIS_REJECTED">Rejected Evaluation</option>
            <option value="PUBLISH_QUESTION_VERSION">Published Question</option>
            <option value="RECORD_LLM_ANALYSIS">Generated Analysis</option>
            <option value="CREATE_SUBJECT">Created Subject</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table (Rule 1, 3, 4, 5, 6) */}
      {filteredLogs.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-2xs">
          <p className="text-xs text-slate-500 mb-2">No audit records match the current criteria.</p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedAction('ALL');
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
              <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Timestamp</th>
                  <th className="px-4 py-2.5">User</th>
                  <th className="px-4 py-2.5">Action</th>
                  <th className="px-4 py-2.5">Target</th>
                  <th className="px-4 py-2.5">Details</th>
                  <th className="px-4 py-2.5 text-right">Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{log.actor}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{log.actorRole}</div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="font-medium text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {actionLabels[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 text-[11px] whitespace-nowrap">
                      {log.entityType}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 max-w-sm truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setActiveLogItem(log)}
                        className="text-xs text-slate-700 hover:text-slate-900 font-medium inline-flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div>
              Showing{' '}
              <span className="font-semibold text-slate-900">
                {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, filteredLogs.length)}
              </span>{' '}
              of <span className="font-semibold text-slate-900">{filteredLogs.length}</span>
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

      {/* Payload Modal */}
      {activeLogItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs uppercase font-bold text-slate-900">
                  {actionLabels[activeLogItem.action] || activeLogItem.action}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {activeLogItem.actor} • {new Date(activeLogItem.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveLogItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto bg-slate-900 text-emerald-400 font-mono text-xs rounded-b-lg">
              <pre>{JSON.stringify(activeLogItem, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
