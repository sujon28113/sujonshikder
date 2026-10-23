import React, { useState } from 'react';
import { LayoutGrid, Download, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import ToolHeader from '../shared/ToolHeader';
import MultiFileDropZone from '../shared/MultiFileDropZone';
import DocumentHeader from '../DocumentHeader';
import PageGridThumbnail from '../shared/PageGridThumbnail';
import SuccessModal from '../SuccessModal';
import { organizePdf, downloadFile } from '../../utils/pdfUtils';
import { generateSamplePdf } from '../../utils/samplePdf';

export default function OrganizeTool() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]); // array of { id, originalIndex, rotation }
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initPages = (pageCount) => {
    const arr = [];
    for (let i = 0; i < pageCount; i++) {
      arr.push({ id: `page-${i}-${Date.now()}`, originalIndex: i, rotation: 0 });
    }
    return arr;
  };

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

  const handleDeletePage = (index) => {
    if (pages.length <= 1) return;
    setPages(pages.filter((_, i) => i !== index));
  };

  const handleDuplicatePage = (index) => {
    const target = pages[index];
    const newPage = { ...target, id: `dup-${Date.now()}` };
    const updated = [...pages.slice(0, index + 1), newPage, ...pages.slice(index + 1)];
    setPages(updated);
  };

  const handleMovePage = (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= pages.length) return;
    const updated = [...pages];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setPages(updated);
  };

  const handleSave = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);
    try {
      const organizedBlob = await organizePdf(file.buffer, pages);
      const baseName = file.name.replace(/\.pdf$/i, '');
      const outputName = `${baseName}_organized.pdf`;

      downloadFile(organizedBlob, outputName);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#FACC15', '#EAB308', '#111827'],
        });
      } catch (e) {}

      setResultData({
        blob: organizedBlob,
        filename: outputName,
        size: organizedBlob.size,
        pagesCount: pages.length,
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert(`Error saving organized PDF: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <ToolHeader
        title="Organize PDF"
        description="Reorder, rotate, duplicate, or remove pages from your document with an interactive visual preview grid."
        icon={LayoutGrid}
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
          title="Drop your PDF here to organize pages"
          subtitle="or select a document from your computer"
        />
      ) : (
        <div className="space-y-6">
          <DocumentHeader fileInfo={file} onReset={() => setFile(null)} />

          {/* Quick instructions and count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-yellow-50 border border-yellow-200/80 text-yellow-900 text-xs font-medium">
            <span>
              <strong>Tip:</strong> Use the left / right arrows to reorder pages, rotate button to turn, or trash to remove pages.
            </span>
            <span className="font-bold shrink-0">
              Total Output Pages: {pages.length}
            </span>
          </div>

          {/* Visual Grid */}
          <PageGridThumbnail
            pages={pages}
            pdfBuffer={file.buffer}
            onRotatePage={handleRotatePage}
            onDeletePage={handleDeletePage}
            onDuplicatePage={handleDuplicatePage}
            onMovePage={handleMovePage}
          />

          {/* Sticky Bottom Bar */}
          <div className="sticky bottom-4 z-40">
            <div className="rounded-3xl bg-white/95 border border-gray-200 p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-[#111827] flex items-center justify-center shrink-0 shadow-md shadow-yellow-400/20">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#111827]">
                    Ready with {pages.length} {pages.length === 1 ? 'page' : 'pages'}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Changes will be saved into your new PDF document
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isProcessing || pages.length === 0}
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold bg-yellow-400 hover:bg-yellow-500 text-[#111827] shadow-[0_4px_14px_0_rgba(250,204,21,0.39)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
                    <span>Saving PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Save Organized PDF</span>
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
