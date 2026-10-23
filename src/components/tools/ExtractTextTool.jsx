import React, { useState } from 'react';
import { AlignLeft, Download, Copy, Check, Loader2, Sparkles, FileText } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ToolHeader from '../shared/ToolHeader';
import MultiFileDropZone from '../shared/MultiFileDropZone';
import DocumentHeader from '../DocumentHeader';
import { extractTextFromPdf, downloadFile } from '../../utils/pdfUtils';
import { generateSamplePdf } from '../../utils/samplePdf';

export default function ExtractTextTool() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [copied, setCopied] = useState(false);

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

      // Extract text right away
      setIsProcessing(true);
      const { fullText } = await extractTextFromPdf(buffer);
      setExtractedText(fullText);
    } catch (err) {
      console.error(err);
      alert('Unable to extract text from this PDF.');
    } finally {
      setIsProcessing(false);
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

      setIsProcessing(true);
      const { fullText } = await extractTextFromPdf(demo.buffer);
      setExtractedText(fullText);
    } catch (err) {
      console.error(err);
      alert('Error creating demo.');
    } finally {
      setIsGeneratingDemo(false);
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!extractedText || !file) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadFile(blob, `${baseName}_extracted.txt`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ToolHeader
        title="Extract Text"
        description="Extract all readable textual content across all pages of your PDF with zero formatting errors."
        icon={AlignLeft}
        category="Convert"
        hasFile={Boolean(file)}
        onReset={() => {
          setFile(null);
          setExtractedText('');
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
          title="Drop your PDF here to extract text"
          subtitle="or browse documents from your device"
        />
      ) : (
        <div className="space-y-6">
          <DocumentHeader fileInfo={file} onReset={() => setFile(null)} />

          {/* Text Area Card */}
          <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-heading font-bold text-lg text-[#111827]">
                Extracted Text Content
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-yellow-400 hover:text-[#111827] text-xs font-bold text-gray-700 transition-all shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-xs font-bold text-[#111827] transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            {isProcessing ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
                <p className="text-xs text-gray-500 font-medium">Extracting textual content...</p>
              </div>
            ) : (
              <textarea
                readOnly
                value={extractedText}
                rows={16}
                className="w-full p-4 rounded-2xl bg-gray-50 font-mono text-xs text-gray-800 border-2 border-gray-200 outline-none resize-y leading-relaxed"
                placeholder="No text found in this PDF..."
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
