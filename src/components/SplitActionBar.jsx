import React from 'react';
import { Scissors, Download, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function SplitActionBar({
  parsedResult,
  splitMode,
  isProcessing,
  onSplit,
}) {
  const { valid, pages, error } = parsedResult;
  const canSplit = valid && pages.length > 0 && !isProcessing;

  return (
    <div className="sticky bottom-4 z-40 mt-8">
      <div className="rounded-3xl bg-white/95 border border-gray-200 p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Summary */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-yellow-400 text-[#111827] flex items-center justify-center shrink-0 shadow-md shadow-yellow-400/20">
            <Scissors className="w-5 h-5 -rotate-45" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-heading font-bold text-[#111827] tracking-tight">
                {canSplit ? (
                  <>
                    Ready to extract{' '}
                    <span className="text-yellow-600 font-mono font-bold">
                      {pages.length} {pages.length === 1 ? 'page' : 'pages'}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400">Select pages to proceed</span>
                )}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                {splitMode === 'single' ? 'Single PDF' : 'ZIP Archive'}
              </span>
            </div>

            <p className="text-xs text-gray-500 truncate max-w-sm">
              {error ? (
                <span className="text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 inline" /> {error}
                </span>
              ) : pages.length > 0 ? (
                `Pages: ${pages.join(', ')}`
              ) : (
                'Set your range above or apply presets'
              )}
            </p>
          </div>
        </div>

        {/* Right: Big CTA Button */}
        <button
          type="button"
          disabled={!canSplit}
          onClick={onSplit}
          className={`relative group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold transition-all duration-200 select-none
            ${
              canSplit
                ? 'bg-yellow-400 hover:bg-yellow-500 text-[#111827] shadow-[0_4px_14px_0_rgba(250,204,21,0.39)] hover:shadow-[0_6px_20px_rgba(250,204,21,0.23)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none'
            }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
              <span>Processing PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>Split & Download</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-800 animate-pulse" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
