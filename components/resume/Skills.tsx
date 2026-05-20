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
      <h2 className="text-sm font-extrabold uppercase tracking-wider text-text-dark mb-2.5 border-b border-divider pb-1">
        Skills
      </h2>
      <div className="space-y-2">
        {items.map((skill) => (
          <div key={skill.id}>
            <h3 className="text-[11px] font-bold text-text-dark">
              {skill.name}
            </h3>
            <p className="text-[10px] text-text-light leading-relaxed">
              {skill.keywords.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
});

Skills.displayName = 'Skills';
