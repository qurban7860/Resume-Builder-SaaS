import React from 'react';
import { Header } from './Header';
import { Summary } from './Summary';
import { Experience } from './Experience';
import { Projects } from './Projects';
import { Skills } from './Skills';
import { Education } from './Education';
import { LeadershipAwards } from './LeadershipAwards';

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
    if (!resume) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-text-light">No resume data available</p>
        </div>
      );
    }

    const courseNames = resume.sections.relevantCoursework?.items?.map((i: any) => i.name) || [];
    const fallbackCoursework = courseNames.join(', ');

    return (
      <div
        className={`bg-white ${
          printMode
            ? 'w-full h-full p-4'
            : 'max-w-4xl mx-auto my-8 shadow-lg p-8 rounded-lg'
        }`}
        style={{
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
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
        <Summary content={resume.sections.summary?.content} />

        {/* Vertical Single-Column Flow */}
        <div className="space-y-4">
          {/* Education */}
          <Education 
            items={resume.sections.education.items} 
            fallbackCoursework={fallbackCoursework}
          />

          {/* Skills */}
          <Skills items={resume.sections.skills.items} />

          {/* Experience */}
          <Experience items={resume.sections.experience.items} />

          {/* Projects */}
          <Projects items={resume.sections.projects.items} />

          {/* Leadership & Awards */}
          <LeadershipAwards 
            achievements={resume.sections.achievements?.items || []} 
            certifications={resume.sections.certifications?.items || []}
          />
        </div>
      </div>
    );
  }
);

ResumeRenderer.displayName = 'ResumeRenderer';
