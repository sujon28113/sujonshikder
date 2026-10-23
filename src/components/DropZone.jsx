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
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs tracking-wide">
          <span className="flex w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>
          <span>Fast & Private Client-Side Utility</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-[#111827] leading-tight">
          Split PDF pages <br className="hidden sm:inline" />
          <span className="text-highlight">with precision</span>
        </h1>

        <p className="max-w-xl mx-auto text-gray-600 text-base sm:text-lg leading-relaxed font-light">
          Specify custom page ranges, extract single sheets, or batch split into a ZIP archive. 
          Everything runs entirely in your browser with zero server uploads.
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
              ? 'border-yellow-500 bg-yellow-50/50 scale-[1.01] shadow-xl shadow-yellow-500/10'
              : 'border-gray-200 hover:border-yellow-400 bg-white hover:bg-yellow-50/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover-card'
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
        <div className="absolute inset-0 -z-10 rounded-3xl bg-yellow-100/30 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>

        {/* Floating Icon illustration */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-yellow-400 flex items-center justify-center text-[#111827] mb-6 group-hover:scale-105 transition-all duration-300 shadow-md shadow-yellow-400/30">
          <UploadCloud className="w-10 h-10 animate-float" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#111827] mb-2 tracking-tight">
          {isDragging ? 'Release to upload PDF' : 'Drop your PDF here'}
        </h3>

        <p className="text-gray-500 text-sm sm:text-base mb-8">
          or <span className="text-yellow-600 font-semibold underline underline-offset-4 group-hover:text-yellow-700">browse files</span> from your computer
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600 pt-6 border-t border-gray-100">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% Client-Side Privacy
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 font-medium">
            <Zap className="w-3.5 h-3.5 text-yellow-600" />
            Instant Local Processing
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 font-medium">
            <FileText className="w-3.5 h-3.5 text-yellow-600" />
            High Quality Vector Output
          </span>
        </div>
      </div>

      {/* Quick Demo Document CTA */}
      <div className="mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
        <span className="text-xs text-gray-500 font-medium">Don't have a PDF ready?</span>
        <button
          type="button"
          disabled={isGeneratingDemo}
          onClick={onDemoSelect}
          className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full bg-white text-[#111827] border-2 border-gray-200 hover:border-yellow-400 hover:text-yellow-700 transition-all shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
          <span>{isGeneratingDemo ? 'Generating demo...' : 'Try with 6-page Demo Document'}</span>
          <ArrowRight className="w-3 h-3 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
