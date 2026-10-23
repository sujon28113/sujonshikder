import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Layers, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { renderPageThumbnail } from '../utils/pdfRenderer';

function BoundaryCard({ label, pageNum, pdfBuffer, badgeColor = 'indigo' }) {
  const canvasRef = useRef(null);
  const [isRendered, setIsRendered] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsRendered(false);
    setHasError(false);

    // Debounce rendering slightly for smooth typing in range box
    const timer = setTimeout(async () => {
      if (!canvasRef.current || !pdfBuffer || !pageNum) return;
      try {
        await renderPageThumbnail(pdfBuffer, pageNum, canvasRef.current, 240);
        if (!isCancelled) {
          setIsRendered(true);
        }
      } catch (err) {
        if (!isCancelled) {
          setHasError(true);
        }
      }
    }, 120);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [pdfBuffer, pageNum]);

  const badgeStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    violet: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  }[badgeColor] || 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';

  return (
    <div className="flex flex-col items-center flex-1 max-w-[280px] w-full">
      {/* Label Badge */}
      <div className="flex items-center justify-between w-full px-2 mb-2.5">
        <span className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${badgeStyles}`}>
          {label}
        </span>
        <span className="text-xs font-mono font-bold text-white bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
          Page {pageNum}
        </span>
      </div>

      {/* Canvas Card */}
      <div className="relative w-full aspect-[1/1.414] rounded-2xl overflow-hidden bg-[#07090e] border border-white/10 shadow-2xl flex items-center justify-center p-1 group hover:border-indigo-500/40 transition-all duration-300">
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-contain rounded-xl transition-opacity duration-300 ${
            isRendered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Placeholder / Shimmer while loading */}
        {(!isRendered || hasError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-900/60">
            <div className="w-full space-y-2.5 opacity-30 animate-pulse">
              <div className="h-3.5 bg-slate-400 rounded w-1/2 mx-auto"></div>
              <div className="h-2 bg-slate-500 rounded w-4/5 mx-auto"></div>
              <div className="h-2 bg-slate-500 rounded w-2/3 mx-auto"></div>
              <div className="h-2 bg-slate-500 rounded w-3/4 mx-auto"></div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 mt-4">
              Page {pageNum}
            </span>
          </div>
        )}

        {/* Ambient border glow */}
        <div className="absolute inset-0 rounded-2xl border border-indigo-400/10 pointer-events-none group-hover:border-indigo-400/30 transition-colors"></div>
      </div>
    </div>
  );
}

export default function RangePreview({ selectedPages, pdfBuffer, totalPages }) {
  const hasPages = selectedPages && selectedPages.length > 0;
  const firstPage = hasPages ? selectedPages[0] : null;
  const lastPage = hasPages ? selectedPages[selectedPages.length - 1] : null;
  const isSinglePage = hasPages && firstPage === lastPage;

  return (
    <div className="mt-8 rounded-3xl bg-[#0b0f1c]/90 border border-white/[0.07] p-6 sm:p-8 shadow-xl shadow-black/40 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Range Boundary Preview
            </h3>
            <p className="text-xs text-slate-400">
              Showing first and last page of the selected split range
            </p>
          </div>
        </div>

        {hasPages && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{selectedPages.length} {selectedPages.length === 1 ? 'page' : 'pages'}</span>
          </div>
        )}
      </div>

      {/* Preview Section */}
      {!hasPages ? (
        <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
          <FileText className="w-8 h-8 text-slate-600 animate-pulse" />
          <p className="text-sm">Enter a valid page range above to preview boundaries</p>
        </div>
      ) : isSinglePage ? (
        /* Single Page Preview */
        <div className="flex flex-col items-center justify-center py-2">
          <BoundaryCard
            label="Single Page"
            pageNum={firstPage}
            pdfBuffer={pdfBuffer}
            badgeColor="emerald"
          />
        </div>
      ) : (
        /* First & Last Page Side-by-Side with Flow Indicator */
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-14 py-2">
          {/* First Page */}
          <BoundaryCard
            label="First Page"
            pageNum={firstPage}
            pdfBuffer={pdfBuffer}
            badgeColor="indigo"
          />

          {/* Flow Connector in Middle */}
          <div className="flex flex-col items-center justify-center gap-2 px-2 py-4">
            <div className="hidden sm:flex items-center gap-2 text-indigo-400">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-indigo-400"></div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shadow-lg shadow-indigo-500/20">
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-400 via-indigo-500 to-transparent"></div>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center">
              <span className="text-xs font-mono font-semibold text-slate-300 block">
                {selectedPages.length} Pages Total
              </span>
              <span className="text-[10px] text-slate-500 block">
                p. {firstPage} → p. {lastPage}
              </span>
            </div>
          </div>

          {/* Last Page */}
          <BoundaryCard
            label="Last Page"
            pageNum={lastPage}
            pdfBuffer={pdfBuffer}
            badgeColor="violet"
          />
        </div>
      )}
    </div>
  );
}
