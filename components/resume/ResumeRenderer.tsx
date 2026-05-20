import React from 'react';
import { Header } from './Header';
import { Summary } from './Summary';
import { Experience } from './Experience';
import { Projects } from './Projects';
import { Skills } from './Skills';
import { Education } from './Education';
import { Certifications } from './Certifications';

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
  };
}

interface ResumeRendererProps {
  resume: Resume | null;
  printMode?: boolean;
}

export const ResumeRenderer = React.memo(
  ({ resume, printMode = false }: ResumeRendererProps) => {
    if (!resume) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-text-light">No resume data available</p>
        </div>
      );
    }

    return (
      <div
        className={`bg-white ${
          printMode
            ? 'w-full h-full'
            : 'max-w-4xl mx-auto my-8 shadow-lg'
        } p-8`}
        style={{
          fontFamily: 'Inter, Helvetica, Calibri, sans-serif',
        }}
      >
        {/* Header */}
        <Header
          name={resume.basics.name}
          headline={resume.basics.headline}
          email={resume.basics.email}
          phone={resume.basics.phone}
          location={resume.basics.location}
          linkedin={resume.basics.linkedin}
          github={resume.basics.github}
          website={resume.basics.url?.href}
        />

        {/* Summary */}
        <div className="mb-4">
          <Summary content={resume.sections.summary.content} />
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] gap-6 items-start">
          {/* Main Column */}
          <div className="space-y-4">
            <Experience items={resume.sections.experience.items} />
            <Projects items={resume.sections.projects.items} />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-4">
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4">
              <Skills items={resume.sections.skills.items} />
            </div>
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4">
              <Education items={resume.sections.education.items} />
            </div>
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4">
              <Certifications items={resume.sections.certifications.items} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ResumeRenderer.displayName = 'ResumeRenderer';
