import React, { useEffect, useRef, useState } from 'react';
import { RotateCw, Trash2, ArrowLeft, ArrowRight, Copy } from 'lucide-react';
import { renderPageThumbnail } from '../../utils/pdfRenderer';

function PageCard({
  pageItem,
  index,
  total,
  pdfBuffer,
  onRotate,
  onDelete,
  onDuplicate,
  onMove,
  showControls = true,
}) {
  const canvasRef = useRef(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      if (!canvasRef.current || !pdfBuffer) return;
      try {
        await renderPageThumbnail(pdfBuffer, pageItem.originalIndex + 1, canvasRef.current, 180);
        if (active) setRendered(true);
      } catch (err) {
        console.error(err);
      }
    }, 50 * Math.min(index, 10)); // stagger slightly for smooth loading

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [pdfBuffer, pageItem.originalIndex]);

  return (
    <div className="flex flex-col items-center p-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-yellow-400 hover:shadow-md transition-all group relative">
      {/* Page Header Bar */}
      <div className="flex items-center justify-between w-full mb-2 px-1">
        <span className="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
          {index + 1}
        </span>
        {pageItem.rotation !== 0 && (
          <span className="text-[10px] font-bold text-yellow-800 bg-yellow-100 px-1.5 py-0.5 rounded-full">
            {pageItem.rotation}°
          </span>
        )}
      </div>

      {/* Thumbnail Canvas */}
      <div 
        className="w-full aspect-[1/1.414] rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center p-1 transition-transform"
        style={{ transform: `rotate(${pageItem.rotation}deg)` }}
      >
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-contain rounded transition-opacity duration-300 ${
            rendered ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {!rendered && (
          <div className="animate-pulse text-xs font-mono text-gray-400">
            Page {pageItem.originalIndex + 1}
          </div>
        )}
      </div>

      {/* Control Actions */}
      {showControls && (
        <div className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-gray-100 w-full">
          {onMove && (
            <>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => onMove(index, -1)}
                className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20"
                title="Move left"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={index === total - 1}
                onClick={() => onMove(index, 1)}
                className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20"
                title="Move right"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {onRotate && (
            <button
              type="button"
              onClick={() => onRotate(index)}
              className="p-1 rounded text-gray-500 hover:text-yellow-700 hover:bg-yellow-50"
              title="Rotate 90° clockwise"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}

          {onDuplicate && (
            <button
              type="button"
              onClick={() => onDuplicate(index)}
              className="p-1 rounded text-gray-500 hover:text-yellow-700 hover:bg-yellow-50"
              title="Duplicate page"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              disabled={total <= 1}
              onClick={() => onDelete(index)}
              className="p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-20"
              title="Delete page"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function PageGridThumbnail({
  pages = [],
  pdfBuffer,
  onRotatePage,
  onDeletePage,
  onDuplicatePage,
  onMovePage,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {pages.map((pageItem, index) => (
        <PageCard
          key={`${pageItem.id || index}`}
          pageItem={pageItem}
          index={index}
          total={pages.length}
          pdfBuffer={pdfBuffer}
          onRotate={onRotatePage}
          onDelete={onDeletePage}
          onDuplicate={onDuplicatePage}
          onMove={onMovePage}
        />
      ))}
    </div>
  );
}
