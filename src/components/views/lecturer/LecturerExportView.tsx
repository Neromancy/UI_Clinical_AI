import React, { useState } from 'react';
import { Subject, Submission } from '../../../types';
import {
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Search,
  Info,
} from 'lucide-react';

interface LecturerExportViewProps {
  subject: Subject;
  submissions: Submission[];
}

export const LecturerExportView: React.FC<LecturerExportViewProps> = ({
  subject,
  submissions,
}) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [includeStudentIdentifiers, setIncludeStudentIdentifiers] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [previewSearch, setPreviewSearch] = useState('');

  // Only validated data leaves the system
  const validatedRecords = submissions.filter((s) => s.status === 'VALIDATED');

  const filteredPreviewRecords = validatedRecords.filter((s) => {
    if (!previewSearch.trim()) return true;
    const term = previewSearch.toLowerCase();
    return (
      s.studentName.toLowerCase().includes(term) ||
      s.questionTitle.toLowerCase().includes(term)
    );
  });

  const handleStartExport = () => {
    setIsExporting(true);
    setDownloadReady(false);
    setTimeout(() => {
      setIsExporting(false);
      setDownloadReady(true);
    }, 800);
  };

  const handleTriggerDownload = () => {
    if (exportFormat === 'csv') {
      const headers = 'Submission_ID,Student,Question,Final_Score,Performance_Level,Validated_At\n';
      const rows = validatedRecords
        .map(
          (s) =>
            `${s.id},${includeStudentIdentifiers ? s.studentName : 'STUDENT_' + s.id.slice(-4)},"${s.questionTitle.replace(/"/g, '""')}",${s.validation?.finalScore || 80},${s.validation?.finalTierName || 'Tier 1'},${s.validation?.validatedAt || '2026-09-18'}`
        )
        .join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${subject.code}_validated_analytics_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Export Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Export validated student responses and evaluation data for analysis.
          </p>
        </div>
      </div>

      {/* Provenance Banner */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 flex items-start gap-2.5 text-xs text-slate-700">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-semibold text-slate-900">Validated Records Only</div>
          <p className="text-slate-600 leading-relaxed">
            Only responses with completed faculty reviews are included in exports. Submissions currently awaiting review or rejected are excluded.
          </p>
          <div className="text-[11px] text-slate-500 font-medium pt-1">
            Eligible records for {subject.name}: {validatedRecords.length} validated responses
          </div>
        </div>
      </div>

      {/* Export Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Format Selection */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
          <h2 className="text-xs uppercase font-bold text-slate-900">Export Format</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 p-2.5 rounded-md border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="radio"
                name="format"
                checked={exportFormat === 'csv'}
                onChange={() => {
                  setExportFormat('csv');
                  setDownloadReady(false);
                }}
                className="text-slate-900"
              />
              <FileSpreadsheet className="w-4 h-4 text-slate-600" />
              <div className="text-xs">
                <span className="font-semibold text-slate-900 block">CSV Spreadsheet</span>
                <span className="text-[11px] text-slate-500">Raw tabular data for analysis</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded-md border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="radio"
                name="format"
                checked={exportFormat === 'pdf'}
                onChange={() => {
                  setExportFormat('pdf');
                  setDownloadReady(false);
                }}
                className="text-slate-900"
              />
              <FileText className="w-4 h-4 text-slate-600" />
              <div className="text-xs">
                <span className="font-semibold text-slate-900 block">Summary Document (PDF)</span>
                <span className="text-[11px] text-slate-500">Structured summary report</span>
              </div>
            </label>
          </div>
        </div>

        {/* Options */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
          <h2 className="text-xs uppercase font-bold text-slate-900">Privacy Options</h2>
          <div className="space-y-2">
            <label className="flex items-start gap-2.5 p-2.5 rounded-md border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={includeStudentIdentifiers}
                onChange={(e) => {
                  setIncludeStudentIdentifiers(e.target.checked);
                  setDownloadReady(false);
                }}
                className="mt-0.5 rounded text-slate-900"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-900 block">Include Student Names</span>
                <span className="text-[11px] text-slate-500">
                  When unchecked, identifiers will be pseudonymized (e.g. STUDENT_101)
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Export Action */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <h2 className="text-xs uppercase font-bold text-slate-900">Generate Export</h2>
            <p className="text-xs text-slate-500 mt-1">
              Creates a downloadable file containing {validatedRecords.length} validated records.
            </p>
          </div>

          <div>
            {downloadReady ? (
              <button
                type="button"
                onClick={handleTriggerDownload}
                className="w-full py-2 px-3 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={isExporting || validatedRecords.length === 0}
                onClick={handleStartExport}
                className="w-full py-2 px-3 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-2xs"
              >
                {isExporting ? (
                  <span>Generating Export...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Generate Export</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dataset Preview Table (Rule 3: Prefer Tables for Comparable Data) */}
      <div className="space-y-2 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xs uppercase font-bold text-slate-900">
            Export Dataset Preview ({filteredPreviewRecords.length} records)
          </h2>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter preview records..."
              value={previewSearch}
              onChange={(e) => setPreviewSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Student</th>
                  <th className="px-4 py-2.5">Question</th>
                  <th className="px-4 py-2.5 text-right">Score</th>
                  <th className="px-4 py-2.5">Performance Level</th>
                  <th className="px-4 py-2.5">Validated Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPreviewRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-slate-900">
                      {includeStudentIdentifiers ? rec.studentName : `STUDENT_${rec.id.slice(-4)}`}
                    </td>
                    <td className="px-4 py-2.5 max-w-sm truncate text-slate-800" title={rec.questionTitle}>
                      {rec.questionTitle}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                      {rec.validation?.finalScore || rec.analysis?.percentageScore || '—'}%
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                        {rec.validation?.finalTierName || rec.analysis?.tierName || 'Tier 1'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 text-[11px] whitespace-nowrap">
                      {rec.validation?.validatedAt
                        ? new Date(rec.validation.validatedAt).toLocaleDateString()
                        : '2026-09-18'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
