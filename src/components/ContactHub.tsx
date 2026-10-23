import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Send, 
  Check, 
  Copy, 
  Sparkles, 
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useDhakaTime } from '../utils/useDhakaTime';
import { personalInfo } from '../data/cvData';
import { ContactFormData } from '../types';

export const ContactHub: React.FC = () => {
  const { showToast } = usePortfolio();
  const { timeString } = useDhakaTime();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    category: 'Job Opportunity',
    message: ''
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [K in keyof ContactFormData]?: string }>({});

  const categories: ContactFormData['category'][] = [
    'Job Opportunity',
    'Advisory/Consulting',
    'Academic/Research',
    'Networking'
  ];

  const validate = () => {
    const errs: { [K in keyof ContactFormData]?: string } = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please enter your message';
    } else if (formData.message.length < 10) {
      errs.message = 'Message must be at least 10 characters long';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API delivery
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast(`Thank you ${formData.name}! Your message has been received.`, 'success');
    }, 1200);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    showToast('Copied email to clipboard!', 'success');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(personalInfo.phone);
    setCopiedPhone(true);
    showToast('Copied phone number to clipboard!', 'success');
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <section id="contact" className="py-20 border-t border-warm-border/60 dark:border-espresso-border bg-warm-bg dark:bg-espresso-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="pb-8 border-b border-warm-border/60 dark:border-espresso-border max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-warm-accent font-bold mb-2">
            Initiate Collaboration & Direct Contact
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-warm-text dark:text-espresso-text">
            Smart Contact & Inquiry Hub
          </h2>
          <p className="mt-2 text-sm sm:text-base text-warm-muted dark:text-espresso-muted">
            Whether you have a full-time role opening, a corporate tax or audit consulting assignment, or an academic research inquiry, let's connect.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Info Cards & Live Status */}
          <div className="lg:col-span-5 space-y-4">
            {/* Live Availability Status Card */}
            <div className="p-6 rounded-3xl bg-warm-card dark:bg-espresso-card border border-warm-border dark:border-espresso-border shadow-warm-sm">
              <div className="flex items-center gap-2 text-xs font-mono text-warm-accent font-semibold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Current Status</span>
              </div>
              <h3 className="text-lg font-bold text-warm-text dark:text-espresso-text">
                Available for Roles & Consulting
              </h3>
              <p className="mt-1.5 text-xs text-warm-muted dark:text-espresso-muted leading-relaxed">
                Open for full-time statutory audit, financial reporting, corporate tax advisory, or business intelligence positions.
              </p>
              
              <div className="mt-4 pt-4 border-t border-dashed border-warm-border/60 dark:border-espresso-border flex items-center justify-between text-xs font-mono text-warm-subtle">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-warm-accent" />
                  <span>Local Time (Dhaka):</span>
                </span>
                <span className="font-bold text-warm-text dark:text-espresso-text tabular-nums">
                  {timeString || '11:30 AM'} (GMT+6)
                </span>
              </div>
            </div>

            {/* Direct Contact Cards */}
            <div className="grid grid-cols-1 gap-3">
              {/* Email Card */}
              <div className="p-4 rounded-2xl bg-warm-card dark:bg-espresso-card border border-warm-border dark:border-espresso-border shadow-xs flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-warm-bg dark:bg-espresso-bg border border-warm-border/60 shrink-0">
                    <Mail className="w-4 h-4 text-warm-accent" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-mono uppercase text-warm-subtle">Email Directly</span>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="block text-xs sm:text-sm font-bold text-warm-text dark:text-espresso-text hover:text-warm-accent truncate"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg hover:bg-warm-hover dark:hover:bg-espresso-hover text-warm-subtle transition-colors shrink-0"
                  title="Copy email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone Card */}
              <div className="p-4 rounded-2xl bg-warm-card dark:bg-espresso-card border border-warm-border dark:border-espresso-border shadow-xs flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-warm-bg dark:bg-espresso-bg border border-warm-border/60 shrink-0">
                    <Phone className="w-4 h-4 text-warm-accent" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-mono uppercase text-warm-subtle">Phone & WhatsApp</span>
                    <a
                      href={`tel:${personalInfo.phone}`}
                      className="block text-xs sm:text-sm font-bold text-warm-text dark:text-espresso-text hover:text-warm-accent font-mono truncate"
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>
                <button
                  onClick={handleCopyPhone}
                  className="p-2 rounded-lg hover:bg-warm-hover dark:hover:bg-espresso-hover text-warm-subtle transition-colors shrink-0"
                  title="Copy phone number"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Location Card */}
              <div className="p-4 rounded-2xl bg-warm-card dark:bg-espresso-card border border-warm-border dark:border-espresso-border shadow-xs flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-warm-bg dark:bg-espresso-bg border border-warm-border/60 shrink-0">
                  <MapPin className="w-4 h-4 text-warm-accent" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-warm-subtle">Based In</span>
                  <span className="block text-xs sm:text-sm font-bold text-warm-text dark:text-espresso-text">
                    {personalInfo.location}
                  </span>
                </div>
              </div>

              {/* LinkedIn & GitHub Links */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-warm-card dark:bg-espresso-card border border-warm-border dark:border-espresso-border hover:border-warm-accent text-xs font-semibold text-warm-text dark:text-espresso-text shadow-xs transition-all duration-150 group"
                >
                  <Linkedin className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                  <span>Connect on LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 text-warm-subtle" />
                </a>

                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-warm-card dark:bg-espresso-card border border-warm-border dark:border-espresso-border hover:border-warm-accent text-xs font-semibold text-warm-text dark:text-espresso-text shadow-xs transition-all duration-150 group"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Categorized Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-warm-card dark:bg-espresso-card border border-warm-border dark:border-espresso-border shadow-warm-md dark:shadow-dark-md">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-xs">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-warm-text dark:text-espresso-text">
                    Inquiry Transmitted Successfully
                  </h3>
                  <p className="text-sm text-warm-muted dark:text-espresso-muted max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Your inquiry has been routed to Sujon Shikder. You can expect a response within 24 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        category: 'Job Opportunity',
                        message: ''
                      });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-warm-accent hover:bg-warm-accent-hover text-warm-text text-xs font-bold transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-warm-subtle dark:text-espresso-subtle mb-2">
                      Inquiry Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {categories.map(cat => (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                          className={`py-2 px-2.5 rounded-xl text-xs font-mono font-medium border text-center transition-all ${
                            formData.category === cat
                              ? 'bg-warm-accent text-warm-text border-warm-accent font-bold shadow-xs'
                              : 'bg-warm-bg dark:bg-espresso-bg border-warm-border/80 text-warm-muted dark:text-espresso-muted hover:border-warm-accent'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-warm-subtle dark:text-espresso-subtle mb-1.5">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Sarah Jenkins"
                        className={`w-full px-4 py-2.5 rounded-xl bg-warm-bg dark:bg-espresso-bg border text-xs sm:text-sm text-warm-text dark:text-espresso-text placeholder-warm-subtle outline-none transition-colors ${
                          errors.name ? 'border-rose-500' : 'border-warm-border/80 focus:border-warm-accent'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-[11px] text-rose-500 font-mono">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-warm-subtle dark:text-espresso-subtle mb-1.5">
                        Your Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="e.g. sarah@firm.com"
                        className={`w-full px-4 py-2.5 rounded-xl bg-warm-bg dark:bg-espresso-bg border text-xs sm:text-sm text-warm-text dark:text-espresso-text placeholder-warm-subtle outline-none transition-colors ${
                          errors.email ? 'border-rose-500' : 'border-warm-border/80 focus:border-warm-accent'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-[11px] text-rose-500 font-mono">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-warm-subtle dark:text-espresso-subtle mb-1.5">
                      Message / Project Scope
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder={`Provide details regarding the ${formData.category.toLowerCase()}...`}
                      className={`w-full px-4 py-2.5 rounded-xl bg-warm-bg dark:bg-espresso-bg border text-xs sm:text-sm text-warm-text dark:text-espresso-text placeholder-warm-subtle outline-none transition-colors resize-none ${
                        errors.message ? 'border-rose-500' : 'border-warm-border/80 focus:border-warm-accent'
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-[11px] text-rose-500 font-mono">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-warm-accent hover:bg-warm-accent-hover text-warm-text font-bold text-sm shadow-warm-md hover:shadow-warm-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-warm-text border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Inquiry ({formData.category})</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
