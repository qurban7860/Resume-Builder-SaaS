import React from 'react';

interface CertificationItem {
  id: string;
  name: string;
}

interface AchievementItem {
  id: string;
  title: string;
  subtitle: string;
  startDate?: string;
  endDate?: string;
}

interface LeadershipAwardsProps {
  achievements: AchievementItem[];
  certifications: CertificationItem[];
}

export const LeadershipAwards = React.memo(({ achievements, certifications }: LeadershipAwardsProps) => {
  if (achievements.length === 0 && certifications.length === 0) return null;

  const getAchievementText = (ach: AchievementItem) => {
    const parts = [ach.title];
    if (ach.subtitle) parts.push(ach.subtitle);
    let dateStr = '';
    if (ach.startDate) {
      dateStr = ach.startDate;
      if (ach.endDate) dateStr += ` – ${ach.endDate}`;
    }
    const baseText = parts.join(' | ');
    return dateStr ? `${baseText} (${dateStr})` : baseText;
  };

  return (
    <section className="mb-4">
      <h2 className="text-[12px] font-bold uppercase tracking-wider text-gray-950 mb-1 border-b border-gray-950 pb-0.5 font-serif">
        Certificates & Awards
      </h2>
      <ul className="text-[10.5px] text-gray-800 list-disc pl-4 space-y-0.5 leading-[1.35] font-serif">
        {achievements.map((ach) => (
          <li key={ach.id}>{getAchievementText(ach)}</li>
        ))}
        {certifications.map((cert) => (
          <li key={cert.id}>{cert.name}</li>
        ))}
      </ul>
    </section>
  );
});

LeadershipAwards.displayName = 'LeadershipAwards';
