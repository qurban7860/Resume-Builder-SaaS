import { create } from 'zustand';

interface Resume {
  basics: {
    name: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    url: { href: string };
    linkedin?: string;
    github?: string;
  };
  sections: {
    summary: { content: string };
    experience: {
      items: Array<{
        id: string;
        title: string;
        company: string;
        companyUrl?: string;
        startDate: string;
        endDate: string;
        summary?: string;
        location?: string;
      }>;
    };
    education: {
      items: Array<{
        id: string;
        institution: string;
        studyType: string;
        startDate: string;
        endDate: string;
        location?: string;
        coursework?: string;
      }>;
    };
    projects: {
      items: Array<{
        id: string;
        name: string;
        description: string;
        projectUrl?: string;
        githubUrl?: string;
        date?: string;
        technologies?: string;
      }>;
    };
    skills: {
      items: Array<{
        id: string;
        name: string;
        keywords: string[];
      }>;
    };
    certifications: {
      items: Array<{
        id: string;
        name: string;
      }>;
    };
    relevantCoursework: {
      items: Array<{
        id: string;
        name: string;
      }>;
    };
    achievements: {
      items: Array<{
        id: string;
        title: string;
        subtitle: string;
        startDate?: string;
        endDate?: string;
      }>;
    };
  };
}

export interface ScoreBreakdownItem {
  id: string;
  category: 'basics' | 'summary' | 'experience' | 'projects' | 'skills' | 'education' | 'certifications' | 'coursework' | 'achievements' | 'formatting';
  title: string;
  description: string;
  score: number;
  maxScore: number;
  passed: boolean;
  type: 'success' | 'warning' | 'error';
}

export interface DetailedScore {
  score: number;
  breakdown: ScoreBreakdownItem[];
}

type ListSectionKey = Exclude<keyof Resume['sections'], 'summary'>;

interface ResumeStore {
  resume: Resume | null;
  setResume: (data: Resume) => void;
  updateBasics: (basics: Resume['basics']) => void;
  updateSection: (section: keyof Resume['sections'], data: any) => void;
  moveSectionItem: (section: ListSectionKey, fromIndex: number, toIndex: number) => void;
  updateExperienceItem: (index: number, item: any) => void;
  addExperienceItem: (item: any) => void;
  removeExperienceItem: (index: number) => void;
  getScore: () => number;
  getDetailedScore: () => DetailedScore;
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resume: null,

  setResume: (data: Resume) => set({ resume: data }),

  updateBasics: (basics: Resume['basics']) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            basics,
          }
        : null,
    })),

  updateSection: (section: keyof Resume['sections'], data: any) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            sections: {
              ...state.resume.sections,
              [section]: data,
            },
          }
        : null,
    })),

  updateExperienceItem: (index: number, item: any) =>
    set((state) => {
      if (!state.resume) return {};
      const items = [...state.resume.sections.experience.items];
      items[index] = item;
      return {
        resume: {
          ...state.resume,
          sections: {
            ...state.resume.sections,
            experience: { items },
          },
        },
      };
    }),

  addExperienceItem: (item: any) =>
    set((state) => {
      if (!state.resume) return {};
      return {
        resume: {
          ...state.resume,
          sections: {
            ...state.resume.sections,
            experience: {
              items: [...state.resume.sections.experience.items, item],
            },
          },
        },
      };
    }),

  removeExperienceItem: (index: number) =>
    set((state) => {
      if (!state.resume) return {};
      const items = state.resume.sections.experience.items.filter(
        (_, i) => i !== index
      );
      return {
        resume: {
          ...state.resume,
          sections: {
            ...state.resume.sections,
            experience: { items },
          },
        },
      };
    }),

  moveSectionItem: (section: ListSectionKey, fromIndex: number, toIndex: number) =>
    set((state) => {
      if (!state.resume) return {};
      const currentItems = [...state.resume.sections[section].items];
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= currentItems.length ||
        toIndex >= currentItems.length
      ) {
        return {};
      }
      const [item] = currentItems.splice(fromIndex, 1);
      currentItems.splice(toIndex, 0, item);

      return {
        resume: {
          ...state.resume,
          sections: {
            ...state.resume.sections,
            [section]: {
              items: currentItems,
            },
          },
        },
      };
    }),

  getScore: () => {
    return get().getDetailedScore().score;
  },

  getDetailedScore: () => {
    const state = get();
    if (!state.resume) return { score: 0, breakdown: [] };

    const { resume } = state;
    const breakdown: ScoreBreakdownItem[] = [];

    // --- 1. CONTACT INFO / BASICS (Max 15 pts) ---
    const hasEmail = !!resume.basics.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.basics.email);
    breakdown.push({
      id: 'basics-email',
      category: 'basics',
      title: 'Valid Email Address',
      description: hasEmail ? 'Email is present and format is valid.' : 'Add a valid professional email address.',
      score: hasEmail ? 3 : 0,
      maxScore: 3,
      passed: hasEmail,
      type: hasEmail ? 'success' : 'error',
    });

    const hasPhone = !!resume.basics.phone && resume.basics.phone.trim().length >= 5;
    breakdown.push({
      id: 'basics-phone',
      category: 'basics',
      title: 'Phone Number',
      description: hasPhone ? 'Phone number is present.' : 'Add your contact phone number.',
      score: hasPhone ? 3 : 0,
      maxScore: 3,
      passed: hasPhone,
      type: hasPhone ? 'success' : 'error',
    });

    const hasLocation = !!resume.basics.location && resume.basics.location.trim().length > 0;
    breakdown.push({
      id: 'basics-location',
      category: 'basics',
      title: 'Location',
      description: hasLocation ? `Location set: ${resume.basics.location}.` : 'Add your city and country/state.',
      score: hasLocation ? 3 : 0,
      maxScore: 3,
      passed: hasLocation,
      type: hasLocation ? 'success' : 'error',
    });

    const hasLinkedIn = !!resume.basics.linkedin && resume.basics.linkedin.trim().length > 0;
    breakdown.push({
      id: 'basics-linkedin',
      category: 'basics',
      title: 'LinkedIn Link',
      description: hasLinkedIn ? 'LinkedIn profile link is present.' : 'Add your LinkedIn profile link (crucial for recruiters).',
      score: hasLinkedIn ? 3 : 0,
      maxScore: 3,
      passed: hasLinkedIn,
      type: hasLinkedIn ? 'success' : 'warning',
    });

    const hasGitHub = !!resume.basics.github && resume.basics.github.trim().length > 0;
    breakdown.push({
      id: 'basics-github',
      category: 'basics',
      title: 'GitHub Profile Link',
      description: hasGitHub ? 'GitHub profile link is present.' : 'Add your GitHub profile link (essential for software engineer roles).',
      score: hasGitHub ? 3 : 0,
      maxScore: 3,
      passed: hasGitHub,
      type: hasGitHub ? 'success' : 'warning',
    });

    // --- 2. SUMMARY (Max 10 pts) ---
    const summaryText = resume.sections.summary?.content || '';
    const summaryLength = summaryText.trim().length;
    const summaryLengthOk = summaryLength >= 100 && summaryLength <= 400;
    breakdown.push({
      id: 'summary-length',
      category: 'summary',
      title: 'Summary Length',
      description: summaryLengthOk 
        ? 'Summary length is optimal (100-400 characters).' 
        : `Summary should be between 100-400 characters (currently: ${summaryLength} chars).`,
      score: summaryLengthOk ? 4 : (summaryLength > 0 ? 1 : 0),
      maxScore: 4,
      passed: summaryLengthOk,
      type: summaryLengthOk ? 'success' : 'warning',
    });

    const hasRoleInSummary = /engineer|developer|architect|programmer|scientist|specialist/i.test(summaryText) || /engineer|developer|architect/i.test(resume.basics.headline);
    breakdown.push({
      id: 'summary-role',
      category: 'summary',
      title: 'Role Alignment',
      description: hasRoleInSummary 
        ? 'Target job role/headline is clear and aligned.' 
        : 'Headline or summary should explicitly mention your target engineering role (e.g. Software Engineer).',
      score: hasRoleInSummary ? 3 : 0,
      maxScore: 3,
      passed: hasRoleInSummary,
      type: hasRoleInSummary ? 'success' : 'warning',
    });

    const actionKeywords = /experience|proficient|skilled|scalable|building|responsive|developer|developing|react|next|native|javascript|typescript|redux|state/i;
    const hasKeywordsInSummary = actionKeywords.test(summaryText);
    breakdown.push({
      id: 'summary-keywords',
      category: 'summary',
      title: 'Impact Keywords',
      description: hasKeywordsInSummary 
        ? 'Summary contains industry-recognized action verbs/technologies.' 
        : 'Add relevant tech keywords and action words to your summary.',
      score: hasKeywordsInSummary ? 3 : 0,
      maxScore: 3,
      passed: hasKeywordsInSummary,
      type: hasKeywordsInSummary ? 'success' : 'warning',
    });

    // --- 3. EXPERIENCE (Max 25 pts) ---
    const expItems = resume.sections.experience?.items || [];
    const hasRolesCount = expItems.length >= 2 && expItems.length <= 4;
    breakdown.push({
      id: 'experience-count',
      category: 'experience',
      title: 'Number of Roles',
      description: hasRolesCount 
        ? `${expItems.length} experience entries is optimal for a 1-page resume.` 
        : 'Aim for 2 to 4 roles to showcase career progression without overcrowding a single page.',
      score: expItems.length >= 2 ? 8 : (expItems.length === 1 ? 4 : 0),
      maxScore: 8,
      passed: expItems.length >= 2,
      type: expItems.length >= 2 ? 'success' : 'warning',
    });

    const hasBulletPoints = expItems.length > 0 && expItems.every(item => item.summary && (item.summary.includes('<li>') || item.summary.includes('<br>')));
    breakdown.push({
      id: 'experience-bullets',
      category: 'experience',
      title: 'Accomplishment Bullet Points',
      description: hasBulletPoints 
        ? 'All experience roles use structured bullet points.' 
        : 'Use structured bullet points (ul/li tags) for experience instead of a block of text.',
      score: hasBulletPoints ? 8 : 0,
      maxScore: 8,
      passed: hasBulletPoints,
      type: hasBulletPoints ? 'success' : 'error',
    });

    const hasQuantifiable = expItems.length > 0 && expItems.some(item => {
      const text = item.summary || '';
      return /[0-9]+%|[0-9]+\+|[0-9]+\s*(?:countries|users|years|months|hours|projects|dollar|usd|\$)/i.test(text);
    });
    breakdown.push({
      id: 'experience-quantifiable',
      category: 'experience',
      title: 'Quantifiable Results',
      description: hasQuantifiable 
        ? 'Resume details accomplishments using quantifiable metrics (e.g. 75+, 1.5+ years).' 
        : 'Add quantifiable metrics (percentages, numbers, dollar amounts) to demonstrate the impact of your work.',
      score: hasQuantifiable ? 5 : 0,
      maxScore: 5,
      passed: hasQuantifiable,
      type: hasQuantifiable ? 'success' : 'warning',
    });

    const strongVerbs = /built|developed|designed|implemented|optimized|created|collaborated|managed|led|architected|engineered|spearheaded|increased/i;
    const hasStrongVerbs = expItems.length > 0 && expItems.every(item => strongVerbs.test(item.summary || ''));
    breakdown.push({
      id: 'experience-verbs',
      category: 'experience',
      title: 'ATS Action Verbs',
      description: hasStrongVerbs 
        ? 'Accomplishment points start with powerful ATS action verbs.' 
        : 'Start accomplishment points with strong action verbs (e.g. Developed, Optimized, Engineered).',
      score: hasStrongVerbs ? 4 : 1,
      maxScore: 4,
      passed: hasStrongVerbs,
      type: hasStrongVerbs ? 'success' : 'warning',
    });

    // --- 4. PROJECTS (Max 15 pts) ---
    const projectItems = resume.sections.projects?.items || [];
    const hasProjects = projectItems.length >= 2;
    breakdown.push({
      id: 'projects-count',
      category: 'projects',
      title: 'Project Showcases',
      description: hasProjects 
        ? `Showcasing ${projectItems.length} projects is excellent.` 
        : 'Add at least 2 key projects to demonstrate practical application of your skills.',
      score: hasProjects ? 5 : (projectItems.length === 1 ? 3 : 0),
      maxScore: 5,
      passed: hasProjects,
      type: hasProjects ? 'success' : 'warning',
    });

    const hasProjectLinks = projectItems.length > 0 && projectItems.some(item => (item.projectUrl && item.projectUrl.trim().length > 0) || (item.githubUrl && item.githubUrl.trim().length > 0));
    breakdown.push({
      id: 'projects-links',
      category: 'projects',
      title: 'Clickable Project Links',
      description: hasProjectLinks 
        ? 'Projects include clickable repository or deployment URLs.' 
        : 'Add clickable links (GitHub repo or live demo) to your projects to prove authenticity.',
      score: hasProjectLinks ? 5 : 0,
      maxScore: 5,
      passed: hasProjectLinks,
      type: hasProjectLinks ? 'success' : 'warning',
    });

    const hasProjectDescLength = projectItems.length > 0 && projectItems.every(item => item.description && item.description.trim().length > 40);
    breakdown.push({
      id: 'projects-desc',
      category: 'projects',
      title: 'Project Detail Level',
      description: hasProjectDescLength 
        ? 'Project descriptions are descriptive and detailed.' 
        : 'Ensure each project description is at least 40 characters, explaining what you built and how.',
      score: hasProjectDescLength ? 5 : 2,
      maxScore: 5,
      passed: hasProjectDescLength,
      type: hasProjectDescLength ? 'success' : 'warning',
    });

    // --- 5. SKILLS (Max 15 pts) ---
    const skillItems = resume.sections.skills?.items || [];
    const hasSkillCategories = skillItems.length >= 2;
    breakdown.push({
      id: 'skills-categories',
      category: 'skills',
      title: 'Skill Categorization',
      description: hasSkillCategories 
        ? 'Skills are grouped logically into categories.' 
        : 'Group your skills into categories (e.g. Frontend, Tools, Backend) to make them readable.',
      score: hasSkillCategories ? 5 : 0,
      maxScore: 5,
      passed: hasSkillCategories,
      type: hasSkillCategories ? 'success' : 'warning',
    });

    const totalKeywords = skillItems.reduce((acc, curr) => acc + (curr.keywords || []).length, 0);
    const keywordsCountOk = totalKeywords >= 8;
    breakdown.push({
      id: 'skills-count',
      category: 'skills',
      title: 'Skill Keywords Count',
      description: keywordsCountOk 
        ? `Found ${totalKeywords} skill keywords (industry standard).` 
        : `Add at least 8 specific skill keywords (currently: ${totalKeywords}).`,
      score: keywordsCountOk ? 5 : 2,
      maxScore: 5,
      passed: keywordsCountOk,
      type: keywordsCountOk ? 'success' : 'warning',
    });

    const hasModernTech = skillItems.some(item => {
      const keywords = (item.keywords || []).map(k => k.toLowerCase());
      return keywords.some(k => ['react', 'next.js', 'typescript', 'redux', 'native', 'tailwind', 'javascript', 'node.js', 'git'].includes(k));
    });
    breakdown.push({
      id: 'skills-modern',
      category: 'skills',
      title: 'Modern Stack Presence',
      description: hasModernTech 
        ? 'Found essential modern engineering keywords (React, TypeScript, Next.js, etc.).' 
        : 'Add highly sought-after engineering technologies to match modern job descriptions.',
      score: hasModernTech ? 5 : 0,
      maxScore: 5,
      passed: hasModernTech,
      type: hasModernTech ? 'success' : 'warning',
    });

    // --- 6. EDUCATION & COURSEWORK (Max 10 pts) ---
    const educationItems = resume.sections.education?.items || [];
    const hasEducation = educationItems.length > 0 && educationItems.every(edu => edu.institution && edu.studyType);
    breakdown.push({
      id: 'education-presence',
      category: 'education',
      title: 'Education Details',
      description: hasEducation 
        ? 'Education details are properly listed.' 
        : 'List your degree and university details.',
      score: hasEducation ? 5 : 0,
      maxScore: 5,
      passed: hasEducation,
      type: hasEducation ? 'success' : 'error',
    });

    const courseworkItems = resume.sections.relevantCoursework?.items || [];
    const hasEducationCoursework = educationItems.some(edu => !!edu.coursework && edu.coursework.trim().length > 0);
    const hasCoursework = courseworkItems.length > 0 || hasEducationCoursework;
    breakdown.push({
      id: 'coursework-presence',
      category: 'coursework',
      title: 'Relevant Coursework',
      description: hasCoursework 
        ? `Found ${courseworkItems.length} relevant coursework items.` 
        : 'Add relevant coursework to support your educational background.',
      score: hasCoursework ? 5 : 0,
      maxScore: 5,
      passed: hasCoursework,
      type: hasCoursework ? 'success' : 'warning',
    });

    // --- 7. CERTIFICATIONS & ACHIEVEMENTS (Max 10 pts) ---
    const certsItems = resume.sections.certifications?.items || [];
    const hasCerts = certsItems.length > 0;
    breakdown.push({
      id: 'certifications-presence',
      category: 'certifications',
      title: 'Professional Certifications',
      description: hasCerts 
        ? `Listed ${certsItems.length} certifications.` 
        : 'Add industry certifications to support your qualifications.',
      score: hasCerts ? 5 : 0,
      maxScore: 5,
      passed: hasCerts,
      type: hasCerts ? 'success' : 'warning',
    });

    const achievementsItems = resume.sections.achievements?.items || [];
    const hasAchievements = achievementsItems.length > 0;
    breakdown.push({
      id: 'achievements-presence',
      category: 'achievements',
      title: 'Achievements & Awards',
      description: hasAchievements 
        ? `Found ${achievementsItems.length} achievements/awards.` 
        : 'Add scholarships or awards to showcase your excellence.',
      score: hasAchievements ? 5 : 0,
      maxScore: 5,
      passed: hasAchievements,
      type: hasAchievements ? 'success' : 'warning',
    });

    // Calculate total score
    const totalScore = breakdown.reduce((acc, item) => acc + item.score, 0);

    // --- 8. FORMATTING & PAGE LENGTH (Soft warning / penalty) ---
    const totalItemsCount = expItems.length + projectItems.length + certsItems.length + achievementsItems.length;
    const tooManyItems = totalItemsCount > 12;
    if (tooManyItems) {
      breakdown.push({
        id: 'formatting-length',
        category: 'formatting',
        title: 'Single Page Density Warning',
        description: 'You have many items which might cause the PDF to span multiple pages. Try to make bullet points shorter or remove less relevant projects/roles.',
        score: -5,
        maxScore: 0,
        passed: false,
        type: 'warning',
      });
    }

    const finalScore = Math.max(0, Math.min(100, totalScore + (tooManyItems ? -5 : 0)));

    return {
      score: finalScore,
      breakdown,
    };
  },
}));
