import React from 'react';
import { normalizePlainText, splitPlainTextToBullets } from '@/lib/textUtils';

const getLinkedinSlug = (url: string) => {
  if (!url) return '';
  let slug = url.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  slug = slug.replace(/^linkedin\.com\/in\//i, '').replace(/^linkedin\.com\//i, '');
  return slug.split('?')[0].replace(/\/+$|\s+/g, '');
};

const getGithubSlug = (url: string) => {
  if (!url) return '';
  return url.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/^github\.com\//i, '').split('?')[0].replace(/\/+$|\s+/g, '');
};

const getWebDisplay = (url: string) => {
  if (!url) return '';
  return url.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('?')[0].replace(/\/+$|\s+/g, '');
};

const InfoChip = ({ icon, label, href }: { icon: React.ReactNode; label: string; href?: string }) => (
  href ? (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-900 transition-colors">
      {icon}
      <span>{label}</span>
    </a>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] text-slate-600">
      {icon}
      <span>{label}</span>
    </span>
  )
);

const Dot = () => <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400" />;

const getContactItems = (basics: any) => [
  basics.location && { icon: '📍', label: basics.location, href: undefined },
  basics.phone && { icon: '📞', label: basics.phone, href: `tel:${basics.phone}` },
  basics.email && { icon: '✉️', label: basics.email, href: `mailto:${basics.email}` },
  basics.linkedin && { icon: 'in', label: getLinkedinSlug(basics.linkedin), href: basics.linkedin },
  basics.github && { icon: 'GH', label: getGithubSlug(basics.github), href: basics.github },
  basics.url?.href && { icon: '🌐', label: getWebDisplay(basics.url.href), href: basics.url.href },
].filter(Boolean) as Array<{ icon: string; label: string; href?: string }>;

interface ResumeProps {
  resume: any;
}

export const VercelTemplate = React.memo(({ resume }: ResumeProps) => {
  const { basics, sections } = resume;
  const contactItems = getContactItems(basics);

  return (
    <div className="bg-white text-slate-950 font-sans" style={{ minHeight: '100%', width: '100%' }}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
          <h1 className="text-[30px] font-extrabold tracking-tight leading-none">{basics.name}</h1>
          {basics.headline && <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">{basics.headline}</p>}
          <div className="flex flex-wrap gap-2 text-[10px] text-slate-600">
            {contactItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <Dot />}
                <InfoChip icon={item.icon} label={item.label} href={item.href} />
              </React.Fragment>
            ))}
          </div>
        </div>

        {sections.summary?.content && (() => {
          const summaryText = normalizePlainText(sections.summary.content);
          const summaryBullets = splitPlainTextToBullets(sections.summary.content);
          return (
            <section className="space-y-2">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Summary</div>
              {summaryBullets.length > 1 ? (
                <ul className="text-[10.5px] text-slate-700 leading-6 list-disc pl-4 space-y-1">
                  {summaryBullets.map((line, idx) => <li key={idx}>{line}</li>)}
                </ul>
              ) : (
                <p className="text-[10.5px] leading-6 text-slate-700">{summaryText}</p>
              )}
            </section>
          );
        })()}

        <div className="grid gap-4">
          {sections.experience?.items?.length > 0 && (
            <section className="space-y-3">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Experience</div>
              <div className="space-y-4">
                {sections.experience.items.map((item: any) => {
                  const summaryText = normalizePlainText(item.summary || '');
                  const summaryBullets = splitPlainTextToBullets(item.summary || '');
                  return (
                    <div key={item.id} className="space-y-1">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <div className="text-[11.5px] font-semibold text-slate-950">{item.title} @ {item.company}</div>
                          <div className="text-[10px] text-slate-500">{item.location || ''}</div>
                        </div>
                        <div className="text-[10px] font-semibold text-slate-600 whitespace-nowrap">{item.startDate} – {item.endDate}</div>
                      </div>
                      {item.summary && (
                        summaryBullets.length > 1 ? (
                          <ul className="text-[10.5px] text-slate-700 leading-6 list-disc pl-4 space-y-1">
                            {summaryBullets.map((line: string, idx: number) => <li key={idx}>{line}</li>)}
                          </ul>
                        ) : (
                          <p className="text-[10.5px] text-slate-700 leading-6">{summaryText}</p>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {sections.projects?.items?.length > 0 && (
            <section className="space-y-2">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Projects</div>
              <div className="space-y-3">
                {sections.projects.items.map((proj: any) => {
                  const descriptionText = normalizePlainText(proj.description || '');
                  const descriptionBullets = splitPlainTextToBullets(proj.description || '');
                  return (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline gap-3">
                        <div className="text-[11.5px] font-semibold text-slate-950">{proj.name}</div>
                        {proj.date && <div className="text-[10px] text-slate-600">{proj.date}</div>}
                      </div>
                      {proj.description && (
                        descriptionBullets.length > 1 ? (
                          <ul className="text-[10.5px] text-slate-700 leading-6 list-disc pl-4 space-y-1">
                            {descriptionBullets.map((line: string, idx: number) => <li key={idx}>{line}</li>)}
                          </ul>
                        ) : (
                          <p className="text-[10.5px] text-slate-700 leading-6">{descriptionText}</p>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {sections.skills?.items?.length > 0 && (
            <section className="space-y-2">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Skills</div>
              <div className="text-[10.5px] leading-6 text-slate-700 space-y-1">
                {sections.skills.items.map((skill: any) => (
                  <div key={skill.id}><span className="font-semibold text-slate-950">{skill.name}:</span> {skill.keywords.join(', ')}</div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
});

VercelTemplate.displayName = 'VercelTemplate';
