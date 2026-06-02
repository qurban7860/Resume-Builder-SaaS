import React from 'react';
import { sanitizeRichText } from '@/lib/textUtils';

// ─── Shared helpers ─────────────────────────────────────────────────────────
const getLinkedinSlug = (url: string) => {
  if (!url) return '';
  let c = url.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  c = c.replace(/^linkedin\.com\/in\//i, '').replace(/^linkedin\.com\//i, '');
  return c.split('?')[0].replace(/\/+$/, '');
};
const getGithubSlug = (url: string) => {
  if (!url) return '';
  let c = url.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  return c.replace(/^github\.com\//i, '').split('?')[0].replace(/\/+$/, '');
};
const getWebDisplay = (url: string) => {
  if (!url) return '';
  return url.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('?')[0].replace(/\/+$/, '');
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const sz = 'w-[10px] h-[10px] inline-block mr-[3px] flex-shrink-0';
const LocationIcon = () => <svg className={`${sz} fill-none stroke-current`} strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const PhoneIcon    = () => <svg className={`${sz} fill-none stroke-current`} strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const EmailIcon    = () => <svg className={`${sz} fill-none stroke-current`} strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const LinkedinIcon = () => <svg className={`${sz} fill-current`} viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
const GithubIcon   = () => <svg className={`${sz} fill-current`} viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
const WebsiteIcon  = () => <svg className={`${sz} fill-none stroke-current`} strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const LinkIcon     = () => <svg className="w-[9px] h-[9px] fill-none stroke-current text-blue-600 inline ml-0.5" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

// ─── Section Title ────────────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[12px] font-bold uppercase tracking-wider text-gray-950 mb-1 border-b border-gray-950 pb-0.5 font-serif leading-none">
    {children}
  </h2>
);

const renderHtml = (value: string, className: string) => (
  <div
    className={`${className} [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mt-1`}
    dangerouslySetInnerHTML={{ __html: sanitizeRichText(value) }}
  />
);

// ─── Classic Template ─────────────────────────────────────────────────────────
interface Resume {
  basics: { name: string; headline?: string; email: string; phone: string; location: string; url?: { href: string }; linkedin?: string; github?: string };
  sections: {
    summary?: { content: string };
    experience: { items: any[] };
    education: { items: any[] };
    projects: { items: any[] };
    skills: { items: any[] };
    certifications?: { items: any[] };
    achievements?: { items: any[] };
    relevantCoursework?: { items: any[] };
  };
}

export const ClassicTemplate = React.memo(({ resume }: { resume: Resume }) => {
  const { basics, sections } = resume;
  const courseNames = sections.relevantCoursework?.items?.map((i: any) => i.name).join(', ') || '';

  const contactItems = [
    basics.location && { icon: <LocationIcon />, label: basics.location, href: undefined },
    basics.phone    && { icon: <PhoneIcon />,    label: basics.phone,    href: `tel:${basics.phone}` },
    basics.email    && { icon: <EmailIcon />,    label: basics.email,    href: `mailto:${basics.email}` },
    basics.linkedin && { icon: <LinkedinIcon />, label: getLinkedinSlug(basics.linkedin), href: basics.linkedin },
    basics.github   && { icon: <GithubIcon />,   label: getGithubSlug(basics.github),    href: basics.github },
    basics.url?.href && { icon: <WebsiteIcon />, label: (basics.url as any)?.label || getWebDisplay(basics.url.href),  href: basics.url.href },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; href?: string }[];

  return (
    <div className="bg-white font-serif text-gray-950" style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>
      {/* Header */}
      <header className="text-center mb-2.5">
        <h1 className="text-[25px] font-bold tracking-wide leading-tight mb-0.5">{basics.name}</h1>
        {basics.headline && (
          <div className="text-[11.5px] font-semibold uppercase tracking-wider text-gray-600 mb-1.5">{basics.headline}</div>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5 text-[10px] text-gray-900">
          {contactItems.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-gray-400 select-none">|</span>}
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-blue-600 transition-colors">
                  {item.icon}<span>{item.label}</span>
                </a>
              ) : (
                <span className="inline-flex items-center">{item.icon}<span>{item.label}</span></span>
              )}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Summary */}
      {sections.summary?.content && (
        <section className="mb-2">
          <SectionTitle>Summary</SectionTitle>
          {renderHtml(sections.summary.content, 'text-[10.5px] text-gray-800 leading-[1.45]')}
        </section>
      )}

      {/* Education */}
      {sections.education.items.length > 0 && (
        <section className="mb-2">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-1.5">
            {sections.education.items.map((item: any, idx: number) => {
              const courseText = item.coursework || (idx === 0 ? courseNames : '');
              return (
                <div key={item.id} className="break-inside-avoid mb-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11.5px] font-bold text-gray-950">{item.institution}</span>
                    <span className="text-[11px] font-bold text-gray-950 whitespace-nowrap">{item.startDate} – {item.endDate}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] italic text-gray-700">{item.studyType}</span>
                    {item.location && <span className="text-[10.5px] italic text-gray-600">{item.location}</span>}
                  </div>
                  {courseText && (
                    <p className="text-[10px] text-gray-700 mt-0.5">
                      <span className="font-semibold text-gray-900">Coursework: </span>{courseText}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Skills */}
      {sections.skills.items.length > 0 && (
        <section className="mb-2">
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-0.5">
            {sections.skills.items.map((skill: any) => (
              <div key={skill.id} className="text-[10.5px] text-gray-800 leading-[1.4] break-inside-avoid">
                <span className="font-bold text-gray-950">{skill.name}: </span>
                <span>{skill.keywords.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {sections.experience.items.length > 0 && (
        <section className="mb-2">
          <SectionTitle>Experience</SectionTitle>
          <div className="space-y-2">
            {sections.experience.items.map((item: any) => (
              <div key={item.id} className="break-inside-avoid mb-2">
                <div className="flex justify-between items-baseline">
                  <div className="text-[11.5px] text-gray-950 leading-snug">
                    {item.companyUrl ? (
                      <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline inline-flex items-center">
                        {item.company}<LinkIcon />
                      </a>
                    ) : (
                      <span className="font-bold">{item.company}</span>
                    )}
                    {item.title && <span className="font-normal text-gray-700"> | <span className="italic">{item.title}</span></span>}
                    {item.location && <span className="font-normal text-gray-500"> | <span className="italic">{item.location}</span></span>}
                  </div>
                  <div className="text-[11px] font-bold text-gray-950 whitespace-nowrap ml-2">{item.startDate} – {item.endDate}</div>
                </div>
                {item.summary && renderHtml(item.summary, 'text-[10.5px] text-gray-800 mt-0.5 leading-[1.4]')}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {sections.projects.items.length > 0 && (
        <section className="mb-2">
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-2">
            {sections.projects.items.map((proj: any) => {
              const primaryUrl = proj.projectUrl || proj.githubUrl;
              return (
                <div key={proj.id} className="break-inside-avoid mb-2">
                  <div className="flex justify-between items-baseline">
                    <div className="text-[11.5px] text-gray-950 font-bold leading-snug">
                      {primaryUrl ? (
                        <a href={primaryUrl} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center">
                          {proj.name}<LinkIcon />
                        </a>
                      ) : <span>{proj.name}</span>}
                      {proj.technologies && <span className="font-normal text-gray-700"> | <span className="italic">{proj.technologies}</span></span>}
                    </div>
                    {proj.date && <div className="text-[11px] font-bold text-gray-950 whitespace-nowrap ml-2">{proj.date}</div>}
                  </div>
                  {proj.description && renderHtml(proj.description, 'text-[10.5px] text-gray-800 mt-0.5 leading-[1.4]')}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Certificates & Awards */}
      {((sections.achievements?.items?.length ?? 0) > 0 || (sections.certifications?.items?.length ?? 0) > 0) && (
        <section className="mb-2">
          <SectionTitle>Certificates & Awards</SectionTitle>
          <ul className="text-[10.5px] text-gray-800 list-disc pl-4 space-y-[2px] leading-[1.4]">
            {(sections.achievements?.items || []).map((ach: any) => {
              const parts = [ach.title];
              if (ach.subtitle) parts.push(ach.subtitle);
              const base = parts.join(' | ');
              let dateStr = ach.startDate ? (ach.endDate ? `${ach.startDate} – ${ach.endDate}` : ach.startDate) : '';
              return <li key={ach.id}>{base}{dateStr ? ` (${dateStr})` : ''}</li>;
            })}
            {(sections.certifications?.items || []).map((cert: any) => (
              <li key={cert.id}>{cert.name}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
});

ClassicTemplate.displayName = 'ClassicTemplate';
