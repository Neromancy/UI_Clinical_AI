import React, { useState } from 'react';
import {
  Cpu,
  FileCode,
  DollarSign,
  Activity,
  Zap,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const AdminSystemView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'models' | 'prompts' | 'maintenance'>('models');
  const [isRefreshingMVs, setIsRefreshingMVs] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState(false);

  const handleRefreshMVs = () => {
    setIsRefreshingMVs(true);
    setRefreshNotice(false);
    setTimeout(() => {
      setIsRefreshingMVs(false);
      setRefreshNotice(true);
      setTimeout(() => setRefreshNotice(false), 3000);
    }, 1500);
  };

  const models = [
    {
      id: 'gemini-2.5-pro-clinical-rag',
      name: 'Gemini 2.5 Pro (Clinical Fine-Tuned)',
      purpose: 'Primary Clinical Reasoning & Misconception Diagnosis',
      contextWindow: '1M tokens',
      costPer1MInput: '$1.25',
      costPer1MOutput: '$5.00',
      activeStatus: 'Active Production Model',
      avgLatencyMs: 1240,
      monthlyUsageTokens: '14.2M tokens',
      estimatedMonthlyCost: '$46.80',
    },
    {
      id: 'text-embedding-004',
      name: 'Google Text Embedding 004',
      purpose: 'Vector Semantic Indexing (HNSW / pgvector)',
      contextWindow: '2048 tokens',
      costPer1MInput: '$0.025',
      costPer1MOutput: 'N/A',
      activeStatus: 'Active Embedding Model',
      avgLatencyMs: 85,
      monthlyUsageTokens: '8.6M tokens',
      estimatedMonthlyCost: '$0.22',
    },
  ];

  const promptTemplates = [
    {
      id: 'pt-clinical-v3.2',
      name: 'Clinical Diagnostic Reasoner v3.2',
      version: '3.2.1',
      lastModified: '2026-09-14 by Prof. Lin',
      description:
        'Standard prompt constructing the clinical evaluation contract, few-shot examples, and exact JSON schema format.',
      fewShotCount: 4,
      temperature: 0.2,
      topP: 0.95,
      status: 'Active In Production',
    },
    {
      id: 'pt-candidate-extract-v1.4',
      name: 'Novel Candidate Misconception Extractor v1.4',
      version: '1.4.0',
      lastModified: '2026-09-02 by Dr. Chen',
      description:
        'Secondary reasoning chain detecting whether an error constitutes an uncataloged candidate misconception for faculty promotion.',
      fewShotCount: 2,
      temperature: 0.3,
      topP: 0.9,
      status: 'Active In Production',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-0.5">
            Infrastructure &amp; AI Governance (P9.4, P9.5, P9.7)
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            System Models, Prompts &amp; Operational Controls
          </h2>
          <p className="text-xs text-slate-500">
            Manage registered LLMs, prompt template versions, token consumption, and scheduled materialized views.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'models' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Registered Models
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('prompts')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'prompts' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prompt Templates
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('maintenance')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'maintenance' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            DB Maintenance
          </button>
        </div>
      </div>

      {/* TAB 1: MODELS */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Monthly Token Usage</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">22.8M tokens</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">99.98% successful calls</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">Est. API Incurred Cost</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">$47.02 / month</div>
              <div className="text-[11px] text-slate-500 mt-1">Budget cap: $250.00 / mo</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">Avg Response Latency</div>
              <div className="text-xl font-bold font-mono text-indigo-600 mt-1">1.24s</div>
              <div className="text-[11px] text-slate-500 mt-1">P95: 1.82s (healthy)</div>
            </div>
          </div>

          <div className="space-y-4">
            {models.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{m.name}</h4>
                      <p className="text-xs text-slate-500">{m.purpose}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    {m.activeStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Latency</span>
                    <span className="font-mono font-semibold text-slate-800">{m.avgLatencyMs} ms</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Pricing Input / Output</span>
                    <span className="font-mono font-semibold text-slate-800">{m.costPer1MInput} / {m.costPer1MOutput}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Monthly Usage</span>
                    <span className="font-mono font-semibold text-slate-800">{m.monthlyUsageTokens}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Cost</span>
                    <span className="font-mono font-bold text-indigo-700">{m.estimatedMonthlyCost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROMPT TEMPLATES */}
      {activeTab === 'prompts' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 text-xs text-indigo-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Prompt templates define the exact clinical evaluation contract and JSON schema output by the LLM. Every version change is audited, and previous prompt versions remain immutable to preserve reproducibility of past analyses.
            </p>
          </div>

          <div className="space-y-4">
            {promptTemplates.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                        v{p.version}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
                    {p.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Few-Shot Examples</span>
                    <span className="font-semibold text-slate-800">{p.fewShotCount} Accredited Pairs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Temperature</span>
                    <span className="font-mono font-semibold text-slate-800">{p.temperature} (Strict Clinical)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Top_P</span>
                    <span className="font-mono font-semibold text-slate-800">{p.topP}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Modified</span>
                    <span className="text-slate-600">{p.lastModified}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DB MAINTENANCE */}
      {activeTab === 'maintenance' && (
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">PostgreSQL Materialized View Refresh (P9.7)</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Misconception profile dashboards and research exports query from the pre-aggregated materialized view <code>mv_student_question_mastery</code>. Scheduled refreshes execute hourly, but admins can trigger an instant concurrent re-aggregation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-800">Trigger Concurrent Refresh</div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                REFRESH MATERIALIZED VIEW CONCURRENTLY mv_student_question_mastery;
              </div>
            </div>

            <button
              type="button"
              onClick={handleRefreshMVs}
              disabled={isRefreshingMVs}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingMVs ? 'animate-spin' : ''}`} />
              <span>{isRefreshingMVs ? 'Refreshing MV...' : 'Execute Refresh'}</span>
            </button>
          </div>

          {refreshNotice && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Materialized views refreshed concurrently in 1.48s. Analytical cache updated.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
