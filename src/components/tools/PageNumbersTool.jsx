import React, { useState, useEffect, useRef } from 'react';
import { Hash, Download, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import ToolHeader from '../shared/ToolHeader';
import MultiFileDropZone from '../shared/MultiFileDropZone';
import DocumentHeader from '../DocumentHeader';
import SuccessModal from '../SuccessModal';
import { addPageNumbersToPdf, downloadFile } from '../../utils/pdfUtils';
import { generateSamplePdf } from '../../utils/samplePdf';
import { renderPageThumbnail } from '../../utils/pdfRenderer';

export default function PageNumbersTool() {
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState('bottom-center');
  const [format, setFormat] = useState('page-of-total'); // 'single', 'page-single', 'page-of-total', 'slash'
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const previewCanvasRef = useRef(null);

  useEffect(() => {
    if (!file || !previewCanvasRef.current) return;
    renderPageThumbnail(file.buffer, 1, previewCanvasRef.current, 220);
  }, [file]);

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;
    const selectedFile = files[0];
    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer.slice(0), { ignoreEncryption: true });
      const totalPages = pdfDoc.getPageCount();

      setFile({
        buffer,
        name: selectedFile.name,
        size: selectedFile.size,
        pageCount: totalPages,
      });
    } catch (err) {
      console.error(err);
      alert('Unable to read PDF.');
    }
  };

  const handleDemoSelect = async () => {
    setIsGeneratingDemo(true);
    try {
      const demo = await generateSamplePdf();
      setFile({
        buffer: demo.buffer,
        name: demo.name,
        size: demo.size,
        pageCount: demo.pageCount,
      });
    } catch (err) {
      console.error(err);
      alert('Error creating demo.');
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  const handleApply = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const numberedBlob = await addPageNumbersToPdf(file.buffer, {
        position,
        format,
        startNumber,
        fontSize,
      });
      const baseName = file.name.replace(/\.pdf$/i, '');
      const outputName = `${baseName}_numbered.pdf`;

      downloadFile(numberedBlob, outputName);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#FACC15', '#EAB308', '#111827'],
        });
      } catch (e) {}

      setResultData({
        blob: numberedBlob,
        filename: outputName,
        size: numberedBlob.size,
        pagesCount: file.pageCount,
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert(`Error adding page numbers: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const positions = [
    { id: 'top-left', label: 'Top Left' },
    { id: 'top-center', label: 'Top Center' },
    { id: 'top-right', label: 'Top Right' },
    { id: 'bottom-left', label: 'Bottom Left' },
    { id: 'bottom-center', label: 'Bottom Center' },
    { id: 'bottom-right', label: 'Bottom Right' },
  ];

  const getPreviewSampleText = () => {
    const total = file ? file.pageCount : 6;
    if (format === 'single') return `${startNumber}`;
    if (format === 'page-single') return `Page ${startNumber}`;
    if (format === 'page-of-total') return `Page ${startNumber} of ${total}`;
    if (format === 'slash') return `${startNumber} / ${total}`;
    return `Page ${startNumber}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ToolHeader
        title="Add Page Numbers"
        description="Insert customized page numbers into your PDF documents with full control over alignment, formats, and offsets."
        icon={Hash}
        category="Optimize"
        hasFile={Boolean(file)}
        onReset={() => setFile(null)}
        onDemoSelect={handleDemoSelect}
        isGeneratingDemo={isGeneratingDemo}
      />

      {!file ? (
        <MultiFileDropZone
          files={[]}
          onFilesChange={handleFileSelect}
          multiple={false}
          accept="application/pdf"
          title="Drop your PDF here to add page numbers"
          subtitle="or select a document from your computer"
        />
      ) : (
        <div className="space-y-6">
          <DocumentHeader fileInfo={file} onReset={() => setFile(null)} />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Configuration Form */}
            <div className="md:col-span-7 rounded-3xl bg-white border border-gray-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
              <h3 className="font-heading font-bold text-lg text-[#111827] pb-3 border-b border-gray-100">
                Numbering Settings
              </h3>

              {/* Position Grid */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Position Alignment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {positions.map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setPosition(pos.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                        position === pos.id
                          ? 'border-yellow-400 bg-yellow-400 text-[#111827] shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Select */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Number Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'page-of-total', label: `Page 1 of ${file.pageCount}` },
                    { id: 'single', label: '1 (Number only)' },
                    { id: 'page-single', label: 'Page 1' },
                    { id: 'slash', label: `1 / ${file.pageCount}` },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setFormat(fmt.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        format === fmt.id
                          ? 'border-yellow-400 bg-yellow-400 text-[#111827] shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Number & Font Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Start At Page Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={startNumber}
                    onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 font-mono text-sm border-2 border-gray-200 focus:border-yellow-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Font Size (pt)
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value) || 10)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 font-mono text-sm border-2 border-gray-200 focus:border-yellow-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right: Live Preview Box */}
            <div className="md:col-span-5 rounded-3xl bg-gray-50 border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                Page 1 Preview Overlay
              </span>
              <div className="relative w-48 aspect-[1/1.414] rounded-xl overflow-hidden bg-white border-2 border-gray-300 shadow-lg flex items-center justify-center p-1">
                <canvas ref={previewCanvasRef} className="w-full h-full object-contain rounded" />

                {/* Simulated Overlay Badge */}
                <div
                  className={`absolute font-sans font-bold text-gray-900 bg-yellow-300/80 px-2 py-0.5 rounded shadow-xs text-[10px] pointer-events-none transition-all ${
                    position.includes('left')
                      ? 'left-3'
                      : position.includes('right')
                      ? 'right-3'
                      : 'left-1/2 -translate-x-1/2'
                  } ${
                    position.startsWith('top') ? 'top-3' : 'bottom-3'
                  }`}
                >
                  {getPreviewSampleText()}
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-4">
                Will be stamped on all {file.pageCount} pages automatically
              </p>
            </div>
          </div>

          {/* Sticky Bottom Bar */}
          <div className="sticky bottom-4 z-40">
            <div className="rounded-3xl bg-white/95 border border-gray-200 p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-[#111827] flex items-center justify-center shrink-0 shadow-md shadow-yellow-400/20">
                  <Hash className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#111827]">
                    Ready to stamp {file.pageCount} pages
                  </h4>
                  <p className="text-xs text-gray-500">
                    "{getPreviewSampleText()}" at {position.replace('-', ' ')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleApply}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold bg-yellow-400 hover:bg-yellow-500 text-[#111827] shadow-[0_4px_14px_0_rgba(250,204,21,0.39)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
                    <span>Applying numbers...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Add Page Numbers</span>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-800" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resultData={resultData}
        onReset={() => setFile(null)}
        onDownloadAgain={() => resultData && downloadFile(resultData.blob, resultData.filename)}
      />
    </div>
  );
}
