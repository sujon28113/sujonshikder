import React, { useState } from 'react';
import { 
  Layers, 
  Scissors, 
  FileEdit, 
  LayoutGrid, 
  RotateCw, 
  Image as ImageIcon, 
  FilePlus, 
  Hash, 
  Minimize2, 
  AlignLeft, 
  ArrowRight,
  Search,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const TOOLS_CONFIG = [
  {
    id: 'merge',
    path: '#/merge',
    title: 'Merge PDF',
    category: 'Organize',
    badge: 'Popular',
    icon: Layers,
    description: 'Combine multiple PDF files into a single unified document in any order you choose.',
  },
  {
    id: 'split',
    path: '#/split',
    title: 'Split PDF',
    category: 'Organize',
    badge: 'Popular',
    icon: Scissors,
    description: 'Extract specific page ranges, separate single sheets, or batch split into independent files.',
  },
  {
    id: 'pdf-to-word',
    path: '#/pdf-to-word',
    title: 'PDF to Word',
    category: 'Convert',
    badge: 'Featured',
    icon: FileEdit,
    description: 'Convert PDF documents into fully editable Microsoft Word (.docx) files with paragraphs preserved.',
  },
  {
    id: 'organize',
    path: '#/organize',
    title: 'Organize PDF',
    category: 'Organize',
    icon: LayoutGrid,
    description: 'Reorder, delete, duplicate, or rotate individual pages using an interactive visual preview grid.',
  },
  {
    id: 'rotate',
    path: '#/rotate',
    title: 'Rotate PDF',
    category: 'Organize',
    icon: RotateCw,
    description: 'Rotate all pages or specific pages 90°, 180°, or 270° clockwise with permanent saving.',
  },
  {
    id: 'pdf-to-img',
    path: '#/pdf-to-img',
    title: 'PDF to JPG / PNG',
    category: 'Convert',
    icon: ImageIcon,
    description: 'Convert every PDF page into crisp, high-resolution JPG or PNG images packed in a ZIP archive.',
  },
  {
    id: 'img-to-pdf',
    path: '#/img-to-pdf',
    title: 'JPG / PNG to PDF',
    category: 'Convert',
    icon: FilePlus,
    description: 'Transform multiple digital images into a formatted PDF document with customizable margins.',
  },
  {
    id: 'page-numbers',
    path: '#/page-numbers',
    title: 'Add Page Numbers',
    category: 'Optimize',
    icon: Hash,
    description: 'Stamp page numbers across all pages with customizable formats, fonts, and 6 alignment positions.',
  },
  {
    id: 'compress',
    path: '#/compress',
    title: 'Compress PDF',
    category: 'Optimize',
    badge: 'Fast',
    icon: Minimize2,
    description: 'Optimize PDF content streams and strip redundant metadata for lighter, email-ready sharing.',
  },
  {
    id: 'extract-text',
    path: '#/extract-text',
    title: 'Extract Text',
    category: 'Convert',
    icon: AlignLeft,
    description: 'Extract all readable textual content from your PDF with one-click copy to clipboard or .txt download.',
  },
];

export default function ToolHub() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Organize', 'Convert', 'Optimize'];

  const filteredTools = TOOLS_CONFIG.filter((tool) => {
    const matchesSearch = 
      tool.title.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = 
      activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4 sm:pt-8">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs tracking-wide">
          <span className="flex w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>
          <span>Complete Client-Side PDF Suite</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-[#111827] leading-tight">
          Every tool you need to work with PDFs <br className="hidden sm:inline" />
          <span className="text-highlight">in one place</span>
        </h1>

        <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-light">
          100% Free, private, and lightning fast. Merge, split, convert to Word, organize, and optimize your PDFs directly in your browser without uploading to external servers.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-gray-500 pt-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% In-Browser Privacy
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-600" />
            Zero Server Uploads
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-600" />
            Instant Unlimited Usage
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-white border border-gray-100 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-yellow-400 text-[#111827] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {cat === 'All' ? 'All Tools (10)' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-gray-50 text-xs text-gray-800 placeholder-gray-400 border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Tools Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <a
              key={tool.id}
              href={tool.path}
              className="group relative p-6 rounded-3xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover-card flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Icon & Badge */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-[#111827] flex items-center justify-center shadow-md shadow-yellow-400/20 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  {tool.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-bold text-lg text-[#111827] group-hover:text-yellow-600 transition-colors mb-2">
                  {tool.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed font-light">
                  {tool.description}
                </p>
              </div>

              {/* Bottom Action Link */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-yellow-700 group-hover:text-yellow-800">
                <span>Open tool</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          <p className="text-base font-semibold">No tools found matching "{search}"</p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setActiveCategory('All');
            }}
            className="mt-3 text-xs font-bold text-yellow-700 hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
