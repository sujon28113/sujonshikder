import React from 'react';
import { 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  FileStack, 
  FolderArchive, 
  Edit3, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function RangeSelector({
  rangeInput,
  onRangeInputChange,
  totalPages,
  parsedResult,
  splitMode,
  setSplitMode,
  outputFilename,
  setOutputFilename,
  onApplyPreset,
}) {
  const { valid, pages, error } = parsedResult;

  const presets = [
    { label: 'All Pages', action: 'all', icon: Layers },
    { label: `First Half (1-${Math.ceil(totalPages / 2)})`, action: 'first-half' },
    { label: `Second Half (${Math.ceil(totalPages / 2) + 1}-${totalPages})`, action: 'second-half', hidden: totalPages < 2 },
    { label: 'Odd Pages', action: 'odd', hidden: totalPages < 2 },
    { label: 'Even Pages', action: 'even', hidden: totalPages < 2 },
    { label: 'Clear', action: 'clear' },
  ].filter(p => !p.hidden);

  return (
    <div className="rounded-3xl bg-[#0f1424]/90 border border-white/[0.08] p-6 sm:p-8 shadow-xl shadow-black/40 backdrop-blur-xl relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Page Range Configuration
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Set exact pages or continuous ranges to extract from the document
          </p>
        </div>

        {/* Total Page Counter Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-slate-300 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          <span>Total Document Pages:</span>
          <span className="text-white font-mono bg-indigo-500/20 px-2 py-0.5 rounded-lg text-indigo-300 border border-indigo-500/30 font-bold">
            {totalPages}
          </span>
        </div>
      </div>

      {/* Main Range Input Box */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Page Range
        </label>
        
        <div className="relative group">
          <input
            type="text"
            value={rangeInput}
            onChange={(e) => onRangeInputChange(e.target.value)}
            placeholder="e.g. 1-3, 5, 8-10"
            className={`w-full px-5 py-4 rounded-2xl bg-[#07090e]/90 font-mono text-lg sm:text-xl text-white placeholder-slate-600 border transition-all duration-200 outline-none
              ${
                error
                  ? 'border-rose-500/60 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10'
                  : valid && pages.length > 0
                  ? 'border-emerald-500/50 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10'
                  : 'border-white/10 focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/10'
              }`}
          />
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            {valid && pages.length > 0 ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium font-sans">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {pages.length} {pages.length === 1 ? 'page' : 'pages'}
              </span>
            ) : error ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium font-sans">
                <AlertCircle className="w-3.5 h-3.5" />
                Invalid
              </span>
            ) : null}
          </div>
        </div>

        {/* Live helper status */}
        <div className="mt-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {error ? (
              <span className="text-rose-400 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 inline" />
                {error}
              </span>
            ) : valid && pages.length > 0 ? (
              <span className="text-slate-400">
                Selected pages:{' '}
                <span className="text-emerald-400 font-mono font-medium">
                  {pages.length > 10 
                    ? `${pages.slice(0, 10).join(', ')}... (+${pages.length - 10} more)`
                    : pages.join(', ')}
                </span>
              </span>
            ) : (
              <span className="text-slate-500">
                Enter single pages (e.g. <code className="text-slate-400">2</code>) or ranges (e.g. <code className="text-slate-400">1-4</code>)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Quick Presets
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {presets.map((preset) => (
            <button
              key={preset.action}
              type="button"
              onClick={() => onApplyPreset(preset.action)}
              className="text-xs font-medium px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] hover:border-indigo-500/30 transition-all active:scale-95 flex items-center gap-1.5"
            >
              {preset.icon && <preset.icon className="w-3 h-3 text-indigo-400" />}
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Output Mode Switcher & Filename Configuration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/[0.06]">
        {/* Split Mode Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Output Format
          </label>
          <div className="grid grid-cols-2 gap-2 bg-[#07090e]/80 p-1 rounded-2xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setSplitMode('single')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                splitMode === 'single'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <FileStack className="w-3.5 h-3.5" />
              <span>Single PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setSplitMode('zip')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                splitMode === 'zip'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Separate (ZIP)</span>
            </button>
          </div>
          <span className="text-[11px] text-slate-500 mt-1.5 block">
            {splitMode === 'single' 
              ? 'Combines all selected pages into a single new PDF' 
              : 'Extracts each page as an individual PDF inside a ZIP file'}
          </span>
        </div>

        {/* Output Filename Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            File Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={outputFilename}
              onChange={(e) => setOutputFilename(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#07090e]/80 font-mono text-xs text-white border border-white/10 focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              placeholder="output-name"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 pointer-events-none">
              {splitMode === 'single' ? '.pdf' : '.zip'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1.5 block">
            Custom name for your downloaded file
          </span>
        </div>
      </div>
    </div>
  );
}
