import React from 'react';
import { FileText, ArrowLeft, Layers, HardDrive } from 'lucide-react';
import { formatBytes } from '../utils/pdfUtils';

export default function DocumentHeader({ fileInfo, onReset }) {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
      {/* File detail info */}
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="w-12 h-12 rounded-xl bg-yellow-400 text-[#111827] flex items-center justify-center shrink-0 shadow-md shadow-yellow-400/20">
          <FileText className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-heading font-bold text-[#111827] truncate">
            {fileInfo.name}
          </h2>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
            <span className="flex items-center gap-1 font-mono">
              <HardDrive className="w-3.5 h-3.5 text-gray-400" />
              {formatBytes(fileInfo.size)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-yellow-600" />
              <strong className="text-gray-800 font-bold">{fileInfo.pageCount}</strong> pages total
            </span>
          </div>
        </div>
      </div>

      {/* Change document button */}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-yellow-50 text-xs font-bold text-gray-700 hover:text-yellow-800 border border-gray-200 hover:border-yellow-400 transition-all self-start sm:self-auto shadow-sm hover:-translate-y-0.5 active:translate-y-0"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-gray-500" />
        <span>Choose another PDF</span>
      </button>
    </div>
  );
}
