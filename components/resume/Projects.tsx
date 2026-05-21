import React from 'react';

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  projectUrl?: string;
  githubUrl?: string;
  date?: string;
  technologies?: string;
}

interface ProjectsProps {
  items: ProjectItem[];
}

export const Projects = React.memo(({ items }: ProjectsProps) => {
  if (items.length === 0) return null;

  return (
    <section className="mb-4">
      <h2 className="text-[12px] font-bold uppercase tracking-wider text-gray-950 mb-1 border-b border-gray-950 pb-0.5 font-serif">
        Projects
      </h2>
      <div className="space-y-3 font-serif">
        {items.map((project) => {
          const isHtml = project.description.includes('<li') || project.description.includes('<ul');
          const sentences = isHtml 
            ? [] 
            : project.description
                .split(/\.(?=\s|[A-Z]|$)/)
                .map(s => s.trim())
                .filter(s => s.length > 0);

          const primaryUrl = project.projectUrl || project.githubUrl;

          return (
            <div key={project.id} className="text-[11.5px] leading-[1.4]">
              <div className="flex justify-between items-baseline">
                <div className="text-[11.5px] text-gray-950 font-bold">
                  {primaryUrl ? (
                    <a 
                      href={primaryUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>{project.name}</span>
                      <svg className="w-[9px] h-[9px] text-blue-600 fill-none stroke-current inline-block" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  ) : (
                    <span>{project.name}</span>
                  )}
                  {project.technologies && (
                    <span className="font-normal text-gray-800">
                      {' | '}
                      <span className="italic">{project.technologies}</span>
                    </span>
                  )}
                </div>
                {project.date && (
                  <div className="text-[11px] text-gray-950 font-bold whitespace-nowrap">
                    {project.date}
                  </div>
                )}
              </div>

              {isHtml ? (
                <div
                  className="text-[10.5px] text-gray-800 mt-1 space-y-0.5 leading-[1.35] [&_ul]:list-disc [&_ul]:pl-4 [&_li]:list-item"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              ) : (
                <ul className="text-[10.5px] text-gray-800 mt-1 list-disc pl-4 space-y-0.5 leading-[1.35]">
                  {sentences.map((sentence, idx) => (
                    <li key={idx}>{sentence}.</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
});

Projects.displayName = 'Projects';
