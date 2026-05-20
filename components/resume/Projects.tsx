import React from 'react';

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  projectUrl?: string;
  githubUrl?: string;
}

interface ProjectsProps {
  items: ProjectItem[];
}

export const Projects = React.memo(({ items }: ProjectsProps) => {
  if (items.length === 0) return null;

  return (
    <section className="mb-4">
      <h2 className="text-sm font-extrabold uppercase tracking-wider text-text-dark mb-2.5 border-b border-divider pb-1">
        Projects
      </h2>
      <div className="space-y-3">
        {items.map((project) => (
          <div key={project.id} className="mb-2">
            <div className="flex justify-between items-baseline">
              <h3 className="text-[13px] font-bold text-text-dark">
                {project.name}
              </h3>
              
              <div className="flex gap-2 text-[10px] font-semibold text-blue-600">
                {project.projectUrl && (
                  <a 
                    href={project.projectUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:underline flex items-center gap-0.5"
                  >
                    Demo
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                )}
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:underline flex items-center gap-0.5"
                  >
                    Code
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
            <p className="text-body text-text-dark mt-1 leading-normal">
              {project.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
});

Projects.displayName = 'Projects';
