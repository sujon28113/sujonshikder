import React, { useState, useMemo } from 'react';
import { Scissors } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';

import ToolHeader from '../shared/ToolHeader';
import DropZone from '../DropZone';
import DocumentHeader from '../DocumentHeader';
import RangeSelector from '../RangeSelector';
import RangePreview from '../RangePreview';
import SplitActionBar from '../SplitActionBar';
import SuccessModal from '../SuccessModal';

import { 
  parseRangeString, 
  pagesToRangeString, 
  extractPagesToSinglePdf, 
  splitPagesToZip, 
  downloadFile 
} from '../../utils/pdfUtils';
import { generateSamplePdf } from '../../utils/samplePdf';

export default function SplitTool() {
  const [file, setFile] = useState(null);
  const [rangeInput, setRangeInput] = useState('');
  const [splitMode, setSplitMode] = useState('single');
  const [outputFilename, setOutputFilename] = useState('');
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const parsedResult = useMemo(() => {
    if (!file) return { valid: false, pages: [], error: null };
    return parseRangeString(rangeInput, file.pageCount);
  }, [rangeInput, file]);

  const handleFileSelect = async (selectedFile) => {
    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer.slice(0), { ignoreEncryption: true });
      const totalPages = pdfDoc.getPageCount();

      const baseName = selectedFile.name.replace(/\.pdf$/i, '');
      setFile({
        buffer,
        name: selectedFile.name,
        size: selectedFile.size,
        pageCount: totalPages,
      });

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

  const handleReset = () => {
    setFile(null);
    setRangeInput('');
    setOutputFilename('');
    setResultData(null);
    setIsModalOpen(false);
  };

  const handleApplyPreset = (action) => {
    if (!file) return;
    const total = file.pageCount;

    switch (action) {
      case 'all':
        setRangeInput(total === 1 ? '1' : `1-${total}`);
        break;
      case 'first-half':
        setRangeInput(`1-${Math.ceil(total / 2)}`);
        break;
      case 'second-half':
        setRangeInput(`${Math.ceil(total / 2) + 1}-${total}`);
        break;
      case 'odd': {
        const odds = [];
        for (let i = 1; i <= total; i += 2) odds.push(i);
        setRangeInput(pagesToRangeString(odds));
        break;
      }
      case 'even': {
        const evens = [];
        for (let i = 2; i <= total; i += 2) evens.push(i);
        setRangeInput(pagesToRangeString(evens));
        break;
      }
      case 'clear':
        setRangeInput('');
        break;
      default:
        break;
    }
  };

  const handleSplit = async () => {
    if (!parsedResult.valid || parsedResult.pages.length === 0 || !file) return;

    setIsProcessing(true);
    try {
      const sanitizedName = outputFilename.trim() || 'split_document';

      if (splitMode === 'single') {
        const finalFilename = `${sanitizedName}.pdf`;
        const blob = await extractPagesToSinglePdf(file.buffer, parsedResult.pages);

        downloadFile(blob, finalFilename);

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
          filename: finalFilename,
          size: blob.size,
          pagesCount: parsedResult.pages.length,
        });
        setIsModalOpen(true);
      } else {
        const finalFilename = `${sanitizedName}.zip`;
        const blob = await splitPagesToZip(file.buffer, parsedResult.pages, sanitizedName);

        downloadFile(blob, finalFilename);

        try {
          confetti({
            particleCount: 60,
            spread: 80,
            origin: { y: 0.7 },
            colors: ['#FACC15', '#EAB308', '#111827'],
          });
        } catch (e) {}

        setResultData({
          blob,
          filename: finalFilename,
          size: blob.size,
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ToolHeader
        title="Split PDF"
        description="Extract specific page ranges, separate single sheets, or batch split into independent files."
        icon={Scissors}
        category="Organize"
        hasFile={Boolean(file)}
        onReset={handleReset}
        onDemoSelect={handleDemoSelect}
        isGeneratingDemo={isGeneratingDemo}
      />

      {!file ? (
        <DropZone 
          onFileSelect={handleFileSelect} 
          onDemoSelect={handleDemoSelect}
          isGeneratingDemo={isGeneratingDemo}
        />
      ) : (
        <div className="w-full space-y-6">
          <DocumentHeader fileInfo={file} onReset={handleReset} />

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

          <RangePreview
            selectedPages={parsedResult.pages}
            pdfBuffer={file.buffer}
            totalPages={file.pageCount}
          />

          <SplitActionBar
            parsedResult={parsedResult}
            splitMode={splitMode}
            isProcessing={isProcessing}
            onSplit={handleSplit}
          />
        </div>
      )}

      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resultData={resultData}
        onReset={handleReset}
        onDownloadAgain={() => resultData && downloadFile(resultData.blob, resultData.filename)}
      />
    </div>
  );
}
