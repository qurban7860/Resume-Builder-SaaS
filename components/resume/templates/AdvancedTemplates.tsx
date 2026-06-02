import React from 'react';
import { sanitizeRichText } from '@/lib/textUtils';

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

const renderHtml = (value: string, className: string) => (
  <div
    className={`${className} [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mt-1`}
    dangerouslySetInnerHTML={{ __html: sanitizeRichText(value) }}
  />
);

const getContactItems = (basics: any) => [
  basics.location && { icon: '📍', label: basics.location, href: undefined },
  basics.phone && { icon: '📞', label: basics.phone, href: `tel:${basics.phone}` },
  basics.email && { icon: '✉️', label: basics.email, href: `mailto:${basics.email}` },
  basics.linkedin && { icon: 'in', label: getLinkedinSlug(basics.linkedin), href: basics.linkedin },
  basics.github && { icon: 'GH', label: getGithubSlug(basics.github), href: basics.github },
  basics.url?.href && { icon: '🌐', label: (basics.url as any)?.label || getWebDisplay(basics.url.href), href: basics.url.href },
].filter(Boolean) as Array<{ icon: string; label: string; href?: string }>;

interface ResumeProps {
  resume: any;
}

export const VercelTemplate = React.memo(({ resume }: ResumeProps) => {
  const { basics, sections } = resume;
  const contactItems = getContactItems(basics);

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    keyAchievements: () => (
      (sections.keyAchievements?.items?.length ?? 0) > 0 ? (
        <section className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Key Achievements</div>
          <ul className="text-[10.5px] leading-[1.45] text-slate-700 pl-4 list-disc space-y-1">
            {(sections.keyAchievements?.items || []).map((item: any) => (
              <li key={item.id} className="break-inside-avoid">{item.content}</li>
            ))}
          </ul>
        </section>
      ) : null
    ),
    experience: () => (
      sections.experience?.items?.length > 0 ? (
        <section className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Experience</div>
          <div className="space-y-2">
            {sections.experience.items.map((item: any) => (
              <div key={item.id} className="space-y-1 break-inside-avoid">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div className="text-[11.5px] font-semibold text-slate-950">{item.title} @ {item.company}</div>
                    <div className="text-[10px] text-slate-500">{item.location || ''}</div>
                  </div>
                  <div className="text-[10px] font-semibold text-slate-600 whitespace-nowrap">{item.startDate} – {item.endDate}</div>
                </div>
                {item.summary && renderHtml(item.summary, 'text-[10.5px] text-slate-700 leading-[1.45]')}
              </div>
            ))}
          </div>
        </section>
      ) : null
    ),
    projects: () => (
      sections.projects?.items?.length > 0 ? (
        <section className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Projects</div>
          <div className="space-y-2">
            {sections.projects.items.map((proj: any) => (
              <div key={proj.id} className="break-inside-avoid mb-1">
                <div className="flex justify-between items-baseline gap-3">
                  <div className="text-[11.5px] font-semibold text-slate-950">{proj.name}</div>
                  {proj.date && <div className="text-[10px] text-slate-600">{proj.date}</div>}
                </div>
                {proj.description && renderHtml(proj.description, 'text-[10.5px] text-slate-700 leading-[1.45]')}
              </div>
            ))}
          </div>
        </section>
      ) : null
    ),
    skills: () => (
      sections.skills?.items?.length > 0 ? (
        <section className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Skills</div>
          <div className="text-[10.5px] leading-[1.45] text-slate-700 space-y-1">
            {sections.skills.items.map((skill: any) => (
              <div key={skill.id} className="break-inside-avoid"><span className="font-semibold text-slate-950">{skill.name}:</span> {skill.keywords.join(', ')}</div>
            ))}
          </div>
        </section>
      ) : null
    ),
    education: () => (
      sections.education?.items?.length > 0 ? (
        <section className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Education</div>
          <div className="space-y-2">
            {sections.education.items.map((item: any) => (
              <div key={item.id} className="space-y-1 break-inside-avoid">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div className="text-[11.5px] font-semibold text-slate-950">{item.studyType} @ {item.institution}</div>
                    <div className="text-[10px] text-slate-500">{item.location || ''}</div>
                  </div>
                  <div className="text-[10px] font-semibold text-slate-600 whitespace-nowrap">{item.startDate} – {item.endDate}</div>
                </div>
                {item.coursework && <div className="text-[10px] text-slate-600">Coursework: {item.coursework}</div>}
              </div>
            ))}
          </div>
        </section>
      ) : null
    ),
    certifications: () => (
      ((sections.achievements?.items?.length ?? 0) > 0 || (sections.certifications?.items?.length ?? 0) > 0) ? (
        <section className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Certifications</div>
          <ul className="text-[10.5px] leading-[1.45] text-slate-700 pl-4 list-disc space-y-1">
            {(sections.achievements?.items || []).map((ach: any) => {
              const parts = [ach.title];
              if (ach.subtitle) parts.push(ach.subtitle);
              const base = parts.join(' | ');
              const dateStr = ach.startDate ? (ach.endDate ? `${ach.startDate} – ${ach.endDate}` : ach.startDate) : '';
              return <li key={ach.id} className="break-inside-avoid">{base}{dateStr ? ` (${dateStr})` : ''}</li>;
            })}
            {(sections.certifications?.items || []).map((cert: any) => (
              <li key={cert.id} className="break-inside-avoid">{cert.name}</li>
            ))}
          </ul>
        </section>
      ) : null
    )
  };

  return (
    <div className="bg-white text-slate-950 font-sans" style={{ minHeight: '100%', width: '100%' }}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-2">
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

        {sections.summary?.content && (
          <section className="space-y-2">
            <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Summary</div>
            {renderHtml(sections.summary.content, 'text-[10.5px] leading-[1.45] text-slate-700')}
          </section>
        )}

        <div className="grid gap-4">
          {(resume.sectionOrder || ['keyAchievements', 'experience', 'skills', 'projects', 'education', 'certifications']).map((secId: string) => {
            const renderFn = sectionRenderers[secId];
            return renderFn ? <React.Fragment key={secId}>{renderFn()}</React.Fragment> : null;
          })}
        </div>
      </div>
    </div>
  );
});

VercelTemplate.displayName = 'VercelTemplate';
