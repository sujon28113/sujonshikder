import React from 'react';
import { 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  FileStack, 
  FolderArchive, 
  Sparkles,
  Layers
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
    <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-4 h-4 text-yellow-600" />
            <h2 className="text-lg font-heading font-bold text-[#111827] tracking-tight">
              Page Range Configuration
            </h2>
          </div>
          <p className="text-xs text-gray-500">
            Set exact pages or continuous ranges to extract from the document
          </p>
        </div>

        {/* Total Page Counter Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-xs font-semibold text-yellow-800 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          <span>Total Document Pages:</span>
          <span className="font-mono bg-yellow-400 text-[#111827] px-2 py-0.5 rounded-full font-bold">
            {totalPages}
          </span>
        </div>
      </div>

      {/* Main Range Input Box */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Page Range
        </label>
        
        <div className="relative group">
          <input
            type="text"
            value={rangeInput}
            onChange={(e) => onRangeInputChange(e.target.value)}
            placeholder="e.g. 1-3, 5, 8-10"
            className={`w-full px-5 py-4 rounded-2xl bg-gray-50 focus:bg-white font-mono text-lg sm:text-xl text-[#111827] placeholder-gray-400 border-2 transition-all duration-200 outline-none
              ${
                error
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                  : valid && pages.length > 0
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
                  : 'border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20'
              }`}
          />
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            {valid && pages.length > 0 ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold font-sans">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {pages.length} {pages.length === 1 ? 'page' : 'pages'}
              </span>
            ) : error ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold font-sans">
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
              <span className="text-rose-600 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 inline" />
                {error}
              </span>
            ) : valid && pages.length > 0 ? (
              <span className="text-gray-500 font-medium">
                Selected pages:{' '}
                <span className="text-gray-900 font-mono font-bold">
                  {pages.length > 10 
                    ? `${pages.slice(0, 10).join(', ')}... (+${pages.length - 10} more)`
                    : pages.join(', ')}
                </span>
              </span>
            ) : (
              <span className="text-gray-500">
                Enter single pages (e.g. <code className="text-gray-700 font-mono font-semibold">2</code>) or ranges (e.g. <code className="text-gray-700 font-mono font-semibold">1-4</code>)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Quick Presets
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {presets.map((preset) => (
            <button
              key={preset.action}
              type="button"
              onClick={() => onApplyPreset(preset.action)}
              className="text-xs font-semibold px-4 py-2 rounded-full bg-gray-100 hover:bg-yellow-400 hover:text-[#111827] text-gray-700 border border-transparent hover:border-yellow-400/50 transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
            >
              {preset.icon && <preset.icon className="w-3 h-3 text-gray-500" />}
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Output Mode Switcher & Filename Configuration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
        {/* Split Mode Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Output Format
          </label>
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-2xl border border-gray-200">
            <button
              type="button"
              onClick={() => setSplitMode('single')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                splitMode === 'single'
                  ? 'bg-yellow-400 text-[#111827] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <FileStack className="w-3.5 h-3.5" />
              <span>Single PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setSplitMode('zip')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                splitMode === 'zip'
                  ? 'bg-yellow-400 text-[#111827] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Separate (ZIP)</span>
            </button>
          </div>
          <span className="text-[11px] text-gray-500 mt-1.5 block">
            {splitMode === 'single' 
              ? 'Combines all selected pages into a single new PDF' 
              : 'Extracts each page as an individual PDF inside a ZIP file'}
          </span>
        </div>

        {/* Output Filename Input */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            File Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={outputFilename}
              onChange={(e) => setOutputFilename(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 focus:bg-white font-mono text-xs text-[#111827] border-2 border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all"
              placeholder="output-name"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400 pointer-events-none font-bold">
              {splitMode === 'single' ? '.pdf' : '.zip'}
            </span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1.5 block">
            Custom name for your downloaded file
          </span>
        </div>
      </div>
    </div>
  );
}
