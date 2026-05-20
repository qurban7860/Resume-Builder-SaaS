import React from 'react';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  companyUrl?: string;
  startDate: string;
  endDate: string;
  summary?: string;
}

interface ExperienceCardProps {
  item: ExperienceItem;
}

export const ExperienceCard = React.memo(({ item }: ExperienceCardProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline">
        <div>
          <h3 className="text-[13px] font-bold text-text-dark leading-tight">{item.title}</h3>
          <p className="text-body text-text-light font-medium">
            {item.companyUrl ? (
              <a 
                href={item.companyUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline hover:text-blue-600 inline-flex items-center gap-0.5"
              >
                {item.company}
                <svg className="w-2.5 h-2.5 inline stroke-current" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            ) : (
              item.company
            )}
          </p>
        </div>
        <p className="text-[10px] text-text-light font-medium whitespace-nowrap">
          {item.startDate} - {item.endDate}
        </p>
      </div>

      {item.summary && (
        <div
          className="text-body text-text-dark mt-1.5 space-y-1 list-disc-bullets"
          dangerouslySetInnerHTML={{ __html: item.summary }}
        />
      )}
    </div>
  );
});

ExperienceCard.displayName = 'ExperienceCard';

interface ExperienceProps {
  items: ExperienceItem[];
}

export const Experience = React.memo(({ items }: ExperienceProps) => {
  if (items.length === 0) return null;

  return (
    <section className="mb-4">
      <h2 className="text-sm font-extrabold uppercase tracking-wider text-text-dark mb-2.5 border-b border-divider pb-1">
        Experience
      </h2>
      <div className="space-y-3">
        {items.map((item) => (
          <ExperienceCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
});

Experience.displayName = 'Experience';
