import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { ToastContainer } from './components/ToastContainer';
import { Navbar } from './components/Navbar';
import { CommandPalette } from './components/CommandPalette';
import { Hero } from './components/Hero';
import { DualModeExperience } from './components/DualModeExperience';
import { ProjectsEngine } from './components/ProjectsEngine';
import { CompetencyBentoGrid } from './components/CompetencyBentoGrid';
import { CVInspectorModal } from './components/CVInspectorModal';
import { ContactHub } from './components/ContactHub';
import { Footer } from './components/Footer';

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-warm-bg dark:bg-espresso-bg text-warm-text dark:text-espresso-text selection:bg-warm-accent/30 selection:text-warm-text transition-colors duration-200 flex flex-col">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Global Command Palette */}
      <CommandPalette />

      {/* In-Browser CV Inspector Modal */}
      <CVInspectorModal />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* Section 1: Editorial Hero & Live Metrics */}
        <Hero />

        {/* Section 2: Dual-Mode Experience & Education Explorer (Timeline & Executive Sheet) */}
        <DualModeExperience />

        {/* Section 3: Filterable Project & Case Study Engine */}
        <ProjectsEngine />

        {/* Section 4: Interactive Competency Bento Grid with Cross-Highlighting */}
        <CompetencyBentoGrid />

        {/* Section 5: Smart Contact & Inquiry Hub */}
        <ContactHub />
      </main>

      {/* Minimalist Editorial Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
};

export default App;
