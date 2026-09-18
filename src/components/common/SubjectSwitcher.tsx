import React from 'react';
import { Subject } from '../../types';
import { Layers, ChevronDown, Check, ShieldCheck } from 'lucide-react';

interface SubjectSwitcherProps {
  subjects: Subject[];
  activeSubject: Subject;
  onSelectSubject: (subject: Subject) => void;
  className?: string;
}

export const SubjectSwitcher: React.FC<SubjectSwitcherProps> = ({
  subjects,
  activeSubject,
  onSelectSubject,
  className = '',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium transition-all shadow-2xs"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600" />
          <span className="font-semibold text-slate-900">{activeSubject.code}</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-700 truncate max-w-[140px] sm:max-w-[200px]">
            {activeSubject.name}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg z-50 text-xs">
          <div className="px-2 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Active Clinical Subject
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
              <ShieldCheck className="w-3 h-3" />
              Isolated Data
            </span>
          </div>

          <div className="space-y-1">
            {subjects.map((sub) => {
              const isSelected = sub.id === activeSubject.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    onSelectSubject(sub);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start justify-between gap-2 p-2 rounded-lg text-left transition-colors ${
                    isSelected ? 'bg-indigo-50 text-indigo-900 font-medium' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">{sub.code}</span>
                      <span className="text-slate-700 truncate">{sub.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {sub.studentCount} enrolled • {sub.activeSetsCount} question sets
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 px-2 text-[10px] text-slate-400 leading-tight">
            Student questions and learning materials are isolated to this subject.
          </div>
        </div>
      )}
    </div>
  );
};
