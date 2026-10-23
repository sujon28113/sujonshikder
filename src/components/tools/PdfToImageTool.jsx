import React, { useState } from 'react';
import { Image, Download, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import ToolHeader from '../shared/ToolHeader';
import MultiFileDropZone from '../shared/MultiFileDropZone';
import DocumentHeader from '../DocumentHeader';
import SuccessModal from '../SuccessModal';
import { pdfToImages, downloadFile } from '../../utils/pdfUtils';
import { generateSamplePdf } from '../../utils/samplePdf';

export default function PdfToImageTool() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('jpg'); // 'jpg' | 'png'
  const [quality, setQuality] = useState('high'); // 'standard' | 'high'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const scale = quality === 'high' ? 2.0 : 1.3;
      const baseName = file.name.replace(/\.pdf$/i, '');
      const { blob, isZip, ext } = await pdfToImages(file.buffer, format, scale, baseName);

      const outputName = isZip ? `${baseName}_images.zip` : `${baseName}_page_1.${ext}`;
      downloadFile(blob, outputName);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#FACC15', '#EAB308', '#111827'],
        });
      } catch (e) {}

      setResultData({
        blob,
        filename: outputName,
        size: blob.size,
        pagesCount: file.pageCount,
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert(`Error converting PDF to images: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ToolHeader
        title="PDF to JPG / PNG"
        description="Convert every page of your PDF into crisp, high-resolution image files and download as a ZIP archive."
        icon={Image}
        category="Convert"
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
          title="Drop PDF here to convert to images"
          subtitle="or browse files from your computer"
        />
      ) : (
        <div className="space-y-6">
          <DocumentHeader fileInfo={file} onReset={() => setFile(null)} />

          {/* Configuration Card */}
          <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
            <h3 className="font-heading font-bold text-lg text-[#111827] pb-3 border-b border-gray-100">
              Image Export Options
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Image Format */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Format
                </label>
                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-2xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setFormat('jpg')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      format === 'jpg'
                        ? 'bg-yellow-400 text-[#111827] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    JPG (Smaller Size)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('png')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      format === 'png'
                        ? 'bg-yellow-400 text-[#111827] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    PNG (Lossless)
                  </button>
                </div>
              </div>

              {/* Quality Resolution */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Resolution
                </label>
                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-2xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setQuality('standard')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      quality === 'standard'
                        ? 'bg-yellow-400 text-[#111827] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Standard (150 DPI)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuality('high')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      quality === 'high'
                        ? 'bg-yellow-400 text-[#111827] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    High-Res (300 DPI)
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200/80 text-xs text-yellow-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-yellow-600 shrink-0" />
              <span>
                All <strong>{file.pageCount} pages</strong> will be converted into crisp {format.toUpperCase()} images and packaged into a convenient ZIP download.
              </span>
            </div>
          </div>

          {/* Sticky Bottom Bar */}
          <div className="sticky bottom-4 z-40">
            <div className="rounded-3xl bg-white/95 border border-gray-200 p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-[#111827] flex items-center justify-center shrink-0 shadow-md shadow-yellow-400/20">
                  <Image className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#111827]">
                    Ready to convert {file.pageCount} pages
                  </h4>
                  <p className="text-xs text-gray-500">
                    Exporting as {format.toUpperCase()} ({quality === 'high' ? 'High-Res' : 'Standard'})
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConvert}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold bg-yellow-400 hover:bg-yellow-500 text-[#111827] shadow-[0_4px_14px_0_rgba(250,204,21,0.39)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
                    <span>Rendering images...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Convert to {format.toUpperCase()}</span>
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
