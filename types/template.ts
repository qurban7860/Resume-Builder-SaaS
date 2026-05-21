export type TemplateId = 'classic' | 'modern' | 'executive' | 'vercel' | 'linear' | 'stripe' | 'notion';

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
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Ultra-minimal monochrome — Inter font, heavy whitespace, precision layout.',
    badge: 'Vercel · Netlify',
    accent: '#000000',
    preview: { bg: '#fafafa', bar: '#000000', text: '#171717' },
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'High-tech dark-adjacent with violet accents — for engineers who mean business.',
    badge: 'Linear · Figma',
    accent: '#6366f1',
    preview: { bg: '#ffffff', bar: '#6366f1', text: '#0f172a' },
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Elegant dual-column layout — left sidebar with contact & skills, right for experience.',
    badge: 'Stripe · Square',
    accent: '#0ea5e9',
    preview: { bg: '#f8fafc', bar: '#0ea5e9', text: '#0f172a' },
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Clean blocky serif — light grey section boxes, minimal color, maximum readability.',
    badge: 'Notion · Dropbox',
    accent: '#374151',
    preview: { bg: '#f9fafb', bar: '#374151', text: '#111827' },
  },
];
