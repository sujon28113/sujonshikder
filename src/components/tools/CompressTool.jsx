import React, { useState } from 'react';
import { Minimize2, Download, Loader2, Sparkles, CheckCircle2, TrendingDown, Info } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import ToolHeader from '../shared/ToolHeader';
import MultiFileDropZone from '../shared/MultiFileDropZone';
import DocumentHeader from '../DocumentHeader';
import SuccessModal from '../SuccessModal';
import { compressPdf, downloadFile, formatBytes } from '../../utils/pdfUtils';
import { generateSamplePdf } from '../../utils/samplePdf';

export default function CompressTool() {
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState('recommended'); // 'extreme' | 'recommended' | 'less'
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(null); // { current, total, percent }
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [compressionStats, setCompressionStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;
    const selectedFile = files[0];
    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const totalPages = pdfDoc.getPageCount();

      setFile({
        buffer,
        name: selectedFile.name,
        size: selectedFile.size,
        pageCount: totalPages,
      });
      setCompressionStats(null);
      setProgress(null);
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
      setCompressionStats(null);
      setProgress(null);
    } catch (err) {
      console.error(err);
      alert('Error creating demo.');
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress({ current: 0, total: file.pageCount, percent: 0 });
    try {
      const {
        blob: compressedBlob,
        originalSize,
        compressedSize,
        savedBytes,
        savedPercent,
        isAlreadyOptimized,
      } = await compressPdf(file.buffer, level, (p) => setProgress(p));

      const baseName = file.name.replace(/\.pdf$/i, '');
      const outputName = `${baseName}_compressed.pdf`;

      downloadFile(compressedBlob, outputName);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#FACC15', '#EAB308', '#111827'],
        });
      } catch (e) {}

      const stats = {
        originalSize,
        compressedSize,
        savedBytes,
        savedPercent,
        isAlreadyOptimized,
      };

      setCompressionStats(stats);
      setResultData({
        blob: compressedBlob,
        filename: outputName,
        size: compressedSize,
        pagesCount: file.pageCount,
        stats,
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert(`Error compressing PDF: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const levels = [
    {
      id: 'extreme',
      title: 'Extreme Compression',
      desc: 'High compression ratio (72-96 DPI). Best for email attachments and portal size limits.',
      reduction: '60% - 85% Reduction',
    },
    {
      id: 'recommended',
      title: 'Recommended Compression',
      desc: 'Optimal balance of visual quality (120-150 DPI) and significant file size savings.',
      reduction: '40% - 70% Reduction',
      recommended: true,
    },
    {
      id: 'less',
      title: 'Less Compression',
      desc: 'High resolution (180-200 DPI). Best for preserving fine vector details and printing.',
      reduction: '20% - 40% Reduction',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ToolHeader
        title="Compress PDF"
        description="Reduce PDF file size by downsampling high-DPI scans and raster streams with genuine, measurable byte savings."
        icon={Minimize2}
        category="Optimize"
        hasFile={Boolean(file)}
        onReset={() => {
          setFile(null);
          setCompressionStats(null);
          setProgress(null);
        }}
        onDemoSelect={handleDemoSelect}
        isGeneratingDemo={isGeneratingDemo}
      />

      {!file ? (
        <MultiFileDropZone
          files={[]}
          onFilesChange={handleFileSelect}
          multiple={false}
          accept="application/pdf"
          title="Drop your PDF here to compress"
          subtitle="or browse documents from your device"
        />
      ) : (
        <div className="space-y-6">
          <DocumentHeader fileInfo={file} onReset={() => setFile(null)} />

          {/* Real-time Savings Banner if already compressed */}
          {compressionStats && (
            <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-emerald-950">
                    Compression Complete!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Original: {formatBytes(compressionStats.originalSize)} → New: {formatBytes(compressionStats.compressedSize)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-xs">
                  {compressionStats.savedPercent > 0 ? `-${compressionStats.savedPercent}% Smaller` : 'Optimized'}
                </span>
              </div>
            </div>
          )}

          {/* Compression Options */}
          <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
            <h3 className="font-heading font-bold text-lg text-[#111827] pb-3 border-b border-gray-100">
              Select Compression Profile
            </h3>

            <div className="space-y-3">
              {levels.map((lvl) => (
                <div
                  key={lvl.id}
                  onClick={() => !isProcessing && setLevel(lvl.id)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-4 ${
                    level === lvl.id
                      ? 'border-yellow-400 bg-yellow-50/40 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                        level === lvl.id ? 'border-yellow-500 bg-yellow-400' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {level === lvl.id && <div className="w-2 h-2 rounded-full bg-[#111827]"></div>}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#111827]">{lvl.title}</h4>
                        {lvl.recommended && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{lvl.desc}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full shrink-0">
                    {lvl.reduction}
                  </span>
                </div>
              ))}
            </div>

            {/* In-flight Progress Bar */}
            {isProcessing && progress && (
              <div className="p-5 rounded-2xl bg-yellow-50 border border-yellow-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-yellow-900">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
                    <span>Compressing page {progress.current} of {progress.total}...</span>
                  </span>
                  <span>{progress.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-yellow-200 overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress.percent}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Bar */}
          <div className="sticky bottom-4 z-40">
            <div className="rounded-3xl bg-white/95 border border-gray-200 p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-[#111827] flex items-center justify-center shrink-0 shadow-md shadow-yellow-400/20">
                  <Minimize2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#111827]">
                    Original Size: {formatBytes(file.size)} ({file.pageCount} pages)
                  </h4>
                  <p className="text-xs text-gray-500">
                    Profile: {level.charAt(0).toUpperCase() + level.slice(1)} Compression
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCompress}
                className={`inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold transition-all duration-200 select-none ${
                  !isProcessing
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-[#111827] shadow-[0_4px_14px_0_rgba(250,204,21,0.39)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
                    <span>Compressing ({progress ? `${progress.percent}%` : 'Starting'})...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Compress PDF Now</span>
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
        onReset={() => {
          setFile(null);
          setCompressionStats(null);
        }}
        onDownloadAgain={() => resultData && downloadFile(resultData.blob, resultData.filename)}
      />
    </div>
  );
}
