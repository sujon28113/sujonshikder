import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function DropZone({ onFileSelect, onDemoSelect, isGeneratingDemo }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        onFileSelect(file);
      } else {
        alert('Please upload a valid PDF document.');
      }
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-16">
      {/* Hero Header */}
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Lightning Fast Client-Side PDF Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Split PDF pages <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            with precision
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
          Specify custom page ranges, extract single sheets, or batch split. 
          Everything executes in your browser with zero server uploads.
        </p>
      </div>

      {/* Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-300 border-2 border-dashed
          ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01] shadow-2xl shadow-indigo-500/20'
              : 'border-white/10 hover:border-indigo-400/50 bg-[#0e1322]/80 hover:bg-[#12182b] shadow-xl shadow-black/40'
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {/* Ambient subtle backglow */}
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>

        {/* Floating Icon illustration */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:text-indigo-300 transition-all duration-300 shadow-inner">
          <UploadCloud className="w-10 h-10 animate-float" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
          {isDragging ? 'Release to upload PDF' : 'Drop your PDF here'}
        </h3>

        <p className="text-slate-400 text-sm mb-6">
          or <span className="text-indigo-400 font-semibold underline underline-offset-4 group-hover:text-indigo-300">browse files</span> from your computer
        </p>

        {/* Minimal feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 pt-2 border-t border-white/5">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Client-Side Privacy
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04]">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Instant Processing
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04]">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            High Quality Vector Output
          </span>
        </div>
      </div>

      {/* Quick Demo Document CTA */}
      <div className="mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
        <span className="text-xs text-slate-500 font-medium">Don't have a PDF ready?</span>
        <button
          type="button"
          disabled={isGeneratingDemo}
          onClick={onDemoSelect}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-indigo-300 hover:text-white border border-white/10 hover:border-indigo-500/40 transition-all active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isGeneratingDemo ? 'Generating demo...' : 'Try with 6-page Demo Document'}</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
