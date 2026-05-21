export type TemplateId = 'classic' | 'modern' | 'executive';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  badge: string;
  accent: string;
  preview: {
    bg: string;
    bar: string;
    text: string;
  };
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional FAANG format — Georgia serif, bold black dividers, precise spacing.',
    badge: 'Google · Amazon',
    accent: '#111111',
    preview: { bg: '#ffffff', bar: '#111111', text: '#111111' },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary tech company style — clean sans-serif with indigo accent headers.',
    badge: 'Meta · Stripe',
    accent: '#4f46e5',
    preview: { bg: '#ffffff', bar: '#4f46e5', text: '#1e1b4b' },
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Senior / leadership format — two-column header, warm serif, refined spacing.',
    badge: 'Senior · Director',
    accent: '#7c3aed',
    preview: { bg: '#fffdf8', bar: '#7c3aed', text: '#1a0a2e' },
  },
];
