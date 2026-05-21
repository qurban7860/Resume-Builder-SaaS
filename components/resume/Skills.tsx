import React from 'react';

interface SkillItem {
  id: string;
  name: string;
  keywords: string[];
}

interface SkillsProps {
  items: SkillItem[];
}

export const Skills = React.memo(({ items }: SkillsProps) => {
  if (items.length === 0) return null;

  return (
    <section className="mb-4">
      <h2 className="text-[12px] font-bold uppercase tracking-wider text-gray-950 mb-1 border-b border-gray-950 pb-0.5 font-serif">
        Skills
      </h2>
      <div className="space-y-1 text-[11px] text-gray-800 font-serif leading-[1.35]">
        {items.map((skill) => (
          <div key={skill.id}>
            <span className="font-bold text-gray-950">{skill.name}: </span>
            <span>{skill.keywords.join(', ')}</span>
          </div>
        ))}
      </div>
    </section>
  );
});

Skills.displayName = 'Skills';
