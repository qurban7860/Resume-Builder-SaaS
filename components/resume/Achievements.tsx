import React from 'react';

interface AchievementItem {
  id: string;
  title: string;
  subtitle?: string;
  startDate: string;
  endDate?: string;
}

interface AchievementsProps {
  items: AchievementItem[];
}

export const Achievements = React.memo(({ items }: AchievementsProps) => {
  if (items.length === 0) return null;

  return (
    <section className="mb-4">
      <h2 className="text-[13px] font-bold uppercase tracking-wider text-gray-950 mb-2 border-b border-gray-900 pb-0.5">
        Achievements
      </h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="text-[12px]">
            <div className="flex justify-between items-baseline">
              <div className="text-[12.5px] text-gray-950 leading-tight">
                <span className="font-bold">{item.title}</span>
                {item.subtitle && (
                  <>
                    <span className="text-gray-400 mx-1.5">|</span>
                    <span className="font-medium text-gray-800">{item.subtitle}</span>
                  </>
                )}
              </div>
              <div className="text-[11px] text-gray-600 font-bold whitespace-nowrap">
                {item.startDate}{item.endDate ? ` – ${item.endDate}` : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

Achievements.displayName = 'Achievements';
