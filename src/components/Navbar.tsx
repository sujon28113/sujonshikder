import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Search, 
  FileText, 
  Clock, 
  Menu, 
  X, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useDhakaTime } from '../utils/useDhakaTime';
import { personalInfo } from '../data/cvData';

export const Navbar: React.FC = () => {
  const { isDark, toggleTheme, setIsCmdOpen, setIsCvModalOpen } = usePortfolio();
  const { timeString } = useDhakaTime();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Profile', href: '#profile' },
    { name: 'Experience & Education', href: '#experience' },
    { name: 'Case Studies', href: '#projects' },
    { name: 'Competencies', href: '#skills' },
    { name: 'Inquiry Hub', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-3 border-b border-warm-border/60 dark:border-espresso-border shadow-warm-sm dark:shadow-dark-sm'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo & Name */}
            <a
              href="#"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-warm-accent flex items-center justify-center font-bold text-warm-text shadow-sm transition-transform duration-200 group-hover:scale-105">
                <span className="text-sm font-black tracking-tight">{personalInfo.initials}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-warm-text dark:text-espresso-text flex items-center gap-1.5">
                  {personalInfo.name}
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </span>
                <span className="text-[11px] font-mono text-warm-subtle dark:text-espresso-subtle hidden sm:inline">
                  Dhaka University &middot; ICAB CA
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-warm-muted dark:text-espresso-muted">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-3.5 py-1.5 rounded-lg hover:text-warm-text dark:hover:text-espresso-text hover:bg-warm-card dark:hover:bg-espresso-card/60 transition-colors duration-150"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Right Tools: Dhaka Clock + Cmd+K + Theme + CV Trigger */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Dhaka Local Time Pill */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warm-card/80 dark:bg-espresso-card border border-warm-border/60 dark:border-espresso-border text-xs font-mono text-warm-muted dark:text-espresso-muted">
                <Clock className="w-3.5 h-3.5 text-warm-accent" />
                <span>Dhaka (GMT+6)</span>
                <span className="font-semibold text-warm-text dark:text-espresso-text tabular-nums">
                  {timeString || '11:30 AM'}
                </span>
              </div>

              {/* Command Palette Button */}
              <button
                onClick={() => setIsCmdOpen(true)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-warm-card dark:bg-espresso-card border border-warm-border/80 dark:border-espresso-border text-xs text-warm-muted dark:text-espresso-muted hover:border-warm-accent transition-colors duration-150 group shadow-xs"
                title="Open Command Palette (Cmd + K)"
              >
                <Search className="w-3.5 h-3.5 text-warm-accent group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline text-warm-text dark:text-espresso-text font-medium">Quick Jump</span>
                <kbd className="px-1.5 py-0.5 rounded bg-warm-bg dark:bg-espresso-bg text-[10px] font-mono border border-warm-border/60 dark:border-espresso-border text-warm-subtle dark:text-espresso-subtle">
                  {isMac ? '⌘K' : 'Ctrl+K'}
                </kbd>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-lg bg-warm-card dark:bg-espresso-card border border-warm-border/80 dark:border-espresso-border text-warm-muted dark:text-espresso-muted hover:text-warm-text dark:hover:text-espresso-text transition-colors duration-150"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-warm-accent hover:rotate-45 transition-transform duration-200" />
                ) : (
                  <Moon className="w-4 h-4 text-warm-subtle hover:-rotate-12 transition-transform duration-200" />
                )}
              </button>

              {/* Preview CV Modal Button */}
              <button
                onClick={() => setIsCvModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-warm-accent hover:bg-warm-accent-hover text-warm-text text-xs font-semibold shadow-warm-sm hover:shadow-warm-md transition-all duration-150"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Preview CV</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="lg:hidden p-2 rounded-lg bg-warm-card dark:bg-espresso-card border border-warm-border/80 dark:border-espresso-border text-warm-text dark:text-espresso-text"
                aria-label="Open mobile menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[60px] z-30 p-4 lg:hidden"
          >
            <div className="bg-warm-card dark:bg-espresso-card rounded-2xl border border-warm-border dark:border-espresso-border p-5 shadow-warm-lg dark:shadow-dark-lg flex flex-col gap-3">
              <div className="flex items-center justify-between pb-3 border-b border-warm-border/60 dark:border-espresso-border">
                <div className="flex items-center gap-2 text-xs font-mono text-warm-muted dark:text-espresso-muted">
                  <Clock className="w-3.5 h-3.5 text-warm-accent" />
                  <span>Dhaka: {timeString}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCvModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-warm-accent hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Preview CV
                </button>
              </div>

              <nav className="flex flex-col gap-1 py-1">
                {navLinks.map(link => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-warm-text dark:text-espresso-text hover:bg-warm-hover/40 dark:hover:bg-espresso-hover"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-warm-subtle" />
                  </a>
                ))}
              </nav>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCmdOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-warm-accent/20 hover:bg-warm-accent/30 text-warm-text dark:text-espresso-text text-xs font-medium border border-warm-accent/40"
              >
                <Sparkles className="w-4 h-4 text-warm-accent" />
                Open Global Command Palette (Cmd+K)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
