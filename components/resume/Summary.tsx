import React from 'react';

interface SummaryProps {
  content: string;
}

export const Summary = React.memo(({ content }: SummaryProps) => {
  if (!content) return null;

  return (
    <section className="mb-6">
      <p className="text-body text-text-dark leading-relaxed">{content}</p>
    </section>
  );
});

Summary.displayName = 'Summary';
