import React from 'react';
import { ShieldCheck, ArrowLeft, RotateCcw } from 'lucide-react';

export default function Navbar({ onReset, hasFile }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <a 
            href="/"
            className="font-heading font-bold text-2xl tracking-tighter text-[#111827] hover:opacity-90 transition-opacity"
            title="Go to Md. Sujon Shikder Portfolio"
          >
            S<span className="text-yellow-500">S</span>.
          </a>
          
          <div className="h-5 w-px bg-gray-200 hidden sm:block"></div>

          <div 
            onClick={onReset}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="font-heading font-bold text-xl tracking-tight text-[#111827] group-hover:text-yellow-600 transition-colors">
              SplitPDF
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
              Tool
            </span>
          </div>
        </div>

        {/* Center / Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a 
            href="/"
            className="text-gray-600 hover:text-yellow-600 transition-colors flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portfolio</span>
          </a>
        </div>

        {/* Right Action & Status Badges */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200/70 text-yellow-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-600" />
            <span>100% Private • In-Browser Processing</span>
          </div>

          {hasFile && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-[#111827] transition-all shadow-[0_2px_10px_rgba(250,204,21,0.35)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Document</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
