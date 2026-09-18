import React, { useState } from 'react';
import { QuestionSet, Question, QuestionVersion, ConceptIndicator } from '../../../types';
import { WeightSumIndicator } from '../../common/WeightSumIndicator';
import { ConfirmModal } from '../../common/ConfirmModal';
import {
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  GitBranch,
  Send,
} from 'lucide-react';

interface LecturerQuestionEditorViewProps {
  questionSet: QuestionSet;
  question: Question;
  onBack: () => void;
  onPublishVersion: (versionId: string) => void;
  onCreateNewVersion: (questionId: string) => void;
}

export const LecturerQuestionEditorView: React.FC<LecturerQuestionEditorViewProps> = ({
  questionSet,
  question,
  onBack,
  onPublishVersion,
  onCreateNewVersion,
}) => {
  const [selectedVersionId, setSelectedVersionId] = useState(question.activeVersionId);
  const activeVersion =
    question.versions.find((v) => v.id === selectedVersionId) || question.versions[0];

  // Editable version draft state
  const [prompt, setPrompt] = useState(activeVersion.prompt);
  const [modelAnswer, setModelAnswer] = useState(activeVersion.modelAnswer);
  const [indicators, setIndicators] = useState<ConceptIndicator[]>(activeVersion.indicators);
  const [isWeightValid, setIsWeightValid] = useState(true);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Sync state if selected version changes
  React.useEffect(() => {
    setPrompt(activeVersion.prompt);
    setModelAnswer(activeVersion.modelAnswer);
    setIndicators(activeVersion.indicators);
  }, [selectedVersionId, activeVersion]);

  // Handle indicator weight change
  const handleUpdateIndicator = (id: string, field: keyof ConceptIndicator, val: any) => {
    setIndicators((prev) =>
      prev.map((ind) => (ind.id === id ? { ...ind, [field]: val } : ind))
    );
  };

  // Add indicator
  const handleAddIndicator = () => {
    const newInd: ConceptIndicator = {
      id: `ci-new-${Date.now()}`,
      code: `IND-${indicators.length + 1}`,
      label: 'New Concept Indicator',
      weight: 0.1,
      clinicalRationale: 'Rationale for assessment dimension',
    };
    setIndicators([...indicators, newInd]);
  };

  // Remove indicator
  const handleRemoveIndicator = (id: string) => {
    setIndicators((prev) => prev.filter((ind) => ind.id !== id));
  };

  const weightsList = indicators.map((ind) => Number(ind.weight) || 0);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Question Set ({questionSet.code})</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Version Switcher */}
          <div className="flex items-center gap-1.5 text-xs">
            <GitBranch className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Version:</span>
            <select
              value={selectedVersionId}
              onChange={(e) => setSelectedVersionId(e.target.value)}
              className="p-1 text-xs rounded-md border border-slate-200 bg-white font-medium text-slate-800"
            >
              {question.versions.map((v) => (
                <option key={v.id} value={v.id}>
                  v{v.versionNumber} {v.isPublished ? '(Published)' : '(Draft)'}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => onCreateNewVersion(question.id)}
            className="px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>New Version</span>
          </button>
        </div>
      </div>

      {/* Validation & Publish Bar */}
      <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <WeightSumIndicator
            weights={weightsList}
            onValidationChange={(valid) => setIsWeightValid(valid)}
          />
          <div className="text-xs text-slate-500 hidden sm:block">
            Total indicator weights must equal 1.0000 to publish.
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeVersion.isPublished ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Published &amp; Active</span>
            </span>
          ) : (
            <button
              type="button"
              disabled={!isWeightValid}
              onClick={() => setShowPublishModal(true)}
              className="px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Version</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Vignette/Prompt & Concept Indicators Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Form: Prompt & Model Answer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <h2 className="text-xs uppercase font-bold text-slate-900 pb-2 border-b border-slate-100">
              Question Content
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clinical Scenario
              </label>
              <textarea
                rows={3}
                value={activeVersion.clinicalScenario}
                readOnly={activeVersion.isPublished}
                className="w-full p-2.5 text-xs rounded-md border border-slate-300 leading-relaxed font-sans bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Prompt
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                readOnly={activeVersion.isPublished}
                className="w-full p-2.5 text-xs rounded-md border border-slate-300 leading-relaxed font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Model Answer Benchmark
              </label>
              <textarea
                rows={5}
                value={modelAnswer}
                onChange={(e) => setModelAnswer(e.target.value)}
                readOnly={activeVersion.isPublished}
                className="w-full p-2.5 text-xs rounded-md border border-slate-300 leading-relaxed font-sans bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Right Form: Concept Indicators Table (7 cols - Rule 3: Prefer Tables for Comparable Data) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-xs uppercase font-bold text-slate-900">
                  Concept Indicators ({indicators.length})
                </h2>
                <p className="text-[11px] text-slate-500">
                  Weighted dimensions used to evaluate conceptual mastery.
                </p>
              </div>

              {!activeVersion.isPublished && (
                <button
                  type="button"
                  onClick={handleAddIndicator}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Indicator</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 w-20">Code</th>
                    <th className="px-3 py-2">Indicator Label</th>
                    <th className="px-3 py-2 text-right w-24">Weight</th>
                    {!activeVersion.isPublished && <th className="px-3 py-2 text-right w-12">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {indicators.map((ind) => (
                    <tr key={ind.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={ind.code}
                          readOnly={activeVersion.isPublished}
                          onChange={(e) => handleUpdateIndicator(ind.id, 'code', e.target.value)}
                          className="w-full p-1 font-mono font-bold text-xs bg-white border border-slate-200 rounded"
                        />
                      </td>

                      <td className="px-3 py-2 space-y-1">
                        <input
                          type="text"
                          value={ind.label}
                          readOnly={activeVersion.isPublished}
                          onChange={(e) => handleUpdateIndicator(ind.id, 'label', e.target.value)}
                          className="w-full p-1 bg-white border border-slate-200 rounded text-slate-900 font-medium text-xs"
                          placeholder="Indicator name..."
                        />
                        <input
                          type="text"
                          value={ind.clinicalRationale}
                          readOnly={activeVersion.isPublished}
                          onChange={(e) =>
                            handleUpdateIndicator(ind.id, 'clinicalRationale', e.target.value)
                          }
                          className="w-full p-1 bg-slate-50 border border-slate-200 rounded text-slate-500 text-[11px]"
                          placeholder="Clinical rationale..."
                        />
                      </td>

                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          step="0.05"
                          min="0.0"
                          max="1.0"
                          value={ind.weight}
                          readOnly={activeVersion.isPublished}
                          onChange={(e) =>
                            handleUpdateIndicator(ind.id, 'weight', parseFloat(e.target.value) || 0)
                          }
                          className="w-20 p-1 text-right font-mono font-bold text-xs bg-white border border-slate-200 rounded"
                        />
                      </td>

                      {!activeVersion.isPublished && (
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveIndicator(ind.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <WeightSumIndicator weights={weightsList} />
              <span className="text-slate-400 font-mono text-[11px]">
                {indicators.length} indicators
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Publish Confirm Modal (Rule 8: Consequence Clear) */}
      <ConfirmModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onConfirm={() => {
          onPublishVersion(activeVersion.id);
          setShowPublishModal(false);
        }}
        variant="primary"
        title="Publish Question Version"
        message={`Publish version ${activeVersion.versionNumber}? Once published, students will be able to answer this version and the prompt and weights will be locked.`}
        confirmText="Publish Version"
      />
    </div>
  );
};
