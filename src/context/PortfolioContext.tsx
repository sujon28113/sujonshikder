import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectCaseStudy } from '../types';
import { projectsData } from '../data/projectsData';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info';
}

interface PortfolioContextType {
  // Dark mode
  isDark: boolean;
  toggleTheme: () => void;
  // Command palette
  isCmdOpen: boolean;
  setIsCmdOpen: (open: boolean) => void;
  // CV modal
  isCvModalOpen: boolean;
  setIsCvModalOpen: (open: boolean) => void;
  // Project drawer
  selectedProject: ProjectCaseStudy | null;
  setSelectedProject: (proj: ProjectCaseStudy | null) => void;
  // Cross-highlighting
  activeSkill: string | null;
  setActiveSkill: (skillName: string | null) => void;
  highlightedProjectIds: string[];
  highlightedExperienceIds: string[];
  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info') => void;
  removeToast: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sujon_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('sujon_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('sujon_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Command palette state
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  // CV modal state
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);

  // Project drawer state
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);

  // Cross-highlighting state
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [highlightedProjectIds, setHighlightedProjectIds] = useState<string[]>([]);
  const [highlightedExperienceIds, setHighlightedExperienceIds] = useState<string[]>([]);

  // Update highlighted projects/experiences when active skill changes
  useEffect(() => {
    if (!activeSkill) {
      setHighlightedProjectIds([]);
      setHighlightedExperienceIds([]);
      return;
    }

    const lower = activeSkill.toLowerCase();
    const matchedProjects = projectsData
      .filter(p => 
        p.toolsUsed.some(t => t.toLowerCase().includes(lower) || lower.includes(t.toLowerCase())) ||
        p.title.toLowerCase().includes(lower) ||
        p.summary.toLowerCase().includes(lower)
      )
      .map(p => p.id);

    setHighlightedProjectIds(matchedProjects);
  }, [activeSkill]);

  // Global keyboard shortcut for Cmd+K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCmdOpen(false);
        setIsCvModalOpen(false);
        setSelectedProject(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <PortfolioContext.Provider
      value={{
        isDark,
        toggleTheme,
        isCmdOpen,
        setIsCmdOpen,
        isCvModalOpen,
        setIsCvModalOpen,
        selectedProject,
        setSelectedProject,
        activeSkill,
        setActiveSkill,
        highlightedProjectIds,
        highlightedExperienceIds,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
