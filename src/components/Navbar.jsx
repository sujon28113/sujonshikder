import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, Grid, ChevronDown, Scissors, Layers, FileEdit, LayoutGrid, RotateCw, Image, FilePlus, Hash, Minimize2, AlignLeft } from 'lucide-react';

export default function Navbar({ activeRoute }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toolsList = [
    { name: 'Merge PDF', path: '#/merge', icon: Layers },
    { name: 'Split PDF', path: '#/split', icon: Scissors },
    { name: 'PDF to Word', path: '#/pdf-to-word', icon: FileEdit },
    { name: 'Organize PDF', path: '#/organize', icon: LayoutGrid },
    { name: 'Rotate PDF', path: '#/rotate', icon: RotateCw },
    { name: 'PDF to JPG/PNG', path: '#/pdf-to-img', icon: Image },
    { name: 'JPG to PDF', path: '#/img-to-pdf', icon: FilePlus },
    { name: 'Page Numbers', path: '#/page-numbers', icon: Hash },
    { name: 'Compress PDF', path: '#/compress', icon: Minimize2 },
    { name: 'Extract Text', path: '#/extract-text', icon: AlignLeft },
  ];

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

          <a 
            href="#/"
            className="flex items-center gap-2 group"
          >
            <span className="font-heading font-bold text-xl tracking-tight text-[#111827] group-hover:text-yellow-600 transition-colors">
              PDF Suite
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
              10 Tools
            </span>
          </a>
        </div>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a 
            href="#/"
            className={`transition-colors flex items-center gap-1.5 font-bold ${
              !activeRoute || activeRoute === '' || activeRoute === '/'
                ? 'text-yellow-600'
                : 'text-gray-600 hover:text-yellow-600'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>All Tools</span>
          </a>

          {/* Quick Tools Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-gray-600 hover:text-yellow-600 transition-colors font-medium"
            >
              <span>Quick Select</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {dropdownOpen && (
              <div 
                className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white border border-gray-100 shadow-xl p-2 z-50 grid grid-cols-1 gap-0.5"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                {toolsList.map((t) => {
                  const Icon = t.icon;
                  return (
                    <a
                      key={t.path}
                      href={t.path}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-yellow-50 hover:text-yellow-800 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-yellow-600" />
                      <span>{t.name}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <a 
            href="/"
            className="text-gray-600 hover:text-yellow-600 transition-colors flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portfolio</span>
          </a>
        </div>

        {/* Right Status Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200/70 text-yellow-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-600" />
            <span>100% In-Browser Privacy</span>
          </div>

          {activeRoute && activeRoute !== '' && activeRoute !== '/' && (
            <a
              href="#/"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-[#111827] transition-all shadow-[0_2px_10px_rgba(250,204,21,0.35)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>All Tools</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
