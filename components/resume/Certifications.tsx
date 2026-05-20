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
      <h2 className="text-sm font-extrabold uppercase tracking-wider text-text-dark mb-2.5 border-b border-divider pb-1">
        Certifications
      </h2>
      <div className="space-y-1">
        {items.map((cert) => (
          <p key={cert.id} className="text-[10px] text-text-dark leading-relaxed">
            • {cert.name}
          </p>
        ))}
      </div>
    </section>
  );
});

Certifications.displayName = 'Certifications';
