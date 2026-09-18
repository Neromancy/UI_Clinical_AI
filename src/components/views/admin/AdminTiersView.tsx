import React from 'react';
import { DiagnosticTier } from '../../../types';
import { Layers, ShieldAlert, CheckCircle2, Award, Info } from 'lucide-react';

interface AdminTiersViewProps {
  tiers: DiagnosticTier[];
}

export const AdminTiersView: React.FC<AdminTiersViewProps> = ({ tiers }) => {
  const getScoreRange = (level: number) => {
    switch (level) {
      case 1:
        return '90% – 100%';
      case 2:
        return '70% – 89%';
      case 3:
        return '50% – 69%';
      case 4:
        return '0% – 49% (Safety Hazard)';
      default:
        return 'Variable';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-0.5">
            Diagnostic Taxonomy Governance (P1.3)
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Clinical Diagnostic Tiers &amp; Safety Thresholds
          </h2>
          <p className="text-xs text-slate-500">
            Standard four-tier evaluation framework. Tiers categorize conceptual understanding and isolate dangerous clinical safety contraindications.
          </p>
        </div>
      </div>

      {/* Tiers List */}
      <div className="space-y-4">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-md font-bold text-xs"
                  style={{
                    backgroundColor: `${tier.color}15`,
                    color: tier.color,
                    border: `1px solid ${tier.color}40`,
                  }}
                >
                  Level {tier.level} • {tier.code}
                </span>
                <h3 className="text-base font-bold text-slate-900">{tier.name}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{tier.description}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Score Range</div>
                <div className="text-sm font-mono font-bold text-slate-800">
                  {getScoreRange(tier.level)}
                </div>
              </div>

              <div
                className="w-4 h-12 rounded-lg"
                style={{ backgroundColor: tier.color }}
                title={`Color Token: ${tier.color}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Governance & Architectural Rationale Note */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-xs text-indigo-950 space-y-2">
        <div className="font-bold flex items-center gap-1.5">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>Clinical Education Architecture Rule (Decision #1 &amp; #2)</span>
        </div>
        <p className="leading-relaxed">
          The 4-tier model is preferred over simple 3-category rubrics (Correct, Partial, Incorrect)
          because medical education requires separating benign incomplete recall from active
          therapeutic hazards (Tier 4). A student who recommends vasodilators for severe aortic
          stenosis exhibits a critical physiological misconception that requires high-urgency faculty
          remediation.
        </p>
      </div>
    </div>
  );
};
