import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Layers, 
  ShieldAlert,
  FileText
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { projectsData } from '../data/projectsData';

export const ProjectsEngine: React.FC = () => {
  const { 
    selectedProject, 
    setSelectedProject, 
    highlightedProjectIds, 
    setIsCvModalOpen 
  } = usePortfolio();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Finance & Accounting',
    'Data & BI Analytics',
    'Audit & Assurance',
    'Strategy & Publishing'
  ];

  const filteredProjects = useMemo(() => {
    return projectsData.filter(project => {
      const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        project.title.toLowerCase().includes(q) ||
        project.subtitle.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        project.toolsUsed.some(t => t.toLowerCase().includes(q)) ||
        project.role.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="projects" className="py-20 border-t border-warm-border/60 dark:border-espresso-border bg-warm-bg dark:bg-espresso-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-warm-border/60 dark:border-espresso-border">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-warm-accent font-bold mb-2">
              Case Studies & Practical Implementations
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-warm-text dark:text-espresso-text">
              Financial, Audit & Analytical Engine
            </h2>
            <p className="mt-2 text-sm sm:text-base text-warm-muted dark:text-espresso-muted max-w-2xl">
              Real-world audit working papers, dynamic valuation models, corporate tax computations, and Power BI dashboards.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 self-start md:self-auto text-xs font-mono px-3.5 py-1.5 rounded-xl bg-warm-card dark:bg-espresso-card border border-warm-border dark:border-espresso-border text-warm-muted dark:text-espresso-muted">
            <Layers className="w-3.5 h-3.5 text-warm-accent" />
            <span>Showing {filteredProjects.length} of {projectsData.length} Case Studies</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-3 rounded-2xl bg-warm-card dark:bg-espresso-card border border-warm-border dark:border-espresso-border shadow-xs">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-150 ${
                  activeCategory === cat
                    ? 'bg-warm-accent text-warm-text font-bold shadow-xs'
                    : 'text-warm-muted dark:text-espresso-muted hover:bg-warm-hover dark:hover:bg-espresso-hover'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Real-time search */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-warm-subtle absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by tool or topic (e.g. 'Excel', 'VAT')..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-warm-bg dark:bg-espresso-bg border border-warm-border dark:border-espresso-border text-warm-text dark:text-espresso-text placeholder-warm-subtle outline-none focus:border-warm-accent"
            />
          </div>
        </div>

        {/* Projects Grid with Animated Layout */}
        <motion.div
          layout
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.length === 0 ? (
              <div className="col-span-full py-16 text-center text-sm text-warm-muted dark:text-espresso-muted">
                No case studies matched your current category or query.
              </div>
            ) : (
              filteredProjects.map(project => {
                const isSkillHighlighted = highlightedProjectIds.includes(project.id);

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedProject(project)}
                    className={`group cursor-pointer rounded-3xl p-6 bg-warm-card dark:bg-espresso-card border transition-all duration-200 flex flex-col justify-between ${
                      isSkillHighlighted
                        ? 'border-warm-accent shadow-warm-md ring-2 ring-warm-accent/40 scale-[1.02]'
                        : 'border-warm-border dark:border-espresso-border shadow-warm-sm dark:shadow-dark-sm hover:border-warm-accent hover:shadow-warm-md'
                    }`}
                  >
                    <div>
                      {/* Card Header & Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-warm-bg dark:bg-espresso-bg border border-warm-border/60 text-warm-subtle">
                          {project.category}
                        </span>
                        <span className="text-xs font-mono text-warm-subtle">
                          {project.year}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-lg font-bold text-warm-text dark:text-espresso-text group-hover:text-warm-accent transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-xs font-mono text-warm-accent dark:text-yellow-400">
                        {project.role}
                      </p>

                      {/* Summary */}
                      <p className="mt-3 text-xs sm:text-sm text-warm-muted dark:text-espresso-muted leading-relaxed line-clamp-3">
                        {project.summary}
                      </p>

                      {/* Key Metrics Grid */}
                      <div className="mt-5 grid grid-cols-2 gap-2 pt-4 border-t border-dashed border-warm-border/60 dark:border-espresso-border/60">
                        {project.metrics.slice(0, 2).map((metric, i) => (
                          <div key={i} className="p-2 rounded-xl bg-warm-bg dark:bg-espresso-bg border border-warm-border/50 dark:border-espresso-border">
                            <span className="block text-[10px] font-mono uppercase text-warm-subtle truncate">
                              {metric.label}
                            </span>
                            <span className="block text-xs font-mono font-bold text-warm-text dark:text-espresso-text truncate mt-0.5">
                              {metric.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom: Tool chips and "Read Case Study" prompt */}
                    <div className="mt-6 pt-4 border-t border-warm-border/50 dark:border-espresso-border/60">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.toolsUsed.map(tool => (
                          <span
                            key={tool}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-warm-bg dark:bg-espresso-bg border border-warm-border/60 dark:border-espresso-border text-warm-subtle"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold text-warm-text dark:text-espresso-text group-hover:text-warm-accent transition-colors">
                        <span>Read Case Study</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>

        {/* In-depth Slide-Over Drawer / Modal for Selected Project */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm p-0 sm:p-4">
              {/* Click outside to close */}
              <div 
                className="absolute inset-0" 
                onClick={() => setSelectedProject(null)} 
              />

              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                className="relative z-10 w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[92vh] bg-warm-bg dark:bg-espresso-card sm:rounded-3xl border-l sm:border border-warm-border dark:border-espresso-border shadow-warm-lg dark:shadow-dark-lg overflow-y-auto flex flex-col p-6 sm:p-8"
              >
                {/* Drawer Close Button & Category */}
                <div className="flex items-center justify-between pb-4 border-b border-warm-border/60 dark:border-espresso-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-warm-accent/20 border border-warm-accent/50 text-warm-text dark:text-espresso-text font-bold">
                      {selectedProject.category}
                    </span>
                    <span className="text-xs font-mono text-warm-subtle">
                      {selectedProject.year}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-full hover:bg-warm-hover dark:hover:bg-espresso-hover text-warm-subtle transition-colors"
                    aria-label="Close case study"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Title & Header */}
                <div className="mt-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-warm-text dark:text-espresso-text tracking-tight">
                    {selectedProject.title}
                  </h2>
                  <p className="mt-1 text-sm font-mono text-warm-accent dark:text-yellow-400">
                    {selectedProject.subtitle}
                  </p>
                  <p className="mt-2 text-xs font-mono text-warm-subtle">
                    Role: <strong>{selectedProject.role}</strong> &middot; Context: {selectedProject.context}
                  </p>
                </div>

                {/* Key Metrics Banner */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {selectedProject.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-warm-card dark:bg-espresso-bg border border-warm-border/70 dark:border-espresso-border text-center"
                    >
                      <span className="block text-[10px] font-mono uppercase text-warm-subtle">
                        {m.label}
                      </span>
                      <span className="block text-sm sm:text-base font-mono font-extrabold text-warm-text dark:text-espresso-text mt-0.5">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Problem Statement Callout */}
                <div className="mt-6 p-4 rounded-2xl bg-warm-card dark:bg-espresso-bg/60 border border-warm-border/80 dark:border-espresso-border">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-warm-accent font-bold mb-1.5 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Problem Statement & Strategic Context</span>
                  </h4>
                  <p className="text-sm text-warm-muted dark:text-espresso-muted leading-relaxed">
                    {selectedProject.problem}
                  </p>
                </div>

                {/* Methodology Breakdown */}
                <div className="mt-6">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-warm-subtle dark:text-espresso-subtle mb-3">
                    Execution Methodology & Procedures
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedProject.methodology.map((step, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-warm-text dark:text-espresso-text"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-warm-accent/20 text-warm-text text-xs font-mono font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Outcomes & Deliverables */}
                <div className="mt-6">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-warm-subtle dark:text-espresso-subtle mb-3">
                    Measurable Impact & Key Outcomes
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.keyOutcomes.map((outcome, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-warm-muted dark:text-espresso-muted"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tools Used */}
                <div className="mt-6 pt-4 border-t border-warm-border/60 dark:border-espresso-border">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-warm-subtle dark:text-espresso-subtle mb-2.5">
                    Technologies & Analytical Tooling
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.toolsUsed.map(tool => (
                      <span
                        key={tool}
                        className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-warm-card dark:bg-espresso-bg border border-warm-border dark:border-espresso-border text-warm-text dark:text-espresso-text"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CV Reference & Action CTA */}
                {selectedProject.documentRef && (
                  <div className="mt-6 p-3.5 rounded-xl bg-warm-card/80 dark:bg-espresso-bg border border-warm-border/70 dark:border-espresso-border flex items-center justify-between gap-3 text-xs font-mono">
                    <span className="text-warm-subtle truncate">
                      {selectedProject.documentRef}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedProject(null);
                        setIsCvModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 font-bold text-warm-accent hover:underline shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Inspect CV</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
