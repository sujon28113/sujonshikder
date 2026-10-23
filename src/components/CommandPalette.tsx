import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Download, 
  Copy, 
  Moon, 
  Sun, 
  ExternalLink, 
  Compass, 
  FolderKanban, 
  Check, 
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { projectsData } from '../data/projectsData';
import { personalInfo } from '../data/cvData';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Case Studies' | 'Actions' | 'Social';
  icon: React.ReactNode;
  action: () => void;
  keywords?: string;
}

export const CommandPalette: React.FC = () => {
  const { 
    isCmdOpen, 
    setIsCmdOpen, 
    setIsCvModalOpen, 
    setSelectedProject, 
    isDark, 
    toggleTheme, 
    showToast 
  } = usePortfolio();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input whenever modal opens
  useEffect(() => {
    if (isCmdOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCmdOpen]);

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    showToast('Email copied to clipboard (sujonshikder736@gmail.com)', 'success');
    setTimeout(() => setCopiedEmail(false), 2000);
    setIsCmdOpen(false);
  };

  const downloadCV = () => {
    const link = document.createElement('a');
    link.href = personalInfo.cvPdfPath;
    link.download = 'Md. Sujon Shikder CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CV download initiated', 'info');
    setIsCmdOpen(false);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsCmdOpen(false);
  };

  const openProject = (projId: string) => {
    const p = projectsData.find(item => item.id === projId);
    if (p) {
      setSelectedProject(p);
    }
    setIsCmdOpen(false);
  };

  // Build command list
  const commandItems: CommandItem[] = [
    // Actions
    {
      id: 'action-preview-cv',
      title: 'Preview CV (Interactive Modal)',
      subtitle: 'View official Md. Sujon Shikder CV.pdf in browser viewer',
      category: 'Actions',
      icon: <FileText className="w-4 h-4 text-warm-accent" />,
      action: () => {
        setIsCmdOpen(false);
        setIsCvModalOpen(true);
      },
      keywords: 'cv resume pdf download preview view profile'
    },
    {
      id: 'action-download-cv',
      title: 'Download CV PDF',
      subtitle: 'Direct high-resolution download to device',
      category: 'Actions',
      icon: <Download className="w-4 h-4 text-warm-accent" />,
      action: downloadCV,
      keywords: 'download cv resume pdf save'
    },
    {
      id: 'action-copy-email',
      title: 'Copy Email Address',
      subtitle: personalInfo.email,
      category: 'Actions',
      icon: copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-warm-accent" />,
      action: copyEmailToClipboard,
      keywords: 'email mail contact address copy'
    },
    {
      id: 'action-toggle-theme',
      title: `Switch to ${isDark ? 'Warm Stone Light' : 'Warm Espresso Dark'} Mode`,
      subtitle: 'Toggle aesthetic appearance & color system',
      category: 'Actions',
      icon: isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />,
      action: () => {
        toggleTheme();
        showToast(`Theme switched to ${isDark ? 'Warm Light' : 'Warm Espresso'}`, 'info');
        setIsCmdOpen(false);
      },
      keywords: 'theme dark mode light mode switch appearance style'
    },

    // Navigation
    {
      id: 'nav-profile',
      title: 'Jump to Professional Profile',
      subtitle: 'Executive overview, CGPA 3.63, and credentials',
      category: 'Navigation',
      icon: <Compass className="w-4 h-4 text-amber-600" />,
      action: () => scrollToSection('profile'),
      keywords: 'about profile bio university dhaka icab'
    },
    {
      id: 'nav-experience',
      title: 'Jump to Experience & Education',
      subtitle: 'Timeline & Executive Table view of roles, Hasan Mohin CA, ICAB',
      category: 'Navigation',
      icon: <GraduationCap className="w-4 h-4 text-amber-600" />,
      action: () => scrollToSection('experience'),
      keywords: 'education experience timeline table hasan mohin udaf bulletin'
    },
    {
      id: 'nav-projects',
      title: 'Jump to Case Studies & Projects',
      subtitle: 'Explore filterable financial models and audit workflows',
      category: 'Navigation',
      icon: <FolderKanban className="w-4 h-4 text-amber-600" />,
      action: () => scrollToSection('projects'),
      keywords: 'projects case studies work audit bi tax power bi excel'
    },
    {
      id: 'nav-contact',
      title: 'Jump to Smart Inquiry Hub',
      subtitle: 'Send message, consulting inquiries or opportunities',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4 text-amber-600" />,
      action: () => scrollToSection('contact'),
      keywords: 'contact message reach out hire consulting email'
    },

    // Case Studies
    ...projectsData.map(p => ({
      id: `proj-${p.id}`,
      title: p.title,
      subtitle: `${p.category} &middot; ${p.toolsUsed.join(', ')}`,
      category: 'Case Studies' as const,
      icon: <FolderKanban className="w-4 h-4 text-warm-accent" />,
      action: () => openProject(p.id),
      keywords: `${p.title} ${p.subtitle} ${p.category} ${p.toolsUsed.join(' ')} ${p.problem}`
    })),

    // Socials
    {
      id: 'social-linkedin',
      title: 'Visit LinkedIn Profile',
      subtitle: 'linkedin.com/in/sujon-shikder-accounting',
      category: 'Social',
      icon: <ExternalLink className="w-4 h-4 text-sky-600" />,
      action: () => {
        window.open(personalInfo.linkedin, '_blank');
        setIsCmdOpen(false);
      },
      keywords: 'linkedin profile network connect'
    }
  ];

  // Filter items
  const filteredItems = commandItems.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      (item.keywords && item.keywords.toLowerCase().includes(q))
    );
  });

  // Handle keyboard navigation inside command list
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isCmdOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCmdOpen, filteredItems, selectedIndex]);

  // Keep selected item in view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isCmdOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="relative w-full max-w-2xl bg-warm-bg dark:bg-espresso-card rounded-2xl border border-warm-border dark:border-espresso-border shadow-warm-lg dark:shadow-dark-lg overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-warm-border/70 dark:border-espresso-border bg-warm-card/60 dark:bg-espresso-bg/40">
          <Search className="w-5 h-5 text-warm-accent shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, project, or section... (e.g. 'audit', 'tax', 'cv')"
            className="w-full bg-transparent text-sm sm:text-base font-medium text-warm-text dark:text-espresso-text placeholder-warm-subtle dark:placeholder-espresso-subtle outline-none"
          />
          <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-mono rounded bg-warm-bg dark:bg-espresso-card border border-warm-border dark:border-espresso-border text-warm-subtle">
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="overflow-y-auto p-2 divide-y divide-warm-border/30 dark:divide-espresso-border/40"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-warm-muted dark:text-espresso-muted">
              No matching commands or projects found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors duration-100 ${
                  selectedIndex === idx
                    ? 'bg-warm-hover dark:bg-espresso-hover/80 text-warm-text dark:text-espresso-text'
                    : 'text-warm-muted dark:text-espresso-muted hover:bg-warm-card/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-warm-card dark:bg-espresso-bg border border-warm-border/50 dark:border-espresso-border shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate text-warm-text dark:text-espresso-text">
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p className="text-xs text-warm-subtle dark:text-espresso-subtle truncate">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-warm-bg dark:bg-espresso-bg border border-warm-border/50 dark:border-espresso-border text-warm-subtle">
                    {item.category}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 bg-warm-card/60 dark:bg-espresso-bg border-t border-warm-border/60 dark:border-espresso-border flex items-center justify-between text-[11px] font-mono text-warm-subtle dark:text-espresso-subtle">
          <div className="flex items-center gap-3">
            <span>&uarr;&darr; Navigate</span>
            <span>&crarr; Select</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center gap-1.5 text-warm-accent">
            <Sparkles className="w-3 h-3" />
            <span>Cmd Palette</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
