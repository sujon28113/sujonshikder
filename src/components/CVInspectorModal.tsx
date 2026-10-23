import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Download, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  FileText 
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { personalInfo } from '../data/cvData';

export const CVInspectorModal: React.FC = () => {
  const { isCvModalOpen, setIsCvModalOpen, showToast } = usePortfolio();
  const [zoomScale, setZoomScale] = useState(100);

  if (!isCvModalOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = personalInfo.cvPdfPath;
    link.download = 'Md. Sujon Shikder CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CV PDF download started', 'success');
  };

  const handleOpenNewTab = () => {
    window.open(personalInfo.cvPdfPath, '_blank');
  };

  const handleZoomIn = () => {
    setZoomScale(prev => Math.min(prev + 15, 160));
  };

  const handleZoomOut = () => {
    setZoomScale(prev => Math.max(prev - 15, 70));
  };

  const handleResetZoom = () => {
    setZoomScale(100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/60 backdrop-blur-md">
      {/* Background click to dismiss */}
      <div 
        className="absolute inset-0" 
        onClick={() => setIsCvModalOpen(false)} 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 320, damping: 25 }}
        className="relative z-10 w-full max-w-5xl h-[92vh] bg-warm-bg dark:bg-espresso-card rounded-3xl border border-warm-border dark:border-espresso-border shadow-warm-lg dark:shadow-dark-lg flex flex-col overflow-hidden"
      >
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-warm-border/60 dark:border-espresso-border bg-warm-card dark:bg-espresso-bg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-warm-accent/20 border border-warm-accent/40 text-warm-text">
              <FileText className="w-5 h-5 text-warm-accent" />
            </div>
            <div>
              <h3 className="text-base font-bold text-warm-text dark:text-espresso-text flex items-center gap-2">
                <span>Md. Sujon Shikder — Official CV</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Verified PDF
                </span>
              </h3>
              <p className="text-xs font-mono text-warm-subtle">
                University of Dhaka &middot; ICAB CA Candidate &middot; 91.6 KB
              </p>
            </div>
          </div>

          {/* Action buttons & Zoom Controls */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-xl bg-warm-bg dark:bg-espresso-card border border-warm-border/70 dark:border-espresso-border text-xs font-mono">
              <button
                onClick={handleZoomOut}
                className="p-1 hover:text-warm-accent transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-bold tabular-nums text-warm-text dark:text-espresso-text">
                {zoomScale}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1 hover:text-warm-accent transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              {zoomScale !== 100 && (
                <button
                  onClick={handleResetZoom}
                  className="p-1 hover:text-warm-accent transition-colors border-l border-warm-border/60 ml-1 pl-1.5"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Open in new tab */}
            <button
              onClick={handleOpenNewTab}
              className="p-2 rounded-xl bg-warm-bg dark:bg-espresso-card border border-warm-border/70 dark:border-espresso-border text-warm-text dark:text-espresso-text hover:border-warm-accent text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Open raw PDF in new browser tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">New Tab</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-warm-accent hover:bg-warm-accent-hover text-warm-text text-xs font-bold shadow-warm-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsCvModalOpen(false)}
              className="p-2 rounded-xl hover:bg-warm-hover dark:hover:bg-espresso-hover text-warm-subtle transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Container */}
        <div className="flex-1 bg-warm-bg dark:bg-espresso-bg/40 p-2 sm:p-4 overflow-auto flex items-center justify-center">
          <div 
            className="w-full h-full rounded-2xl overflow-hidden border border-warm-border dark:border-espresso-border bg-white shadow-inner flex flex-col transition-all duration-200"
            style={{ transform: `scale(${zoomScale / 100})`, transformOrigin: 'top center' }}
          >
            <object
              data={`${personalInfo.cvPdfPath}#toolbar=1&navpanes=0`}
              type="application/pdf"
              className="w-full h-full"
            >
              <iframe
                src={`${personalInfo.cvPdfPath}#toolbar=1`}
                title="Md. Sujon Shikder CV PDF Viewer"
                className="w-full h-full border-0"
              >
                <div className="p-8 text-center text-sm text-warm-muted">
                  <p>Your browser does not support inline PDF viewing.</p>
                  <button
                    onClick={handleDownload}
                    className="mt-4 px-4 py-2 bg-warm-accent text-warm-text rounded-xl font-bold"
                  >
                    Download CV to View
                  </button>
                </div>
              </iframe>
            </object>
          </div>
        </div>

        {/* Bottom Status bar */}
        <div className="px-6 py-2.5 bg-warm-card dark:bg-espresso-bg border-t border-warm-border/60 dark:border-espresso-border flex items-center justify-between text-[11px] font-mono text-warm-subtle">
          <span>File: <code>/public/Md. Sujon Shikder CV.pdf</code></span>
          <span className="hidden sm:inline">Press ESC to exit modal</span>
        </div>
      </motion.div>
    </div>
  );
};
