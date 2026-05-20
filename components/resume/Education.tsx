import React from 'react';

interface EducationItem {
  id: string;
  institution: string;
  studyType: string;
  startDate: string;
  endDate: string;
}

interface EducationProps {
  items: EducationItem[];
}

export const Education = React.memo(({ items }: EducationProps) => {
  if (items.length === 0) return null;

  return (
    <section className="mb-4">
      <h2 className="text-sm font-extrabold uppercase tracking-wider text-text-dark mb-2.5 border-b border-divider pb-1">
        Education
      </h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id}>
            <div className="flex justify-between items-baseline">
              <div>
                <h3 className="text-[11px] font-bold text-text-dark">
                  {item.studyType}
                </h3>
                <p className="text-[10px] text-text-light leading-tight">{item.institution}</p>
              </div>
              <p className="text-[9px] text-text-light font-medium whitespace-nowrap">
                {item.startDate} - {item.endDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

Education.displayName = 'Education';
