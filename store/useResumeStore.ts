import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ID = string;

export interface WebsiteLink {
  href: string;
  label?: string;
}

export interface Resume {
  basics: {
    name: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    url: WebsiteLink;
    linkedin?: string;
    github?: string;
  };
  sections: {
    summary: { content: string };
    experience: { items: any[] };
    education: { items: any[] };
    projects: { items: any[] };
    skills: { items: any[] };
    certifications: { items: any[] };
    relevantCoursework: { items: any[] };
    achievements: { items: any[] };
  };
}

export interface ScoreBreakdownItem {
  id: string;
  category: 'basics' | 'summary' | 'experience' | 'projects' | 'skills' | 'education' | 'certifications' | 'achievements';
  title: string;
  description: string;
  score: number;
  maxScore: number;
  passed: boolean;
  type: 'success' | 'warning' | 'error';
}

export interface ResumeStore {
  resume: Resume | null;
  setResume: (resume: Resume) => void;
  updateBasics: (basics: Resume['basics']) => void;
  updateSection: (section: keyof Resume['sections'], data: any) => void;
  moveSectionItem: (section: keyof Resume['sections'], fromIndex: number, toIndex: number) => void;
  getDetailedScore: () => { score: number; breakdown: ScoreBreakdownItem[] };
  getScore: () => number;
  activeWorkspace: string;
  switchWorkspace: (id: string) => void;
  versions: Array<{ id: ID; timestamp: string; label: string; resume: Resume }>;
  saveVersion: (label: string) => void;
  restoreVersion: (id: ID) => void;
  deleteVersion: (id: ID) => void;
  clear: () => void;
}

const emptyResume = (): Resume => ({
  basics: {
    name: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    url: { href: '' },
  },
  sections: {
    summary: { content: '' },
    experience: { items: [] },
    education: { items: [] },
    projects: { items: [] },
    skills: { items: [] },
    certifications: { items: [] },
    relevantCoursework: { items: [] },
    achievements: { items: [] },
  },
});

const normalizeText = (value?: string) => (value || '').toString().replace(/\s+/g, ' ').trim();

const computeScore = (resume: Resume | null) => {
  if (!resume) return { score: 0, breakdown: [] };

  const basics = resume.basics;
  const summary = normalizeText(resume.sections.summary.content);
  const experienceItems = resume.sections.experience.items || [];
  const projectItems = resume.sections.projects.items || [];
  const skillsItems = resume.sections.skills.items || [];
  const educationItems = resume.sections.education.items || [];
  const certificationItems = resume.sections.certifications.items || [];
  const achievementItems = resume.sections.achievements.items || [];

  const breakdown: ScoreBreakdownItem[] = [];

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basics.email || '');
  breakdown.push({
    id: 'basics-email',
    category: 'basics',
    title: 'Professional Email',
    description: validEmail ? 'Professional email is present.' : 'Add a valid email address.',
    score: validEmail ? 4 : 0,
    maxScore: 4,
    passed: validEmail,
    type: validEmail ? 'success' : 'error',
  });

  const hasPhone = normalizeText(basics.phone).length > 3;
  breakdown.push({
    id: 'basics-phone',
    category: 'basics',
    title: 'Phone Number',
    description: hasPhone ? 'Phone number is provided.' : 'Add a phone number for recruiter follow-up.',
    score: hasPhone ? 4 : 0,
    maxScore: 4,
    passed: hasPhone,
    type: hasPhone ? 'success' : 'warning',
  });

  const hasLocation = normalizeText(basics.location).length > 0;
  breakdown.push({
    id: 'basics-location',
    category: 'basics',
    title: 'Location',
    description: hasLocation ? 'Location is set.' : 'Add your city and country or region.',
    score: hasLocation ? 4 : 0,
    maxScore: 4,
    passed: hasLocation,
    type: hasLocation ? 'success' : 'warning',
  });

  const hasProfessionalLinks = !!normalizeText(basics.linkedin) || !!normalizeText(basics.github);
  breakdown.push({
    id: 'basics-links',
    category: 'basics',
    title: 'Professional Links',
    description: hasProfessionalLinks ? 'At least one profile link is included.' : 'Add LinkedIn or GitHub to strengthen recruiter confidence.',
    score: hasProfessionalLinks ? 4 : 0,
    maxScore: 4,
    passed: hasProfessionalLinks,
    type: hasProfessionalLinks ? 'success' : 'warning',
  });

  const hasWebsite = !!normalizeText(basics.url?.href);
  breakdown.push({
    id: 'basics-website',
    category: 'basics',
    title: 'Portfolio / Website',
    description: hasWebsite ? 'Portfolio or website link is included.' : 'Add a portfolio or personal website link if available.',
    score: hasWebsite ? 4 : 0,
    maxScore: 4,
    passed: hasWebsite,
    type: hasWebsite ? 'success' : 'warning',
  });

  const summaryLength = summary.length;
  const summaryLengthScore = summaryLength >= 100 && summaryLength <= 350 ? 5 : summaryLength > 0 ? 2 : 0;
  breakdown.push({
    id: 'summary-length',
    category: 'summary',
    title: 'Summary Length',
    description: summaryLengthScore === 5 ? 'Summary length is optimal for a one-page resume.' : summaryLengthScore === 2 ? 'Summary is short; expand with impact statements.' : 'Add a summary to introduce your profile.',
    score: summaryLengthScore,
    maxScore: 5,
    passed: summaryLengthScore === 5,
    type: summaryLengthScore === 5 ? 'success' : 'warning',
  });

  const roleKeywords = /engineer|developer|programmer|analyst|designer|product|manager|specialist/i;
  const hasRole = roleKeywords.test(summary) || roleKeywords.test(normalizeText(basics.headline));
  breakdown.push({
    id: 'summary-role',
    category: 'summary',
    title: 'Target Role Clarity',
    description: hasRole ? 'Career target is clear in the summary or headline.' : 'Mention your target role or specialization more clearly.',
    score: hasRole ? 5 : 0,
    maxScore: 5,
    passed: hasRole,
    type: hasRole ? 'success' : 'warning',
  });

  const keywordMatch = /experience|proficient|skilled|built|developed|designed|implemented|optimized|collaborated|managed|led|react|next|typescript|javascript|node|cloud|aws|sql|docker|kubernetes/i;
  const hasKeywords = keywordMatch.test(summary);
  breakdown.push({
    id: 'summary-keywords',
    category: 'summary',
    title: 'Strong Keywords',
    description: hasKeywords ? 'Summary contains strong technical and action-oriented keywords.' : 'Add relevant keywords for ATS and recruiter scanning.',
    score: hasKeywords ? 5 : 0,
    maxScore: 5,
    passed: hasKeywords,
    type: hasKeywords ? 'success' : 'warning',
  });

  const expCountScore = experienceItems.length >= 2 ? 8 : experienceItems.length === 1 ? 4 : 0;
  breakdown.push({
    id: 'experience-count',
    category: 'experience',
    title: 'Work Experience Coverage',
    description: experienceItems.length >= 2 ? 'Good number of experience entries for a one-page resume.' : experienceItems.length === 1 ? 'Add one more role for stronger career context.' : 'Add work experience entries to showcase your background.',
    score: expCountScore,
    maxScore: 8,
    passed: expCountScore === 8,
    type: expCountScore === 8 ? 'success' : 'warning',
  });

  const hasExperienceBullets = experienceItems.length > 0 && experienceItems.every((item) => /<li>|\n|\r|\u2022/.test(item.summary || ''));
  breakdown.push({
    id: 'experience-bullets',
    category: 'experience',
    title: 'Bullet-style Accomplishments',
    description: hasExperienceBullets ? 'Experience entries use bullet or line-separated accomplishment statements.' : 'Use concise accomplishments or bullet-style formatting in experience summaries.',
    score: hasExperienceBullets ? 8 : 0,
    maxScore: 8,
    passed: hasExperienceBullets,
    type: hasExperienceBullets ? 'success' : 'warning',
  });

  const hasQuantifiable = experienceItems.some((item) => /[0-9]+%|[0-9]+\+|\$[0-9]+|dollar|users|customers|revenue|growth|performance|increase|reduced|saved/i.test(item.summary || ''));
  breakdown.push({
    id: 'experience-quantifiable',
    category: 'experience',
    title: 'Quantifiable Results',
    description: hasQuantifiable ? 'Some roles include measurable impact or results.' : 'Add measurable outcomes to your experience bullet points.',
    score: hasQuantifiable ? 5 : 0,
    maxScore: 5,
    passed: hasQuantifiable,
    type: hasQuantifiable ? 'success' : 'warning',
  });

  const projectCountScore = projectItems.length >= 2 ? 6 : projectItems.length === 1 ? 3 : 0;
  breakdown.push({
    id: 'projects-count',
    category: 'projects',
    title: 'Project Coverage',
    description: projectItems.length >= 2 ? 'Good project showcase for an engineering resume.' : projectItems.length === 1 ? 'Add at least one more project.' : 'Add key projects to show practical experience.',
    score: projectCountScore,
    maxScore: 6,
    passed: projectCountScore === 6,
    type: projectCountScore === 6 ? 'success' : 'warning',
  });

  const hasProjectLinks = projectItems.some((project) => !!normalizeText(project.projectUrl) || !!normalizeText(project.githubUrl));
  breakdown.push({
    id: 'projects-links',
    category: 'projects',
    title: 'Project Links',
    description: hasProjectLinks ? 'Projects include at least one clickable link.' : 'Add GitHub or deployment URLs for your projects.',
    score: hasProjectLinks ? 5 : 0,
    maxScore: 5,
    passed: hasProjectLinks,
    type: hasProjectLinks ? 'success' : 'warning',
  });

  const projectDescriptionsGood = projectItems.length > 0 && projectItems.every((project) => normalizeText(project.description).length >= 40);
  breakdown.push({
    id: 'projects-descriptions',
    category: 'projects',
    title: 'Project Detail',
    description: projectDescriptionsGood ? 'Project descriptions are clear and detailed.' : 'Ensure project descriptions explain what you built and how.',
    score: projectDescriptionsGood ? 4 : 0,
    maxScore: 4,
    passed: projectDescriptionsGood,
    type: projectDescriptionsGood ? 'success' : 'warning',
  });

  const skillCategoriesGood = skillsItems.length >= 2;
  breakdown.push({
    id: 'skills-categories',
    category: 'skills',
    title: 'Skill Categories',
    description: skillCategoriesGood ? 'Skills are grouped into multiple categories.' : 'Group your skills into at least two categories.',
    score: skillCategoriesGood ? 4 : 0,
    maxScore: 4,
    passed: skillCategoriesGood,
    type: skillCategoriesGood ? 'success' : 'warning',
  });

  const totalSkillKeywords = skillsItems.reduce((count, item) => count + ((item.keywords || []).length || 0), 0);
  const skillKeywordScore = totalSkillKeywords >= 8 ? 4 : totalSkillKeywords >= 4 ? 2 : 0;
  breakdown.push({
    id: 'skills-keywords',
    category: 'skills',
    title: 'Skill Keywords',
    description: skillKeywordScore === 4 ? 'Strong keyword coverage across skill categories.' : skillKeywordScore === 2 ? 'Add more specific skill keywords.' : 'Add technical skill keywords to help ATS matching.',
    score: skillKeywordScore,
    maxScore: 4,
    passed: skillKeywordScore === 4,
    type: skillKeywordScore === 4 ? 'success' : 'warning',
  });

  const modernTechFound = skillsItems.some((item) => (item.keywords || []).some((keyword: string) => /react|next|typescript|javascript|node|aws|docker|kubernetes|sql|git/i.test(keyword)));
  breakdown.push({
    id: 'skills-modern',
    category: 'skills',
    title: 'Modern Technologies',
    description: modernTechFound ? 'Modern technologies are represented in skill keywords.' : 'Add relevant modern stack keywords like React, TypeScript, or AWS.',
    score: modernTechFound ? 2 : 0,
    maxScore: 2,
    passed: modernTechFound,
    type: modernTechFound ? 'success' : 'warning',
  });

  const educationComplete = educationItems.length > 0 && educationItems.every((item) => normalizeText(item.institution).length > 0 && normalizeText(item.studyType).length > 0);
  breakdown.push({
    id: 'education-complete',
    category: 'education',
    title: 'Education Section',
    description: educationComplete ? 'Education details are complete.' : 'Add your degree and institution details.',
    score: educationComplete ? 5 : 0,
    maxScore: 5,
    passed: educationComplete,
    type: educationComplete ? 'success' : 'warning',
  });

  const courseworkGood = educationItems.some((item) => normalizeText(item.coursework).length > 0);
  breakdown.push({
    id: 'education-coursework',
    category: 'education',
    title: 'Coursework',
    description: courseworkGood ? 'Relevant coursework is included within education entries.' : 'Add relevant coursework to demonstrate academic preparation.',
    score: courseworkGood ? 3 : 0,
    maxScore: 3,
    passed: courseworkGood,
    type: courseworkGood ? 'success' : 'warning',
  });

  const hasCertifications = certificationItems.length > 0;
  breakdown.push({
    id: 'certifications',
    category: 'certifications',
    title: 'Certifications',
    description: hasCertifications ? 'Certifications are listed.' : 'Add certifications to boost professional credibility.',
    score: hasCertifications ? 1 : 0,
    maxScore: 1,
    passed: hasCertifications,
    type: hasCertifications ? 'success' : 'warning',
  });

  const hasAchievements = achievementItems.length > 0;
  breakdown.push({
    id: 'achievements',
    category: 'achievements',
    title: 'Achievements & Awards',
    description: hasAchievements ? 'Achievements are included.' : 'Add notable achievements or awards.',
    score: hasAchievements ? 1 : 0,
    maxScore: 1,
    passed: hasAchievements,
    type: hasAchievements ? 'success' : 'warning',
  });

  const score = breakdown.reduce((total, item) => total + item.score, 0);
  return { score: Math.min(100, score), breakdown };
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resume: null,
      activeWorkspace: 'default',
      versions: [],
      setResume: (resume) => set({ resume }),
      updateBasics: (basics) =>
        set((state) => ({
          resume: state.resume
            ? { ...state.resume, basics: { ...state.resume.basics, ...basics } }
            : { ...emptyResume(), basics: { ...emptyResume().basics, ...basics } },
        })),
      updateSection: (section, data) =>
        set((state) => ({
          resume: state.resume
            ? { ...state.resume, sections: { ...state.resume.sections, [section]: data } }
            : { ...emptyResume(), sections: { ...emptyResume().sections, [section]: data } },
        })),
      moveSectionItem: (section, fromIndex, toIndex) =>
        set((state) => {
          if (!state.resume) return state;
          const sectionValue = state.resume.sections[section] as { items: any[] };
          if (!sectionValue || !Array.isArray(sectionValue.items)) return state;
          const items = [...sectionValue.items];
          if (fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) return state;
          const [item] = items.splice(fromIndex, 1);
          items.splice(toIndex, 0, item);
          return {
            resume: {
              ...state.resume,
              sections: {
                ...state.resume.sections,
                [section]: { ...sectionValue, items },
              },
            },
          };
        }),
      getDetailedScore: () => computeScore(get().resume),
      getScore: () => computeScore(get().resume).score,
      switchWorkspace: (id) => set({ activeWorkspace: id }),
      saveVersion: (label) =>
        set((state) => ({
          versions: [
            ...state.versions,
            {
              id: `${Date.now()}`,
              timestamp: new Date().toISOString(),
              label,
              resume: state.resume || emptyResume(),
            },
          ],
        })),
      restoreVersion: (id) =>
        set((state) => {
          const found = state.versions.find((version) => version.id === id);
          return found ? { resume: found.resume } : {};
        }),
      deleteVersion: (id) =>
        set((state) => ({
          versions: state.versions.filter((version) => version.id !== id),
        })),
      clear: () => set({ resume: null, versions: [], activeWorkspace: 'default' }),
    }),
    {
      name: 'resume-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
