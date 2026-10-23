import React from 'react';
import { FileText, ArrowLeft, Layers, HardDrive } from 'lucide-react';
import { formatBytes } from '../utils/pdfUtils';

export default function DocumentHeader({ fileInfo, onReset }) {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md mb-8">
      {/* File detail info */}
      <div className="flex items-center gap-3.5 overflow-hidden">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
          <FileText className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-white truncate">
              {fileInfo.name}
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
            <span className="flex items-center gap-1 font-mono">
              <HardDrive className="w-3 h-3 text-slate-500" />
              {formatBytes(fileInfo.size)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-400" />
              <strong className="text-slate-200">{fileInfo.pageCount}</strong> pages total
            </span>
          </div>
        </div>
      </div>

      {/* Change document button */}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white border border-white/[0.08] transition-all self-start sm:self-auto active:scale-95"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Choose another PDF</span>
      </button>
    </div>
  );
}
