import React from 'react';
import { CheckCircle2, Download, RefreshCw, X, FileCheck, HardDrive, Layers } from 'lucide-react';
import { formatBytes } from '../utils/pdfUtils';

export default function SuccessModal({
  isOpen,
  onClose,
  resultData,
  onReset,
  onDownloadAgain,
}) {
  if (!isOpen || !resultData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0e1424] border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-950/50 text-center">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-5 animate-bounce">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>

        <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">
          Split Completed!
        </h3>
        <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
          Your new file has been created and your download started automatically.
        </p>

        {/* File summary pill box */}
        <div className="rounded-2xl bg-[#07090e]/80 border border-white/5 p-4 text-left mb-6 space-y-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <FileCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-bold text-white truncate font-mono">
              {resultData.filename}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-white/5">
            <span className="flex items-center gap-1.5 font-mono">
              <HardDrive className="w-3.5 h-3.5 text-slate-500" />
              {formatBytes(resultData.size)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              {resultData.pagesCount} {resultData.pagesCount === 1 ? 'page' : 'pages'} extracted
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onDownloadAgain}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Again</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Split Another File</span>
          </button>
        </div>
      </div>
    </div>
  );
}
