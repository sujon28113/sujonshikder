import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, ArrowUp, ArrowDown, Trash2, Plus, ShieldCheck, Zap } from 'lucide-react';
import { formatBytes } from '../../utils/pdfUtils';

export default function MultiFileDropZone({
  files = [],
  onFilesChange,
  accept = 'application/pdf',
  multiple = false,
  title = 'Drop your PDF here',
  subtitle = 'or browse files from your computer',
  badgeText = '100% Private Client-Side Processing',
  onDemoSelect,
  isGeneratingDemo,
}) {
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
      handleIncomingFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleIncomingFiles(Array.from(e.target.files));
    }
  };

  const handleIncomingFiles = (incoming) => {
    if (multiple) {
      onFilesChange([...files, ...incoming]);
    } else {
      onFilesChange(incoming.slice(0, 1));
    }
  };

  const handleMoveFile = (index, direction) => {
    const newFiles = [...files];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    onFilesChange(newFiles);
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className="w-full">
      {/* Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 border-2 border-dashed
          ${
            isDragging
              ? 'border-yellow-500 bg-yellow-50/50 scale-[1.01] shadow-xl shadow-yellow-500/10'
              : 'border-gray-200 hover:border-yellow-400 bg-white hover:bg-yellow-50/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover-card'
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleFileInputChange}
        />

        {/* Floating Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center text-[#111827] mb-5 group-hover:scale-105 transition-all shadow-md shadow-yellow-400/20">
          <UploadCloud className="w-8 h-8 animate-float" />
        </div>

        <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#111827] mb-2 tracking-tight">
          {isDragging ? 'Release to upload' : title}
        </h3>

        <p className="text-gray-500 text-sm mb-6">
          or <span className="text-yellow-600 font-semibold underline underline-offset-4 group-hover:text-yellow-700">browse files</span> {subtitle}
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500 pt-4 border-t border-gray-100">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {badgeText}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 font-medium">
            <Zap className="w-3.5 h-3.5 text-yellow-600" />
            Instant In-Browser Execution
          </span>
        </div>
      </div>

      {/* Multiple Files List (Reordering & Delete) */}
      {multiple && files.length > 0 && (
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h4 className="font-heading font-bold text-sm text-[#111827]">
              Selected Documents ({files.length})
            </h4>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 text-xs font-bold text-yellow-700 hover:text-yellow-800 bg-yellow-50 hover:bg-yellow-100 px-3 py-1.5 rounded-full transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add more files</span>
            </button>
          </div>

          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-yellow-300 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <FileText className="w-5 h-5 text-yellow-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111827] truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-4">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveFile(index, -1)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === files.length - 1}
                    onClick={() => handleMoveFile(index, 1)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 ml-1"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
