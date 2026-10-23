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
      <div className="rounded-3xl bg-[#0b0f19]/95 border border-indigo-500/25 p-4 sm:p-5 shadow-2xl shadow-indigo-950/60 backdrop-blur-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Summary */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Scissors className="w-5 h-5 -rotate-45" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">
                {canSplit ? (
                  <>
                    Ready to extract{' '}
                    <span className="text-indigo-400 font-mono">
                      {pages.length} {pages.length === 1 ? 'page' : 'pages'}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400">Select pages to proceed</span>
                )}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                {splitMode === 'single' ? 'Single PDF' : 'ZIP Bundle'}
              </span>
            </div>

            <p className="text-xs text-slate-400 truncate max-w-sm">
              {error ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 inline" /> {error}
                </span>
              ) : pages.length > 0 ? (
                `Pages: ${pages.join(', ')}`
              ) : (
                'Set your range above or click page cards'
              )}
            </p>
          </div>
        </div>

        {/* Right: Big CTA Button */}
        <button
          type="button"
          disabled={!canSplit}
          onClick={onSplit}
          className={`relative group inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-300 shadow-xl select-none
            ${
              canSplit
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed shadow-none'
            }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Processing PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>Split & Download</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-200 animate-pulse" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
