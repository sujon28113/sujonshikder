import React, { useState } from 'react';
import { RotateCw, RotateCcw, Download, Loader2, Sparkles } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import ToolHeader from '../shared/ToolHeader';
import MultiFileDropZone from '../shared/MultiFileDropZone';
import DocumentHeader from '../DocumentHeader';
import PageGridThumbnail from '../shared/PageGridThumbnail';
import SuccessModal from '../SuccessModal';
import { organizePdf, downloadFile } from '../../utils/pdfUtils';
import { generateSamplePdf } from '../../utils/samplePdf';

export default function RotateTool() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initPages = (pageCount) => {
    const arr = [];
    for (let i = 0; i < pageCount; i++) {
      arr.push({ id: `page-${i}`, originalIndex: i, rotation: 0 });
    }
    return arr;
  };

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
      setPages(initPages(totalPages));
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
      setPages(initPages(demo.pageCount));
    } catch (err) {
      console.error(err);
      alert('Error creating demo.');
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  const handleRotatePage = (index) => {
    const updated = [...pages];
    updated[index].rotation = (updated[index].rotation + 90) % 360;
    setPages(updated);
  };

  const handleRotateAll = (delta) => {
    const updated = pages.map((p) => ({
      ...p,
      rotation: (p.rotation + delta + 360) % 360,
    }));
    setPages(updated);
  };

  const handleSave = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const rotatedBlob = await organizePdf(file.buffer, pages);
      const baseName = file.name.replace(/\.pdf$/i, '');
      const outputName = `${baseName}_rotated.pdf`;

      downloadFile(rotatedBlob, outputName);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#FACC15', '#EAB308', '#111827'],
        });
      } catch (e) {}

      setResultData({
        blob: rotatedBlob,
        filename: outputName,
        size: rotatedBlob.size,
        pagesCount: pages.length,
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert(`Error saving rotated PDF: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <ToolHeader
        title="Rotate PDF"
        description="Rotate individual pages or all pages of your PDF document in 90-degree increments."
        icon={RotateCw}
        category="Organize"
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
          title="Drop your PDF here to rotate pages"
          subtitle="or select a file from your device"
        />
      ) : (
        <div className="space-y-6">
          <DocumentHeader fileInfo={file} onReset={() => setFile(null)} />

          {/* Quick rotation toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <span className="text-xs font-bold text-gray-700">
              Bulk Actions:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleRotateAll(-90)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 hover:bg-yellow-400 hover:text-[#111827] text-xs font-bold text-gray-700 transition-all shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rotate All Left (90°)</span>
              </button>
              <button
                type="button"
                onClick={() => handleRotateAll(90)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 hover:bg-yellow-400 hover:text-[#111827] text-xs font-bold text-gray-700 transition-all shadow-xs"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate All Right (90°)</span>
              </button>
            </div>
          </div>

          {/* Page Grid */}
          <PageGridThumbnail
            pages={pages}
            pdfBuffer={file.buffer}
            onRotatePage={handleRotatePage}
          />

          {/* Sticky Bottom Bar */}
          <div className="sticky bottom-4 z-40">
            <div className="rounded-3xl bg-white/95 border border-gray-200 p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-[#111827] flex items-center justify-center shrink-0 shadow-md shadow-yellow-400/20">
                  <RotateCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#111827]">
                    Apply Rotations
                  </h4>
                  <p className="text-xs text-gray-500">
                    Rotated document will be saved permanently
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold bg-yellow-400 hover:bg-yellow-500 text-[#111827] shadow-[0_4px_14px_0_rgba(250,204,21,0.39)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
                    <span>Saving rotations...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Save Rotated PDF</span>
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
