import React, { useState } from 'react';
import { AuditLogItem } from '../../types';
import { X, History, Shield, Filter, Search, ArrowRight } from 'lucide-react';

interface AuditTrailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogItem[];
  entityFilter?: string;
  subjectFilter?: string;
}

export const AuditTrailDrawer: React.FC<AuditTrailDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  entityFilter,
  subjectFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((l) => {
    const matchSearch =
      searchTerm === '' ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEntity = !entityFilter || l.entityType.includes(entityFilter) || l.entityId === entityFilter;
    const matchSubject = !subjectFilter || !l.subjectId || l.subjectId === subjectFilter;
    return matchSearch && matchEntity && matchSubject;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">System Audit Trail</h3>
              <p className="text-xs text-slate-500">Immutable forensic logbook of all mutations</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close Audit Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-3 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit actions, actors, entities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Logs list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No audit records found matching criteria.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs space-y-1.5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono font-bold text-[11px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <div className="text-slate-800 font-medium">{log.details}</div>

                {log.diffSummary && (
                  <div className="text-[11px] text-emerald-700 bg-emerald-50/70 p-1.5 rounded border border-emerald-200 font-mono">
                    {log.diffSummary}
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                  <span>Actor: {log.actor}</span>
                  <span>Target: {log.entityType}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            Audit integrity compliant
          </span>
          <span>{filteredLogs.length} events logged</span>
        </div>
      </div>
    </div>
  );
};
