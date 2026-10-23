import React from 'react';
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';

export default function ToolHeader({
  title,
  description,
  icon: Icon,
  onReset,
  hasFile,
  onDemoSelect,
  isGeneratingDemo,
  category = 'PDF Tool',
}) {
  return (
    <div className="mb-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-4">
        <a 
          href="#/" 
          className="hover:text-yellow-600 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Tools</span>
        </a>
        <span>/</span>
        <span className="text-gray-400">{category}</span>
        <span>/</span>
        <span className="text-[#111827] font-bold">{title}</span>
      </div>

      {/* Main Title & Description Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-[#111827] flex items-center justify-center shrink-0 shadow-md shadow-yellow-400/20">
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#111827] tracking-tight">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-light mt-1 max-w-2xl">
              {description}
            </p>
          </div>
        </div>

        {/* Quick Demo CTA if no file loaded */}
        {!hasFile && onDemoSelect && (
          <button
            type="button"
            disabled={isGeneratingDemo}
            onClick={onDemoSelect}
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full bg-white text-[#111827] border-2 border-gray-200 hover:border-yellow-400 hover:text-yellow-700 transition-all shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 self-start md:self-auto shrink-0 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>{isGeneratingDemo ? 'Generating demo...' : 'Try Demo PDF'}</span>
          </button>
        )}

        {/* Change file if loaded */}
        {hasFile && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-yellow-50 text-xs font-bold text-gray-700 hover:text-yellow-800 border border-gray-200 hover:border-yellow-400 transition-all self-start md:self-auto shadow-sm hover:-translate-y-0.5 active:translate-y-0"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span>Choose Different File</span>
          </button>
        )}
      </div>
    </div>
  );
}
