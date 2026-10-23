import React, { useState } from 'react';
import { FileEdit, Download, Loader2, Sparkles, FileText, CheckCircle2, BookOpen } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import ToolHeader from '../shared/ToolHeader';
import MultiFileDropZone from '../shared/MultiFileDropZone';
import DocumentHeader from '../DocumentHeader';
import SuccessModal from '../SuccessModal';
import { convertPdfToWord, downloadFile } from '../../utils/pdfUtils';
import { generateSamplePdf } from '../../utils/samplePdf';

export default function PdfToWordTool() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [resultData, setResultData] = useState(null);
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
    } catch (err) {
      console.error(err);
      alert('Unable to read PDF. Please ensure it is a valid document.');
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
      alert('Error generating demo PDF.');
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const docxBlob = await convertPdfToWord(file.buffer);
      const baseName = file.name.replace(/\.pdf$/i, '');
      const outputName = `${baseName}_converted.docx`;

      downloadFile(docxBlob, outputName);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#FACC15', '#EAB308', '#111827'],
        });
      } catch (e) {}

      setResultData({
        blob: docxBlob,
        filename: outputName,
        size: docxBlob.size,
        pagesCount: file.pageCount,
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert(`Error converting to Word: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ToolHeader
        title="PDF to Word"
        description="Convert your PDF document into an editable Microsoft Word (.docx) document with text formatting preserved."
        icon={FileEdit}
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
          title="Drop your PDF here to convert to Word"
          subtitle="or browse documents from your device"
        />
      ) : (
        <div className="space-y-6">
          <DocumentHeader fileInfo={file} onReset={() => setFile(null)} />

          {/* Conversion Details Card */}
          <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#111827]">
                  Document Extraction Settings
                </h3>
                <p className="text-xs text-gray-500">
                  Ready to process {file.pageCount} {file.pageCount === 1 ? 'page' : 'pages'} into OpenXML Word format
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-[#111827]">Output Format</h5>
                  <p className="text-xs text-gray-500 font-mono">Microsoft Word (.docx)</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-[#111827]">Paragraph Structure</h5>
                  <p className="text-xs text-gray-500">Auto-detected lines</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-[#111827]">Compatibility</h5>
                  <p className="text-xs text-gray-500">Office 365, Google Docs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Action Bar */}
          <div className="sticky bottom-4 z-40">
            <div className="rounded-3xl bg-white/95 border border-gray-200 p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-[#111827] flex items-center justify-center shrink-0 shadow-md shadow-yellow-400/20">
                  <FileEdit className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#111827]">
                    Ready to convert document
                  </h4>
                  <p className="text-xs text-gray-500">
                    Will extract text & headings from {file.pageCount} pages
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
                    <span>Converting to Word...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Convert to Word (.docx)</span>
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
