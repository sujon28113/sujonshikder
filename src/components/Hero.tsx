import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  ArrowRight, 
  Copy, 
  Check, 
  Clock, 
  Sparkles, 
  GraduationCap, 
  ShieldCheck, 
  Briefcase, 
  Award
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useDhakaTime } from '../utils/useDhakaTime';
import { personalInfo, statsMetrics } from '../data/cvData';

export const Hero: React.FC = () => {
  const { setIsCvModalOpen, showToast } = usePortfolio();
  const { timeString, dateString } = useDhakaTime();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    showToast(`Copied ${personalInfo.email} to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const getMetricIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'FileSpreadsheet':
        return <Briefcase className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <section id="profile" className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      {/* Background warm subtle ambient gradients */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-warm-card/60 via-warm-hover/20 to-transparent dark:from-espresso-card/40 dark:via-transparent dark:to-transparent pointer-events-none rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Top Badge Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-6"
        >
          {/* Live Availability Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium text-emerald-800 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{personalInfo.availabilityStatus}</span>
          </div>

          {/* Dhaka Live Time & Date Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warm-card dark:bg-espresso-card border border-warm-border dark:border-espresso-border text-xs font-mono text-warm-muted dark:text-espresso-muted">
            <Clock className="w-3.5 h-3.5 text-warm-accent" />
            <span>Dhaka, BD (GMT+6):</span>
            <span className="font-semibold text-warm-text dark:text-espresso-text tabular-nums">
              {timeString || '11:30 AM'} &middot; {dateString || 'Today'}
            </span>
          </div>
        </motion.div>

        {/* Editorial Headline & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl"
        >
          <div className="text-xs font-mono uppercase tracking-widest text-warm-accent font-bold mb-3 flex items-center gap-2">
            <span>Chartered Accountancy &middot; Financial Reporting &middot; Business Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-warm-text dark:text-espresso-text leading-[1.12]">
            Precision in numbers.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 dark:from-yellow-400 dark:via-amber-300 dark:to-yellow-500">
              Insight in strategy.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg lg:text-xl text-warm-muted dark:text-espresso-muted leading-relaxed font-normal max-w-3xl">
            I am <strong className="font-bold text-warm-text dark:text-espresso-text">{personalInfo.name}</strong>, a final-semester BBA in Accounting candidate at the{' '}
            <span className="text-warm-text dark:text-espresso-text font-semibold underline decoration-warm-border decoration-2 underline-offset-4">University of Dhaka</span>{' '}
            (CGPA 3.63/4.00) and an{' '}
            <span className="text-warm-text dark:text-espresso-text font-semibold underline decoration-warm-border decoration-2 underline-offset-4">ICAB CA Professional Level</span>{' '}
            candidate. I bridge statutory auditing and corporate tax compliance with modern financial modeling, Power BI analytics, and enterprise ERP automation.
          </p>
        </motion.div>

        {/* Tactile Quick-Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
        >
          {/* Primary Action: Explore Case Studies */}
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-warm-accent hover:bg-warm-accent-hover text-warm-text font-semibold text-sm shadow-warm-md hover:shadow-warm-lg transition-all duration-200 group"
          >
            <span>Explore Case Studies</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Secondary Action: Interactive CV / Timeline */}
          <a
            href="#experience"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-warm-card hover:bg-warm-hover dark:bg-espresso-card dark:hover:bg-espresso-hover border border-warm-border dark:border-espresso-border text-warm-text dark:text-espresso-text font-semibold text-sm shadow-warm-sm transition-all duration-200"
          >
            <span>Timeline & Experience</span>
          </a>

          {/* Tertiary Action: In-browser CV Preview Modal */}
          <button
            onClick={() => setIsCvModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-warm-card hover:bg-warm-hover dark:bg-espresso-card dark:hover:bg-espresso-hover border border-warm-border dark:border-espresso-border text-warm-text dark:text-espresso-text font-semibold text-sm shadow-warm-sm transition-all duration-200 group"
          >
            <FileText className="w-4 h-4 text-warm-accent group-hover:scale-110 transition-transform" />
            <span>Preview CV</span>
          </button>

          {/* One-click Copy Email with tactile feedback */}
          <button
            onClick={handleCopyEmail}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
              copied
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-300'
                : 'bg-warm-bg dark:bg-espresso-bg border-warm-border dark:border-espresso-border text-warm-muted dark:text-espresso-muted hover:text-warm-text hover:border-warm-accent'
            }`}
            title="Copy email to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-mono text-xs font-semibold">Email Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-warm-accent" />
                <span className="font-mono text-xs">{personalInfo.email}</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Quantitative Metrics Bento Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {statsMetrics.map(stat => (
            <div
              key={stat.id}
              className="p-5 rounded-2xl bg-warm-card dark:bg-espresso-card border border-warm-border dark:border-espresso-border shadow-warm-sm dark:shadow-dark-sm hover:border-warm-accent transition-colors duration-200 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-warm-subtle dark:text-espresso-subtle">
                  {stat.label}
                </span>
                <div className="p-2 rounded-lg bg-warm-bg dark:bg-espresso-bg border border-warm-border/60 dark:border-espresso-border group-hover:scale-105 transition-transform">
                  {getMetricIcon(stat.icon)}
                </div>
              </div>
              <div className="text-2xl font-extrabold text-warm-text dark:text-espresso-text tracking-tight font-mono">
                {stat.value}
              </div>
              <p className="mt-1.5 text-xs text-warm-muted dark:text-espresso-muted leading-relaxed">
                {stat.detail}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
