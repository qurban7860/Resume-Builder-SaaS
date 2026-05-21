import React from 'react';
import { useTemplateStore } from '@/store/useTemplateStore';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';

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
    experience: { items: Array<any> };
    education: { items: Array<any> };
    projects: { items: Array<any> };
    skills: { items: Array<any> };
    certifications: { items: Array<any> };
    relevantCoursework: { items: Array<any> };
    achievements: { items: Array<any> };
  };
}

interface ResumeRendererProps {
  resume: Resume | null;
  printMode?: boolean;
}

export const ResumeRenderer = React.memo(
  ({ resume, printMode = false }: ResumeRendererProps) => {
    const { templateId } = useTemplateStore();

    if (!resume) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-400">No resume data available</p>
        </div>
      );
    }

    const containerClass = printMode
      ? 'w-full h-full p-4 bg-white'
      : 'bg-white max-w-4xl mx-auto my-4 shadow-lg rounded-lg p-8';

    const templateProps = { resume };

    return (
      <div className={containerClass}>
        {templateId === 'modern'    && <ModernTemplate    {...templateProps} />}
        {templateId === 'executive' && <ExecutiveTemplate {...templateProps} />}
        {(templateId === 'classic' || !templateId) && <ClassicTemplate {...templateProps} />}
      </div>
    );
  }
);

ResumeRenderer.displayName = 'ResumeRenderer';
