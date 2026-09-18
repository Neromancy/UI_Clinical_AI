import React, { useState } from 'react';
import { Subject, KnowledgeChunk } from '../../../types';
import {
  Upload,
  FileText,
  Search,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface LecturerKnowledgeBaseViewProps {
  subject: Subject;
  chunks: KnowledgeChunk[];
  onUploadDocument: (file: File) => void;
}

export const LecturerKnowledgeBaseView: React.FC<LecturerKnowledgeBaseViewProps> = ({
  subject,
  chunks: initialChunks,
  onUploadDocument,
}) => {
  const [chunks, setChunks] = useState<KnowledgeChunk[]>(initialChunks);
  const [testQuery, setTestQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([
    { name: 'Braunwald_Heart_Disease_Diastolic.pdf', pages: 34, chunks: 18, indexedAt: '2026-09-10' },
    { name: 'ACC_AHA_HFpEF_Guidelines_2024.pdf', pages: 18, chunks: 9, indexedAt: '2026-09-12' },
  ]);

  React.useEffect(() => {
    setChunks(initialChunks);
  }, [initialChunks]);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedDocs((prev) => [
        ...prev,
        {
          name: file.name,
          pages: 12,
          chunks: 6,
          indexedAt: new Date().toISOString().split('T')[0],
        },
      ]);
    }
  };

  const handleTestSearch = () => {
    if (!testQuery) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{subject.name} Learning Materials</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Reference textbooks and clinical guidelines referenced during evaluation.
          </p>
        </div>

        <label className="px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Document</span>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleSimulatedUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Reference Documents (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <h2 className="text-xs uppercase font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-700" />
              <span>Reference Documents ({uploadedDocs.length})</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Document Name</th>
                    <th className="px-3 py-2 text-right">Sections</th>
                    <th className="px-3 py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {uploadedDocs.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-3 py-2.5">
                        <div className="font-semibold text-slate-900 truncate max-w-xs" title={doc.name}>
                          {doc.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{doc.pages} pages • {doc.indexedAt}</div>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-medium text-slate-700">
                        {doc.chunks}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Reference Excerpt Search (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs uppercase font-bold text-slate-900">
                Reference Material Search
              </h2>
              <span className="text-[11px] text-slate-500">
                Test which textbook passages match specific clinical queries
              </span>
            </div>

            {/* Test search input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search guidelines and reference materials..."
                  value={testQuery}
                  onChange={(e) => setTestQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <button
                type="button"
                onClick={handleTestSearch}
                className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Chunks List */}
            <div className="space-y-2.5 pt-1">
              {chunks.map((chunk, idx) => (
                <div
                  key={`${chunk.id}-${chunk.chunkIndex ?? idx}`}
                  className="p-3 rounded-md border border-slate-200 bg-slate-50/60 text-xs space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold text-slate-900">
                      {chunk.documentTitle}
                    </div>
                    <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                      Match: {Math.round(chunk.similarityScore * 100)}%
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed font-sans bg-white p-2.5 rounded border border-slate-200">
                    &ldquo;{chunk.content}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
