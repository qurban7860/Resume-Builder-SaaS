import { z } from 'zod';

const BasicsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  headline: z.string().min(1, 'Headline is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(5, 'Invalid phone'),
  location: z.string().min(1, 'Location is required'),
  url: z.object({
    href: z.string().url().optional().or(z.literal('')),
  }),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
});

const ExperienceItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title required'),
  company: z.string().min(1, 'Company required'),
  companyUrl: z.string().url().optional().or(z.literal('')),
  startDate: z.string(),
  endDate: z.string(),
  summary: z.string().optional(),
});

const EducationItemSchema = z.object({
  id: z.string().uuid(),
  institution: z.string().min(1, 'Institution required'),
  studyType: z.string().min(1, 'Study type required'),
  startDate: z.string(),
  endDate: z.string(),
});

const ProjectItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Project name required'),
  description: z.string().min(1, 'Description required'),
  projectUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
});

const SkillItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Skill name required'),
  keywords: z.array(z.string()).min(1, 'At least one keyword'),
});

const CertificationItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Certification name required'),
});

const SectionsSchema = z.object({
  summary: z.object({ content: z.string() }),
  experience: z.object({ items: z.array(ExperienceItemSchema) }),
  education: z.object({ items: z.array(EducationItemSchema) }),
  projects: z.object({ items: z.array(ProjectItemSchema) }),
  skills: z.object({ items: z.array(SkillItemSchema) }),
  certifications: z.object({ items: z.array(CertificationItemSchema) }),
  keyAchievements: z.object({ items: z.array(z.object({
    id: z.string().uuid(),
    content: z.string()
  })) }).optional(),
});

export const ResumeSchema = z.object({
  basics: BasicsSchema,
  sections: SectionsSchema,
});

export type Resume = z.infer<typeof ResumeSchema>;
