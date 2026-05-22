import React from 'react';
import { normalizePlainText, splitPlainTextToBullets } from '@/lib/textUtils';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  companyUrl?: string;
  startDate: string;
  endDate: string;
  summary?: string;
  location?: string;
}

interface ExperienceCardProps {
  item: ExperienceItem;
}

export const ExperienceCard = React.memo(({ item }: ExperienceCardProps) => {
  return (
    <div className="mb-3 font-serif">
      <div className="flex justify-between items-baseline">
        <div className="text-[11.5px] text-gray-950 font-bold leading-tight">
          {item.companyUrl ? (
            <a 
              href={item.companyUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline inline-flex items-center gap-0.5"
            >
              <span>{item.company}</span>
              <svg className="w-[9px] h-[9px] text-blue-600 fill-none stroke-current inline-block" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          ) : (
            <span>{item.company}</span>
          )}
        </div>
        <div className="text-[11px] text-gray-950 font-bold whitespace-nowrap">
          {item.startDate} – {item.endDate}
        </div>
      </div>

      <div className="flex justify-between items-baseline text-[11px] text-gray-800">
        <div className="italic font-medium">{item.title}</div>
        {item.location && <div className="italic">{item.location}</div>}
      </div>

      {item.summary && (() => {
        const summaryText = normalizePlainText(item.summary);
        const summaryBullets = splitPlainTextToBullets(item.summary);
        return summaryBullets.length > 1 ? (
          <ul className="text-[10.5px] text-gray-800 mt-1 list-disc pl-4 space-y-1 leading-[1.35]">
            {summaryBullets.map((line, idx) => <li key={idx}>{line}</li>)}
          </ul>
        ) : (
          <p className="text-[10.5px] text-gray-800 mt-1 leading-[1.35]">{summaryText}</p>
        );
      })()}
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
      <h2 className="text-[12px] font-bold uppercase tracking-wider text-gray-950 mb-1 border-b border-gray-950 pb-0.5 font-serif">
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
