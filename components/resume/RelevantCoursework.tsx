import React from 'react';

interface CourseworkItem {
  id: string;
  name: string;
}

interface RelevantCourseworkProps {
  items: CourseworkItem[];
}

export const RelevantCoursework = React.memo(({ items }: RelevantCourseworkProps) => {
  if (items.length === 0) return null;

  return (
    <section className="mb-4">
      <h2 className="text-[13px] font-bold uppercase tracking-wider text-gray-950 mb-2 border-b border-gray-900 pb-0.5">
        Relevant Coursework
      </h2>
      <div className="text-[11.5px] text-gray-800 leading-relaxed">
        {items.map(item => item.name).join(', ')}
      </div>
    </section>
  );
});

RelevantCoursework.displayName = 'RelevantCoursework';
