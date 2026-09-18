import React from 'react';
import { KnowledgeChunk } from '../../types';
import { FileText, Database, ShieldAlert, Sparkles, Binary } from 'lucide-react';

interface RAGContextPanelProps {
  chunks: KnowledgeChunk[];
  userRole: 'student' | 'lecturer' | 'researcher' | 'admin';
  subjectName?: string;
  className?: string;
}

export const RAGContextPanel: React.FC<RAGContextPanelProps> = ({
  chunks,
  userRole,
  subjectName,
  className = '',
}) => {
  // Guardrail: Students are forbidden from seeing raw RAG chunks
  if (userRole === 'student') {
    return (
      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-slate-400" />
        <span>RAG Context &amp; Knowledge Base Chunks are restricted to faculty reviewers.</span>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-xs ${className}`}>
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              RAG Knowledge Retrieval Context ({chunks.length} Chunks)
            </h4>
            <span className="text-[11px] text-slate-500">
              Subject-Isolated HNSW pgvector search {subjectName ? `• ${subjectName}` : ''}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
          Curriculum Anchored
        </span>
      </div>

      <div className="space-y-3">
        {chunks.map((chunk, idx) => {
          const simScore = Math.round(chunk.similarityScore * 100);
          return (
            <div
              key={`${chunk.id || 'chunk'}-${idx}`}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5 font-medium">
                <div className="flex items-center gap-1.5 text-slate-800 truncate">
                  <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="font-semibold truncate" title={chunk.documentTitle}>
                    {chunk.documentTitle}
                  </span>
                  <span className="text-slate-400">#chunk-{chunk.chunkIndex}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 font-mono">
                  <span className="text-[10px] text-slate-500">Cosine:</span>
                  <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-bold text-indigo-700">
                    {chunk.similarityScore.toFixed(3)} ({simScore}%)
                  </span>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed italic bg-white p-2.5 rounded border border-slate-100">
                "{chunk.content}"
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
