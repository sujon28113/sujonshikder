import React, { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import ToolHub from './components/ToolHub';

import MergeTool from './components/tools/MergeTool';
import SplitTool from './components/tools/SplitTool';
import PdfToWordTool from './components/tools/PdfToWordTool';
import OrganizeTool from './components/tools/OrganizeTool';
import RotateTool from './components/tools/RotateTool';
import PdfToImageTool from './components/tools/PdfToImageTool';
import ImageToPdfTool from './components/tools/ImageToPdfTool';
import PageNumbersTool from './components/tools/PageNumbersTool';
import CompressTool from './components/tools/CompressTool';
import ExtractTextTool from './components/tools/ExtractTextTool';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.hash.replace(/^#\/?/, '').trim();
  });

  useEffect(() => {
    const handleHashChange = () => {
      const route = window.location.hash.replace(/^#\/?/, '').trim();
      setCurrentRoute(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderActiveView = () => {
    switch (currentRoute) {
      case 'merge':
        return <MergeTool />;
      case 'split':
        return <SplitTool />;
      case 'pdf-to-word':
        return <PdfToWordTool />;
      case 'organize':
        return <OrganizeTool />;
      case 'rotate':
        return <RotateTool />;
      case 'pdf-to-img':
        return <PdfToImageTool />;
      case 'img-to-pdf':
        return <ImageToPdfTool />;
      case 'page-numbers':
        return <PageNumbersTool />;
      case 'compress':
        return <CompressTool />;
      case 'extract-text':
        return <ExtractTextTool />;
      default:
        return <ToolHub />;
    }
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

      {/* Navigation Header */}
      <Navbar activeRoute={currentRoute} />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {renderActiveView()}
      </main>

      {/* Footer matching portfolio */}
      <footer className="w-full border-t border-gray-100 py-8 bg-white/80 backdrop-blur-sm text-center text-xs text-gray-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-gray-800">
              S<span className="text-yellow-500">S</span>. PDF Suite
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">10 Free Client-Side PDF Tools</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} <a href="/" className="text-gray-700 hover:text-yellow-600 font-medium">Md. Sujon Shikder</a>. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
