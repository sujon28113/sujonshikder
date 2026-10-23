import React from 'react';
import { Scissors, ShieldCheck, Sparkles, FileText } from 'lucide-react';

export default function Navbar({ onReset, hasFile }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-[#07090e]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group transition-transform active:scale-95"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
            <Scissors className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center border-2 border-[#07090e]">
              <FileText className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SplitPDF
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Badges / Minimal Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Private • Local Processing</span>
          </div>

          {hasFile && (
            <button
              onClick={onReset}
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              New Document
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
