import React, { useState, useMemo } from 'react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';

import Navbar from './components/Navbar';
import DropZone from './components/DropZone';
import DocumentHeader from './components/DocumentHeader';
import RangeSelector from './components/RangeSelector';
import RangePreview from './components/RangePreview';
import SplitActionBar from './components/SplitActionBar';
import SuccessModal from './components/SuccessModal';

import { 
  parseRangeString, 
  pagesToRangeString, 
  extractPagesToSinglePdf, 
  splitPagesToZip, 
  downloadFile 
} from './utils/pdfUtils';
import { generateSamplePdf } from './utils/samplePdf';

export default function App() {
  const [file, setFile] = useState(null);
  const [rangeInput, setRangeInput] = useState('');
  const [splitMode, setSplitMode] = useState('single'); // 'single' | 'zip'
  const [outputFilename, setOutputFilename] = useState('');
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Parse and validate current range input against file page count
  const parsedResult = useMemo(() => {
    if (!file) return { valid: false, pages: [], error: null };
    return parseRangeString(rangeInput, file.pageCount);
  }, [rangeInput, file]);

  // Handle file selection from DropZone or input
  const handleFileSelect = async (selectedFile) => {
    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const totalPages = pdfDoc.getPageCount();

      const baseName = selectedFile.name.replace(/\.pdf$/i, '');
      setFile({
        buffer,
        name: selectedFile.name,
        size: selectedFile.size,
        pageCount: totalPages,
      });

      // Default range selection: first to last or first 3
      const defaultMax = Math.min(totalPages, totalPages > 3 ? 3 : totalPages);
      const defaultRange = totalPages === 1 ? '1' : `1-${defaultMax}`;
      setRangeInput(defaultRange);
      setOutputFilename(`${baseName}_split`);
      setResultData(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Unable to read PDF file. Please ensure it is a valid, unencrypted PDF.');
    }
  };

  // Generate and load demo PDF
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
      setRangeInput('1-4');
      setOutputFilename('demo-sample_split');
      setResultData(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error generating demo PDF.');
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  // Reset to upload screen
  const handleReset = () => {
    setFile(null);
    setRangeInput('');
    setOutputFilename('');
    setResultData(null);
    setIsModalOpen(false);
  };

  // Preset buttons logic
  const handleApplyPreset = (action) => {
    if (!file) return;
    const total = file.pageCount;
    let newPages = [];

    switch (action) {
      case 'all':
        setRangeInput(`1-${total}`);
        return;
      case 'first-half':
        setRangeInput(`1-${Math.ceil(total / 2)}`);
        return;
      case 'second-half': {
        const start = Math.ceil(total / 2) + 1;
        setRangeInput(start <= total ? `${start}-${total}` : `${total}`);
        return;
      }
      case 'odd':
        for (let i = 1; i <= total; i += 2) newPages.push(i);
        setRangeInput(pagesToRangeString(newPages));
        return;
      case 'even':
        for (let i = 2; i <= total; i += 2) newPages.push(i);
        setRangeInput(pagesToRangeString(newPages));
        return;
      case 'clear':
        setRangeInput('');
        return;
      default:
        break;
    }
  };

  // Trigger celebratory confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#10b981', '#3b82f6'],
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  // Perform split and download
  const handleSplit = async () => {
    if (!file || !parsedResult.valid || parsedResult.pages.length === 0) return;

    setIsProcessing(true);
    try {
      const cleanBaseName = (outputFilename.trim() || 'split_document').replace(/\.(pdf|zip)$/i, '');

      if (splitMode === 'single') {
        const splitPdfBytes = await extractPagesToSinglePdf(file.buffer, parsedResult.pages);
        const finalFilename = `${cleanBaseName}.pdf`;
        const blob = new Blob([splitPdfBytes], { type: 'application/pdf' });

        downloadFile(blob, finalFilename);
        triggerConfetti();

        setResultData({
          blob,
          filename: finalFilename,
          size: splitPdfBytes.byteLength,
          pagesCount: parsedResult.pages.length,
        });
        setIsModalOpen(true);
      } else {
        const zipBlob = await splitPagesToZip(file.buffer, parsedResult.pages, cleanBaseName);
        const finalFilename = `${cleanBaseName}.zip`;

        downloadFile(zipBlob, finalFilename);
        triggerConfetti();

        setResultData({
          blob: zipBlob,
          filename: finalFilename,
          size: zipBlob.size,
          pagesCount: parsedResult.pages.length,
        });
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      alert(`Error splitting PDF: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAgain = () => {
    if (!resultData) return;
    downloadFile(resultData.blob, resultData.filename);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative text-gray-900 font-sans overflow-x-hidden selection:bg-yellow-400 selection:text-gray-900">
      {/* Abstract Background Blobs matching main portfolio */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-8%] right-[-5%] w-[550px] h-[550px] rounded-full bg-yellow-100/60 mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[25%] left-[-10%] w-[450px] h-[450px] rounded-full bg-yellow-200/50 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] right-[15%] w-[400px] h-[400px] rounded-full bg-yellow-100/50 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Decorative dot matrix */}
        <div className="absolute top-24 right-12 w-32 h-32 bg-[radial-gradient(#FACC15_2px,transparent_2px)] [background-size:16px_16px] opacity-35 hidden md:block"></div>
        <div className="absolute bottom-40 left-12 w-32 h-32 bg-[radial-gradient(#d1d5db_2px,transparent_2px)] [background-size:16px_16px] opacity-40 hidden md:block"></div>
      </div>

      {/* Top Navbar */}
      <Navbar onReset={handleReset} hasFile={!!file} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {!file ? (
          <DropZone 
            onFileSelect={handleFileSelect} 
            onDemoSelect={handleDemoSelect}
            isGeneratingDemo={isGeneratingDemo}
          />
        ) : (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Document Details Header */}
            <DocumentHeader fileInfo={file} onReset={handleReset} />

            {/* Range Input Box & Output Configuration */}
            <RangeSelector
              rangeInput={rangeInput}
              onRangeInputChange={setRangeInput}
              totalPages={file.pageCount}
              parsedResult={parsedResult}
              splitMode={splitMode}
              setSplitMode={setSplitMode}
              outputFilename={outputFilename}
              setOutputFilename={setOutputFilename}
              onApplyPreset={handleApplyPreset}
            />

            {/* High-Speed Boundary Preview: Only First & Last Page of the Range */}
            <RangePreview
              selectedPages={parsedResult.pages}
              pdfBuffer={file.buffer}
              totalPages={file.pageCount}
            />

            {/* Bottom Split & Download Action Bar */}
            <SplitActionBar
              parsedResult={parsedResult}
              splitMode={splitMode}
              isProcessing={isProcessing}
              onSplit={handleSplit}
            />
          </div>
        )}
      </main>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resultData={resultData}
        onReset={handleReset}
        onDownloadAgain={handleDownloadAgain}
      />

      {/* Footer matching main portfolio */}
      <footer className="w-full border-t border-gray-100 py-8 bg-white/80 backdrop-blur-sm text-center text-xs text-gray-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-gray-800">
              S<span className="text-yellow-500">S</span>. SplitPDF
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">Fast, 100% In-Browser PDF Processing</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} <a href="/" className="text-gray-700 hover:text-yellow-600 font-medium">Md. Sujon Shikder</a>. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
