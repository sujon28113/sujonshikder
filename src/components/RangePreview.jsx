import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Layers, FileText, CheckCircle2 } from 'lucide-react';
import { renderPageThumbnail } from '../utils/pdfRenderer';

function BoundaryCard({ label, pageNum, pdfBuffer }) {
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

  return (
    <div className="flex flex-col items-center flex-1 max-w-[280px] w-full">
      {/* Label Badge */}
      <div className="flex items-center justify-between w-full px-2 mb-2.5">
        <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
          {label}
        </span>
        <span className="text-xs font-mono font-bold text-gray-700 bg-white px-2.5 py-0.5 rounded-lg border border-gray-200 shadow-xs">
          Page {pageNum}
        </span>
      </div>

      {/* Canvas Card */}
      <div className="relative w-full aspect-[1/1.414] rounded-2xl overflow-hidden bg-white border-2 border-gray-200 shadow-md flex items-center justify-center p-1 group hover:border-yellow-400 hover:shadow-xl transition-all duration-300">
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-contain rounded-xl transition-opacity duration-300 ${
            isRendered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Placeholder / Shimmer while loading */}
        {(!isRendered || hasError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gray-50">
            <div className="w-full space-y-2.5 opacity-40 animate-pulse">
              <div className="h-3.5 bg-gray-300 rounded w-1/2 mx-auto"></div>
              <div className="h-2 bg-gray-300 rounded w-4/5 mx-auto"></div>
              <div className="h-2 bg-gray-300 rounded w-2/3 mx-auto"></div>
              <div className="h-2 bg-gray-300 rounded w-3/4 mx-auto"></div>
            </div>
            <span className="text-xs font-mono font-bold text-gray-400 mt-4">
              Page {pageNum}
            </span>
          </div>
        )}
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
    <div className="mt-8 rounded-3xl bg-gray-50/70 border border-gray-200/80 p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-yellow-400 text-[#111827] flex items-center justify-center shadow-md shadow-yellow-400/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-heading font-bold text-[#111827] tracking-tight">
              Range Boundary Preview
            </h3>
            <p className="text-xs text-gray-500">
              Showing first and last page of the selected split range
            </p>
          </div>
        </div>

        {hasPages && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{selectedPages.length} {selectedPages.length === 1 ? 'page' : 'pages'}</span>
          </div>
        )}
      </div>

      {/* Preview Section */}
      {!hasPages ? (
        <div className="py-12 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
          <FileText className="w-8 h-8 text-gray-300 animate-pulse" />
          <p className="text-sm">Enter a valid page range above to preview boundaries</p>
        </div>
      ) : isSinglePage ? (
        /* Single Page Preview */
        <div className="flex flex-col items-center justify-center py-2">
          <BoundaryCard
            label="Single Page"
            pageNum={firstPage}
            pdfBuffer={pdfBuffer}
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
          />

          {/* Flow Connector in Middle */}
          <div className="flex flex-col items-center justify-center gap-2 px-2 py-4">
            <div className="hidden sm:flex items-center gap-2 text-yellow-600">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-yellow-500"></div>
              <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-[#111827] flex items-center justify-center shadow-md shadow-yellow-400/25">
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-yellow-500 via-yellow-400 to-transparent"></div>
            </div>

            <div className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-center shadow-xs">
              <span className="text-xs font-mono font-bold text-gray-800 block">
                {selectedPages.length} Pages Total
              </span>
              <span className="text-[10px] text-gray-500 block">
                p. {firstPage} → p. {lastPage}
              </span>
            </div>
          </div>

          {/* Last Page */}
          <BoundaryCard
            label="Last Page"
            pageNum={lastPage}
            pdfBuffer={pdfBuffer}
          />
        </div>
      )}
    </div>
  );
}
