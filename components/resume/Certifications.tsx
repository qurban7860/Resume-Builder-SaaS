import React from 'react';

interface CertificationItem {
  id: string;
  name: string;
}

interface CertificationsProps {
  items: CertificationItem[];
}

export const Certifications = React.memo(({ items }: CertificationsProps) => {
  if (items.length === 0) return null;

  return (
    <section className="mb-4">
      <h2 className="text-[13px] font-bold uppercase tracking-wider text-gray-950 mb-2 border-b border-gray-900 pb-0.5">
        Certifications
      </h2>
      <div className="space-y-1 text-[11.5px] text-gray-800">
        {items.map((cert) => (
          <div key={cert.id} className="leading-relaxed flex items-start gap-1.5">
            <span className="text-gray-400">•</span>
            <span>{cert.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
});

Certifications.displayName = 'Certifications';
