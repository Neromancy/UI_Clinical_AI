import React, { useState } from 'react';
import { SPECIFICATION_SECTIONS, SpecSection } from '../../data/specificationContent';
import {
  FileText,
  Search,
  Copy,
  Check,
  Download,
  BookOpen,
  Layers,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface SpecViewerProps {
  onLaunchPrototype?: (role: string, targetScreen?: string) => void;
}

export const SpecViewer: React.FC<SpecViewerProps> = ({ onLaunchPrototype }) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(SPECIFICATION_SECTIONS[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSection, setCopiedSection] = useState(false);

  const activeSection =
    SPECIFICATION_SECTIONS.find((s) => s.id === activeSectionId) || SPECIFICATION_SECTIONS[0];

  const filteredSections = SPECIFICATION_SECTIONS.filter(
    (s) =>
      searchTerm === '' ||
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contentMarkdown.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopySection = () => {
    navigator.clipboard.writeText(activeSection.contentMarkdown);
    setCopiedSection(true);
    setTimeout(() => setCopiedSection(false), 2000);
  };

  const handleCopyAll = () => {
    const fullSpec = SPECIFICATION_SECTIONS.map((s) => s.contentMarkdown).join('\n\n---\n\n');
    navigator.clipboard.writeText(fullSpec);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const fullSpec = SPECIFICATION_SECTIONS.map((s) => s.contentMarkdown).join('\n\n---\n\n');
    const blob = new Blob([fullSpec], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'AI_Clinical_Misconception_System_UI_UX_Specification.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto p-4 sm:p-6 animate-fadeIn">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-80 shrink-0 space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Specification Index</h3>
                <p className="text-[11px] text-slate-500">Exhaustive P1–P9 UI/UX Blueprint</p>
              </div>
            </div>
          </div>

          {/* Search box */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search specification topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Section list */}
          <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
            {filteredSections.map((sec) => {
              const isActive = sec.id === activeSection.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-full flex items-start justify-between gap-2 p-2.5 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-900 font-semibold border-l-3 border-indigo-600'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs truncate">{sec.title}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{sec.subtitle}</div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 mt-0.5 transition-transform ${
                      isActive ? 'text-indigo-600 translate-x-0.5' : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={handleCopyAll}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Complete Spec Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Complete Spec (All Sections)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Spec as Markdown (.md)</span>
            </button>
          </div>
        </div>

        {/* Prototype banner */}
        {onLaunchPrototype && (
          <div className="rounded-xl border border-indigo-100 bg-linear-to-br from-indigo-50 to-sky-50 p-4 text-xs shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Interactive System Available</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-3">
              Experience the live workflow: switch roles between Student, Lecturer, Researcher, and
              Admin to test the validation queue, answer submissions, and question publishing.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onLaunchPrototype('student', 'code')}
                className="py-1.5 px-2.5 rounded bg-white text-indigo-700 font-semibold border border-indigo-200 hover:bg-indigo-50 text-center transition-colors"
              >
                Student Flow (P3)
              </button>
              <button
                type="button"
                onClick={() => onLaunchPrototype('lecturer', 'validation')}
                className="py-1.5 px-2.5 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 text-center transition-colors"
              >
                Validation Queue (P5)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Document Reader */}
      <div className="flex-1 min-w-0">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-indigo-600 mb-1">
                UI/UX Specification • AI-Clinical Misconception System
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{activeSection.title}</h2>
              <p className="text-xs text-slate-500 mt-1">{activeSection.subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySection}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
                title="Copy current section to clipboard"
              >
                {copiedSection ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied Section</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Section</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Markdown Content Display with clean styling */}
          <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed space-y-4">
            <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
              {activeSection.contentMarkdown}
            </div>
          </div>

          {/* Bottom Pagination */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Section {SPECIFICATION_SECTIONS.findIndex((s) => s.id === activeSection.id) + 1} of{' '}
              {SPECIFICATION_SECTIONS.length}
            </span>
            <div className="flex gap-2">
              {SPECIFICATION_SECTIONS.map((sec, idx) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-6 h-6 rounded-md text-xs font-medium transition-colors ${
                    sec.id === activeSection.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
