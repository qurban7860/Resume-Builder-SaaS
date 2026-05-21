import React from 'react';

interface SummaryProps {
  content: string;
}

export const Summary = React.memo(({ content }: SummaryProps) => {
  if (!content) return null;

  return (
    <section className="mb-4">
      <h2 className="text-[12px] font-bold uppercase tracking-wider text-gray-950 mb-1 border-b border-gray-950 pb-0.5 font-serif">
        Summary
      </h2>
      <p className="text-[10.5px] text-gray-800 leading-[1.35] font-serif">{content}</p>
    </section>
  );
});

Summary.displayName = 'Summary';
