export interface Education {
  degree: string;
  field: string;
  institution: string;
  year: string;
  expectedDate?: string;
  cgpa?: string;
  status: string;
  highlights: string[];
  coursework?: string[];
  skillsApplied: string[];
}

export interface Experience {
  id: string;
  title: string;
  role: string;
  wing?: string;
  organization: string;
  location: string;
  period: string;
  type: 'Professional' | 'Leadership' | 'Competition' | 'Academic';
  summary: string;
  achievements: string[];
  skillsApplied: string[];
  featured?: boolean;
}

export interface SkillItem {
  name: string;
  level?: string;
  featured?: boolean;
  relatedProjectIds: string[];
  relatedExperienceIds: string[];
}

export interface SkillCategory {
  domain: string;
  description: string;
  iconName: string;
  skills: SkillItem[];
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  subtitle: string;
  category: 'Finance & Accounting' | 'Data & BI Analytics' | 'Audit & Assurance' | 'Strategy & Publishing';
  year: string;
  role: string;
  context: string;
  summary: string;
  problem: string;
  methodology: string[];
  keyOutcomes: string[];
  toolsUsed: string[];
  metrics: { label: string; value: string }[];
  liveUrl?: string;
  repoUrl?: string;
  documentRef?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  category: 'Job Opportunity' | 'Advisory/Consulting' | 'Academic/Research' | 'Networking';
  message: string;
}
