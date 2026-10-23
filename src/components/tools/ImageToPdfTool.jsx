import React, { useState } from 'react';
import { FilePlus, Download, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import ToolHeader from '../shared/ToolHeader';
import MultiFileDropZone from '../shared/MultiFileDropZone';
import SuccessModal from '../SuccessModal';
import { imagesToPdf, downloadFile } from '../../utils/pdfUtils';

export default function ImageToPdfTool() {
  const [files, setFiles] = useState([]);
  const [orientation, setOrientation] = useState('auto'); // 'auto' | 'portrait' | 'landscape'
  const [margin, setMargin] = useState(15); // 0 | 15 | 30
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfBlob = await imagesToPdf(files, { orientation, margin });
      const outputName = 'images_converted.pdf';

      downloadFile(pdfBlob, outputName);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#FACC15', '#EAB308', '#111827'],
        });
      } catch (e) {}

      setResultData({
        blob: pdfBlob,
        filename: outputName,
        size: pdfBlob.size,
        pagesCount: files.length,
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert(`Error converting images to PDF: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ToolHeader
        title="JPG / PNG to PDF"
        description="Convert your pictures and digital photos into a clean, unified PDF document in seconds."
        icon={FilePlus}
        category="Convert"
        hasFile={files.length > 0}
        onReset={() => setFiles([])}
      />

      <div className="space-y-6">
        <MultiFileDropZone
          files={files}
          onFilesChange={setFiles}
          multiple={true}
          accept="image/jpeg,image/png,image/webp"
          title="Drop your images here (JPG, PNG, WebP)"
          subtitle="or browse images from your device"
          badgeText="High Quality Vector Wrapping"
        />

        {files.length > 0 && (
          <>
            {/* Options Card */}
            <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
              <h3 className="font-heading font-bold text-lg text-[#111827] pb-3 border-b border-gray-100">
                Page Layout Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Orientation */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Page Orientation
                  </label>
                  <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-2xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setOrientation('auto')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        orientation === 'auto'
                          ? 'bg-yellow-400 text-[#111827] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Auto
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrientation('portrait')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        orientation === 'portrait'
                          ? 'bg-yellow-400 text-[#111827] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrientation('landscape')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        orientation === 'landscape'
                          ? 'bg-yellow-400 text-[#111827] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Landscape
                    </button>
                  </div>
                </div>

                {/* Margins */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Page Margins
                  </label>
                  <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-2xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setMargin(0)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        margin === 0
                          ? 'bg-yellow-400 text-[#111827] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      No Margin
                    </button>
                    <button
                      type="button"
                      onClick={() => setMargin(15)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        margin === 15
                          ? 'bg-yellow-400 text-[#111827] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Small
                    </button>
                    <button
                      type="button"
                      onClick={() => setMargin(30)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        margin === 30
                          ? 'bg-yellow-400 text-[#111827] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Large
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="sticky bottom-4 z-40">
              <div className="rounded-3xl bg-white/95 border border-gray-200 p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-[#111827] flex items-center justify-center shrink-0 shadow-md shadow-yellow-400/20">
                    <FilePlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-heading font-bold text-[#111827]">
                      Ready with {files.length} {files.length === 1 ? 'image' : 'images'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Images will be compiled in the order listed
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
                      <span>Creating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Convert to PDF</span>
                      <Sparkles className="w-3.5 h-3.5 text-yellow-800" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
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
