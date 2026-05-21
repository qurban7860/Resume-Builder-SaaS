import React from 'react';

interface EducationItem {
  id: string;
  institution: string;
  studyType: string;
  startDate: string;
  endDate: string;
  location?: string;
  coursework?: string;
}

interface EducationProps {
  items: EducationItem[];
  fallbackCoursework?: string;
}

export const Education = React.memo(({ items, fallbackCoursework }: EducationProps) => {
  if (items.length === 0) return null;

  return (
    <section className="mb-4">
      <h2 className="text-[12px] font-bold uppercase tracking-wider text-gray-950 mb-1 border-b border-gray-950 pb-0.5 font-serif">
        Education
      </h2>
      <div className="space-y-3 font-serif">
        {items.map((item, index) => {
          const courseText = item.coursework || (index === 0 ? fallbackCoursework : undefined);
          return (
            <div key={item.id} className="text-[11.5px] leading-[1.4]">
              <div className="flex justify-between items-baseline">
                <div className="font-bold text-gray-950">{item.institution}</div>
                <div className="text-[11px] text-gray-950 font-bold whitespace-nowrap">
                  {item.startDate} – {item.endDate}
                </div>
              </div>
              <div className="flex justify-between items-baseline text-[11px] text-gray-800">
                <div className="italic">{item.studyType}</div>
                {item.location && <div className="italic">{item.location}</div>}
              </div>
              {courseText && (
                <div className="text-[10.5px] text-gray-800 mt-0.5">
                  <span className="font-semibold text-gray-950">Coursework: </span>
                  {courseText}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
});

Education.displayName = 'Education';
