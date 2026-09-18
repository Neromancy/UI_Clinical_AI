import React, { useState } from 'react';
import { Subject } from '../../../types';
import {
  Layers,
  Plus,
  Users,
  Shield,
  BookOpen,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface AdminSubjectsViewProps {
  subjects: Subject[];
  onAddSubject: (subject: Partial<Subject>) => void;
}

export const AdminSubjectsView: React.FC<AdminSubjectsViewProps> = ({
  subjects,
  onAddSubject,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCode) return;
    onAddSubject({
      id: `subj-${Date.now()}`,
      name: newName,
      code: newCode.toUpperCase(),
      slug: newCode.toLowerCase(),
      description: newDescription,
      lecturerCount: 2,
      studentCount: 0,
      activeSetsCount: 0,
      accentColor: 'indigo',
      icon: 'BookOpen',
    });
    setNewName('');
    setNewCode('');
    setNewDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-0.5">
            Subject Provisioning &amp; Scope Isolation (P1.1, P1.2)
          </div>
          <h2 className="text-xl font-bold text-slate-900">Academic Subjects Management</h2>
          <p className="text-xs text-slate-500">
            Define subject boundary partitions. Every database query, vector chunk, and evaluation is
            enforced by <code className="text-indigo-600 font-mono">user_subject_roles</code>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Subject</span>
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((subj) => (
          <div
            key={subj.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {subj.code}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Isolated Vector Scope</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{subj.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                {subj.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Assigned Faculty:</span>
                </span>
                <span className="font-semibold text-slate-900">
                  {subj.lecturerCount} Lecturers
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Enrolled Cohort:</span>
                <span className="font-mono font-bold text-slate-800">
                  {subj.studentCount} candidates
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Provisioning Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-indigo-50 text-indigo-600">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Provision Subject</h3>
                  <p className="text-xs text-slate-500">Creates isolated database &amp; vector tenant</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Clinical Nephrology & Fluid Dynamics"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Code (Uppercase)
                </label>
                <input
                  type="text"
                  placeholder="e.g. NEPH101"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 font-mono uppercase font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Curricular Scope Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Pathophysiology, diagnostic indicators, and pharmacotherapy..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 font-sans"
                />
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs"
              >
                Provision Subject Scope
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
