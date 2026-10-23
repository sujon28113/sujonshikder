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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-gray-100 p-6 sm:p-8 shadow-2xl text-center">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-yellow-400 text-[#111827] flex items-center justify-center shadow-lg shadow-yellow-400/30 mb-5 animate-bounce">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>

        <h3 className="text-2xl font-heading font-extrabold text-[#111827] tracking-tight mb-2">
          Split Completed!
        </h3>
        <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto font-light">
          Your new file has been created and your download started automatically.
        </p>

        {/* File summary pill box */}
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 text-left mb-6 space-y-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <FileCheck className="w-5 h-5 text-yellow-600 shrink-0" />
            <span className="text-sm font-bold text-[#111827] truncate font-mono">
              {resultData.filename}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-200">
            <span className="flex items-center gap-1.5 font-mono">
              <HardDrive className="w-3.5 h-3.5 text-gray-400" />
              {formatBytes(resultData.size)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-yellow-600" />
              <strong className="text-gray-800 font-bold">{resultData.pagesCount}</strong> {resultData.pagesCount === 1 ? 'page' : 'pages'} extracted
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onDownloadAgain}
            className="w-full sm:flex-1 py-3 px-5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-[#111827] text-xs font-bold transition-all shadow-[0_4px_14px_0_rgba(250,204,21,0.39)] hover:shadow-[0_6px_20px_rgba(250,204,21,0.23)] flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Again</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:flex-1 py-3 px-5 rounded-full bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border-2 border-gray-200 hover:border-yellow-400 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span>Split Another File</span>
          </button>
        </div>
      </div>
    </div>
  );
}
