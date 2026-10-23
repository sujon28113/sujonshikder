import React, { useState } from 'react';
import { Layers, Download, Loader2, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import ToolHeader from '../shared/ToolHeader';
import MultiFileDropZone from '../shared/MultiFileDropZone';
import SuccessModal from '../SuccessModal';
import { mergePdfs, downloadFile, formatBytes } from '../../utils/pdfUtils';
import { generateSamplePdf } from '../../utils/samplePdf';

export default function MergeTool() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDemoSelect = async () => {
    setIsGeneratingDemo(true);
    try {
      const demo1 = await generateSamplePdf();
      const demo2 = await generateSamplePdf();
      const file1 = new File([demo1.buffer], 'Part_1_Roadmap.pdf', { type: 'application/pdf' });
      const file2 = new File([demo2.buffer], 'Part_2_Architecture.pdf', { type: 'application/pdf' });
      setFiles([file1, file2]);
    } catch (err) {
      console.error(err);
      alert('Error creating demo files.');
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF documents to merge.');
      return;
    }

    setIsProcessing(true);
    try {
      const buffers = await Promise.all(files.map((f) => f.arrayBuffer()));
      const mergedBlob = await mergePdfs(buffers);

      // Count pages in merged result
      const resDoc = await PDFDocument.load(await mergedBlob.arrayBuffer());
      const totalPages = resDoc.getPageCount();

      const outputName = 'merged_document.pdf';
      downloadFile(mergedBlob, outputName);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#FACC15', '#EAB308', '#111827'],
        });
      } catch (e) {}

      setResultData({
        blob: mergedBlob,
        filename: outputName,
        size: mergedBlob.size,
        pagesCount: totalPages,
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert(`Error merging PDFs: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ToolHeader
        title="Merge PDF"
        description="Combine multiple PDF documents into a single unified file in whatever order you prefer."
        icon={Layers}
        category="Organize"
        hasFile={files.length > 0}
        onReset={() => setFiles([])}
        onDemoSelect={handleDemoSelect}
        isGeneratingDemo={isGeneratingDemo}
      />

      <div className="space-y-8">
        <MultiFileDropZone
          files={files}
          onFilesChange={setFiles}
          multiple={true}
          accept="application/pdf"
          title="Drop PDF documents to merge"
          subtitle="or select multiple PDFs from your device"
        />

        {files.length > 0 && (
          <div className="sticky bottom-4 z-40">
            <div className="rounded-3xl bg-white/95 border border-gray-200 p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-[#111827] flex items-center justify-center shrink-0 shadow-md shadow-yellow-400/20">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#111827]">
                    Ready to combine {files.length} {files.length === 1 ? 'file' : 'files'}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {files.length < 2 ? 'Add at least 1 more file to enable merge' : 'Files will be joined in the order shown above'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={files.length < 2 || isProcessing}
                onClick={handleMerge}
                className={`inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold transition-all duration-200 select-none ${
                  files.length >= 2 && !isProcessing
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-[#111827] shadow-[0_4px_14px_0_rgba(250,204,21,0.39)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
                    <span>Merging documents...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Merge PDF Files</span>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-800" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resultData={resultData}
        onReset={() => setFiles([])}
        onDownloadAgain={() => resultData && downloadFile(resultData.blob, resultData.filename)}
      />
    </div>
  );
}
