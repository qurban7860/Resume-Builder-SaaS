import React from 'react';

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

        {sections.summary?.content && (
          <section className="space-y-2">
            <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Summary</div>
            <p className="text-[10.5px] leading-6 text-slate-700">{sections.summary.content}</p>
          </section>
        )}

        <div className="grid gap-4">
          {sections.experience?.items?.length > 0 && (
            <section className="space-y-3">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Experience</div>
              <div className="space-y-4">
                {sections.experience.items.map((item: any) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <div className="text-[11.5px] font-semibold text-slate-950">{item.title} @ {item.company}</div>
                        <div className="text-[10px] text-slate-500">{item.location || ''}</div>
                      </div>
                      <div className="text-[10px] font-semibold text-slate-600 whitespace-nowrap">{item.startDate} – {item.endDate}</div>
                    </div>
                    {item.summary && <div className="text-[10.5px] text-slate-700 leading-6" dangerouslySetInnerHTML={{ __html: item.summary }} />}
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.projects?.items?.length > 0 && (
            <section className="space-y-2">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Projects</div>
              <div className="space-y-3">
                {sections.projects.items.map((proj: any) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline gap-3">
                      <div className="text-[11.5px] font-semibold text-slate-950">{proj.name}</div>
                      {proj.date && <div className="text-[10px] text-slate-600">{proj.date}</div>}
                    </div>
                    {proj.description && <p className="text-[10.5px] text-slate-700 leading-6">{proj.description}</p>}
                  </div>
                ))}
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

export const LinearTemplate = React.memo(({ resume }: ResumeProps) => {
  const { basics, sections } = resume;
  const contactItems = getContactItems(basics);

  return (
    <div className="bg-white text-slate-950 font-sans" style={{ minHeight: '100%', width: '100%' }}>
      <div className="border-t-4 border-violet-500 pt-4 pr-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap justify-between gap-3">
            <div>
              <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">{basics.name}</h1>
              {basics.headline && <p className="text-[11px] uppercase tracking-[0.28em] text-violet-600">{basics.headline}</p>}
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] text-slate-600">
              {contactItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  <InfoChip icon={item.icon} label={item.label} href={item.href} />
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_0.9fr]">
            <div className="space-y-4">
              {sections.summary?.content && (
                <section className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-violet-500 font-semibold">Summary</div>
                  <p className="text-[10.5px] text-slate-700 leading-6 mt-2">{sections.summary.content}</p>
                </section>
              )}

              {sections.skills?.items?.length > 0 && (
                <section className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-violet-500 font-semibold">Skills</div>
                  <div className="mt-2 space-y-1 text-[10.5px] text-slate-700">
                    {sections.skills.items.map((skill: any) => (
                      <div key={skill.id}><span className="font-semibold text-slate-950">{skill.name}:</span> {skill.keywords.join(', ')}</div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-4">
              {sections.experience?.items?.length > 0 && (
                <section className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-violet-500 font-semibold">Experience</div>
                  <div className="mt-3 space-y-4">
                    {sections.experience.items.map((item: any) => (
                      <div key={item.id}>
                        <div className="flex justify-between items-start gap-3">
                          <div className="text-[11px] font-semibold text-slate-950">{item.title}</div>
                          <span className="text-[10px] text-slate-600 whitespace-nowrap">{item.startDate} – {item.endDate}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-1">{item.company}{item.location ? ` · ${item.location}` : ''}</p>
                        {item.summary && <div className="mt-2 text-[10.5px] text-slate-700 leading-6" dangerouslySetInnerHTML={{ __html: item.summary }} />}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const StripeTemplate = React.memo(({ resume }: ResumeProps) => {
  const { basics, sections } = resume;
  const contactItems = getContactItems(basics);

  return (
    <div className="bg-white text-slate-950 font-sans" style={{ minHeight: '100%', width: '100%' }}>
      <div className="grid gap-4 lg:grid-cols-[0.95fr_0.85fr]">
        <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-5 space-y-4">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight">{basics.name}</h1>
            {basics.headline && <p className="text-[10.5px] uppercase tracking-[0.28em] text-slate-600 mt-2">{basics.headline}</p>}
          </div>
          <div className="space-y-2 text-[10px] text-slate-700">
            {contactItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-slate-400">•</span>
                <InfoChip icon={item.icon} label={item.label} href={item.href} />
              </div>
            ))}
          </div>
          {sections.skills?.items?.length > 0 && (
            <div className="rounded-2xl bg-white p-4">
              <div className="text-[10px] uppercase tracking-[0.28em] text-sky-600 font-semibold mb-2">Skills</div>
              <div className="space-y-1 text-[10.5px] text-slate-700">
                {sections.skills.items.map((skill: any) => (
                  <div key={skill.id}><span className="font-semibold text-slate-900">{skill.name}:</span> {skill.keywords.join(', ')}</div>
                ))}
              </div>
            </div>
          )}
          {sections.education?.items?.length > 0 && (
            <div className="rounded-2xl bg-white p-4">
              <div className="text-[10px] uppercase tracking-[0.28em] text-sky-600 font-semibold mb-2">Education</div>
              <div className="space-y-3 text-[10.5px] text-slate-700 leading-6">
                {sections.education.items.map((item: any) => (
                  <div key={item.id}>
                    <div className="font-semibold text-slate-950">{item.institution}</div>
                    <div>{item.studyType}</div>
                    <div className="text-slate-500">{item.startDate} – {item.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
        <main className="space-y-4 p-5 rounded-3xl border border-slate-200 bg-white">
          {sections.summary?.content && (
            <section>
              <div className="text-[10px] uppercase tracking-[0.28em] text-sky-600 font-semibold mb-2">Summary</div>
              <p className="text-[10.5px] text-slate-700 leading-6">{sections.summary.content}</p>
            </section>
          )}
          {sections.experience?.items?.length > 0 && (
            <section className="space-y-4">
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-900 font-semibold">Experience</div>
              {sections.experience.items.map((item: any) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between gap-3 items-start">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-950">{item.title}</div>
                      <div className="text-[10px] text-slate-500">{item.company}</div>
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.startDate} – {item.endDate}</span>
                  </div>
                  {item.summary && <div className="text-[10.5px] text-slate-700 leading-6" dangerouslySetInnerHTML={{ __html: item.summary }} />}
                </div>
              ))}
            </section>
          )}
          {sections.projects?.items?.length > 0 && (
            <section>
              <div className="text-[10px] uppercase tracking-[0.28em] text-sky-600 font-semibold mb-2">Projects</div>
              <div className="space-y-4">
                {sections.projects.items.map((proj: any) => (
                  <div key={proj.id}>
                    <div className="text-[11px] font-semibold text-slate-950">{proj.name}</div>
                    {proj.description && <p className="text-[10.5px] text-slate-700 leading-6 mt-1">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
});

export const NotionTemplate = React.memo(({ resume }: ResumeProps) => {
  const { basics, sections } = resume;
  const contactItems = getContactItems(basics);

  return (
    <div className="bg-white text-slate-950 font-sans" style={{ minHeight: '100%', width: '100%' }}>
      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-[26px] font-bold tracking-tight">{basics.name}</h1>
              {basics.headline && <span className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{basics.headline}</span>}
            </div>
            <div className="grid gap-2 sm:grid-cols-2 text-[10px] text-slate-600">
              {contactItems.map((item, idx) => (
                <InfoChip key={idx} icon={item.icon} label={item.label} href={item.href} />
              ))}
            </div>
          </div>
        </div>

        {sections.summary?.content && (
          <section className="rounded-3xl border border-slate-200 p-5 bg-white">
            <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500 font-semibold mb-2">Summary</div>
            <p className="text-[10.5px] text-slate-700 leading-6">{sections.summary.content}</p>
          </section>
        )}

        <div className="space-y-4">
          {sections.experience?.items?.length > 0 && (
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500 font-semibold mb-3">Experience</div>
              <div className="space-y-4">
                {sections.experience.items.map((item: any) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-semibold text-slate-950">{item.title}</div>
                        <div className="text-[10px] text-slate-600">{item.company}</div>
                      </div>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.startDate} – {item.endDate}</span>
                    </div>
                    {item.summary && <div className="text-[10.5px] text-slate-700 leading-6" dangerouslySetInnerHTML={{ __html: item.summary }} />}
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.projects?.items?.length > 0 && (
            <section className="rounded-3xl border border-slate-200 p-5 bg-white">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500 font-semibold mb-3">Projects</div>
              <div className="space-y-3">
                {sections.projects.items.map((proj: any) => (
                  <div key={proj.id}>
                    <div className="text-[11px] font-semibold text-slate-950">{proj.name}</div>
                    {proj.description && <p className="text-[10.5px] text-slate-700 leading-6 mt-1">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.skills?.items?.length > 0 && (
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500 font-semibold mb-2">Skills</div>
              <div className="space-y-1 text-[10.5px] text-slate-700">
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
LinearTemplate.displayName = 'LinearTemplate';
StripeTemplate.displayName = 'StripeTemplate';
NotionTemplate.displayName = 'NotionTemplate';
