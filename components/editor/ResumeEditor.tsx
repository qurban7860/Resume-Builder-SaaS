import { useResumeStore } from '@/store/useResumeStore';

function createInputClass() {
  return 'w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200';
}

export const ResumeEditor = () => {
  const resume = useResumeStore((state) => state.resume);
  const setResume = useResumeStore((state) => state.setResume);
  const updateSection = useResumeStore((state) => state.updateSection);
  const moveSectionItem = useResumeStore((state) => state.moveSectionItem);

  const handleBasicsChange = (field: string, value: string) => {
    if (!resume) return;
    const next = {
      ...resume,
      basics: {
        ...resume.basics,
        [field]: value,
      },
    };
    setResume(next);
  };

  const handleSummaryChange = (value: string) => {
    if (!resume) return;
    updateSection('summary', { content: value });
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    if (!resume) return;
    const items = resume.sections.experience.items.map((item: any, itemIndex: number) =>
      itemIndex === index ? { ...item, [field]: value } : item
    );
    updateSection('experience', { items });
  };

  const addExperienceItem = () => {
    const newItem = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `exp-${Date.now()}`,
      title: 'New Role',
      company: 'Company Name',
      companyUrl: '',
      startDate: '',
      endDate: '',
      summary: '<ul><li>Add your accomplishment</li></ul>',
    };
    if (!resume) return;
    updateSection('experience', {
      items: [...resume.sections.experience.items, newItem],
    });
  };

  const removeExperienceItem = (index: number) => {
    if (!resume) return;
    const items = resume.sections.experience.items.filter((_: any, itemIndex: number) => itemIndex !== index);
    updateSection('experience', { items });
  };

  const handleSkillsChange = (index: number, field: 'name' | 'keywords', value: string) => {
    if (!resume) return;
    const items = resume.sections.skills.items.map((item: any, itemIndex: number) => {
      if (itemIndex !== index) return item;
      return {
        ...item,
        [field]: field === 'keywords' ? value.split(',').map((keyword) => keyword.trim()).filter(Boolean) : value,
      };
    });
    updateSection('skills', { items });
  };

  const addSkillCategory = () => {
    if (!resume) return;
    const items = [
      ...resume.sections.skills.items,
      {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `skill-${Date.now()}`,
        name: 'New Skill Group',
        keywords: ['Skill 1', 'Skill 2'],
      },
    ];
    updateSection('skills', { items });
  };

  const removeSkillCategory = (index: number) => {
    if (!resume) return;
    const items = resume.sections.skills.items.filter((_: any, itemIndex: number) => itemIndex !== index);
    updateSection('skills', { items });
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    if (!resume) return;
    const items = resume.sections.projects.items.map((item: any, itemIndex: number) =>
      itemIndex === index ? { ...item, [field]: value } : item
    );
    updateSection('projects', { items });
  };

  const addProject = () => {
    if (!resume) return;
    const items = [
      ...resume.sections.projects.items,
      {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `prj-${Date.now()}`,
        name: 'New Project',
        description: 'Add a short description.',
        projectUrl: '',
        githubUrl: '',
      },
    ];
    updateSection('projects', { items });
  };

  const removeProject = (index: number) => {
    if (!resume) return;
    const items = resume.sections.projects.items.filter((_: any, itemIndex: number) => itemIndex !== index);
    updateSection('projects', { items });
  };

  const handleEducationChange = (index: number, field: 'institution' | 'studyType' | 'startDate' | 'endDate', value: string) => {
    if (!resume) return;
    const items = resume.sections.education.items.map((item: any, itemIndex: number) =>
      itemIndex === index ? { ...item, [field]: value } : item
    );
    updateSection('education', { items });
  };

  const addEducationItem = () => {
    if (!resume) return;
    const items = [
      ...resume.sections.education.items,
      {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `edu-${Date.now()}`,
        institution: 'New Institution',
        studyType: 'Degree or Certificate',
        startDate: '',
        endDate: '',
      },
    ];
    updateSection('education', { items });
  };

  const removeEducationItem = (index: number) => {
    if (!resume) return;
    const items = resume.sections.education.items.filter((_: any, itemIndex: number) => itemIndex !== index);
    updateSection('education', { items });
  };

  const handleCertificationChange = (index: number, value: string) => {
    if (!resume) return;
    const items = resume.sections.certifications.items.map((item: any, itemIndex: number) =>
      itemIndex === index ? { ...item, name: value } : item
    );
    updateSection('certifications', { items });
  };

  const addCertificationItem = () => {
    if (!resume) return;
    const items = [
      ...resume.sections.certifications.items,
      {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `cert-${Date.now()}`,
        name: 'New Certification',
      },
    ];
    updateSection('certifications', { items });
  };

  const removeCertificationItem = (index: number) => {
    if (!resume) return;
    const items = resume.sections.certifications.items.filter((_: any, itemIndex: number) => itemIndex !== index);
    updateSection('certifications', { items });
  };

  const moveItem = (section: 'experience' | 'projects' | 'skills' | 'education' | 'certifications', index: number, direction: 'up' | 'down') => {
    if (!resume) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0) return;
    moveSectionItem(section, index, targetIndex);
  };

  if (!resume) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume Editor</h2>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              className={createInputClass()}
              value={resume.basics.name}
              onChange={(event) => handleBasicsChange('name', event.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Headline</label>
            <input
              className={createInputClass()}
              value={resume.basics.headline}
              onChange={(event) => handleBasicsChange('headline', event.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                className={createInputClass()}
                value={resume.basics.email}
                onChange={(event) => handleBasicsChange('email', event.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                className={createInputClass()}
                value={resume.basics.phone}
                onChange={(event) => handleBasicsChange('phone', event.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                className={createInputClass()}
                value={resume.basics.location}
                onChange={(event) => handleBasicsChange('location', event.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
              <input
                className={createInputClass()}
                value={resume.basics.linkedin || ''}
                onChange={(event) => handleBasicsChange('linkedin', event.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
              <input
                className={createInputClass()}
                value={resume.basics.github || ''}
                onChange={(event) => handleBasicsChange('github', event.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Website URL</label>
            <input
              className={createInputClass()}
              value={resume.basics.url?.href || ''}
              onChange={(event) => {
                if (!resume) return;
                setResume({
                  ...resume,
                  basics: {
                    ...resume.basics,
                    url: { href: event.target.value }
                  }
                });
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Summary</label>
            <textarea
              className="w-full min-h-[120px] rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={resume.sections.summary.content}
              onChange={(event) => handleSummaryChange(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={addExperienceItem}
          >
            Add Experience
          </button>
        </div>

        <div className="space-y-4">
          {resume.sections.experience.items.map((item: any, index: number) => (
            <div key={item.id} className="rounded-xl border border-gray-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-gray-900">Experience #{index + 1}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => moveItem('experience', index, 'up')}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => moveItem('experience', index, 'down')}
                    disabled={index === resume.sections.experience.items.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:text-red-800"
                    onClick={() => removeExperienceItem(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    className={createInputClass()}
                    value={item.title}
                    onChange={(event) => handleExperienceChange(index, 'title', event.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      className={createInputClass()}
                      value={item.company}
                      onChange={(event) => handleExperienceChange(index, 'company', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company URL</label>
                    <input
                      className={createInputClass()}
                      value={item.companyUrl || ''}
                      onChange={(event) => handleExperienceChange(index, 'companyUrl', event.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      className={createInputClass()}
                      value={item.startDate}
                      onChange={(event) => handleExperienceChange(index, 'startDate', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      className={createInputClass()}
                      value={item.endDate}
                      onChange={(event) => handleExperienceChange(index, 'endDate', event.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Summary HTML</label>
                  <textarea
                    className="w-full min-h-[100px] rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={item.summary}
                    onChange={(event) => handleExperienceChange(index, 'summary', event.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Use simple HTML list markup like <code>&lt;ul&gt;&lt;li&gt;...&lt;/li&gt;&lt;/ul&gt;</code></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={addSkillCategory}
          >
            Add Skill Group
          </button>
        </div>

        <div className="space-y-4">
          {resume.sections.skills.items.map((item: any, index: number) => (
            <div key={item.id} className="rounded-xl border border-gray-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <p className="font-semibold text-gray-900">Category #{index + 1}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => moveItem('skills', index, 'up')}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => moveItem('skills', index, 'down')}
                    disabled={index === resume.sections.skills.items.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    className="text-sm text-red-600 hover:text-red-800"
                    onClick={() => removeSkillCategory(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    className={createInputClass()}
                    value={item.name}
                    onChange={(event) => handleSkillsChange(index, 'name', event.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Keywords</label>
                  <input
                    className={createInputClass()}
                    value={(item.keywords || []).join(', ')}
                    onChange={(event) => handleSkillsChange(index, 'keywords', event.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate keywords with commas.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={addProject}
          >
            Add Project
          </button>
        </div>

        <div className="space-y-4">
          {resume.sections.projects.items.map((item: any, index: number) => (
            <div key={item.id} className="rounded-xl border border-gray-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <p className="font-semibold text-gray-900">Project #{index + 1}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => moveItem('projects', index, 'up')}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => moveItem('projects', index, 'down')}
                    disabled={index === resume.sections.projects.items.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    className="text-sm text-red-600 hover:text-red-800"
                    onClick={() => removeProject(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Name</label>
                  <input
                    className={createInputClass()}
                    value={item.name}
                    onChange={(event) => handleProjectChange(index, 'name', event.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Demo URL (Live Site)</label>
                    <input
                      className={createInputClass()}
                      value={item.projectUrl || ''}
                      onChange={(event) => handleProjectChange(index, 'projectUrl', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Code URL (GitHub Repo)</label>
                    <input
                      className={createInputClass()}
                      value={item.githubUrl || ''}
                      onChange={(event) => handleProjectChange(index, 'githubUrl', event.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="w-full min-h-[100px] rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={item.description}
                    onChange={(event) => handleProjectChange(index, 'description', event.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Education</h2>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={addEducationItem}
          >
            Add Education
          </button>
        </div>

        <div className="space-y-4">
          {resume.sections.education.items.map((item: any, index: number) => (
            <div key={item.id} className="rounded-xl border border-gray-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <p className="font-semibold text-gray-900">Education #{index + 1}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => moveItem('education', index, 'up')}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => moveItem('education', index, 'down')}
                    disabled={index === resume.sections.education.items.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    className="text-sm text-red-600 hover:text-red-800"
                    onClick={() => removeEducationItem(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Institution</label>
                  <input
                    className={createInputClass()}
                    value={item.institution}
                    onChange={(event) => handleEducationChange(index, 'institution', event.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Degree/Program</label>
                  <input
                    className={createInputClass()}
                    value={item.studyType}
                    onChange={(event) => handleEducationChange(index, 'studyType', event.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      className={createInputClass()}
                      value={item.startDate}
                      onChange={(event) => handleEducationChange(index, 'startDate', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      className={createInputClass()}
                      value={item.endDate}
                      onChange={(event) => handleEducationChange(index, 'endDate', event.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Certifications</h2>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={addCertificationItem}
          >
            Add Certification
          </button>
        </div>

        <div className="space-y-4">
          {resume.sections.certifications.items.map((item: any, index: number) => (
            <div key={item.id} className="rounded-xl border border-gray-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <p className="font-semibold text-gray-900">Certification #{index + 1}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => moveItem('certifications', index, 'up')}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => moveItem('certifications', index, 'down')}
                    disabled={index === resume.sections.certifications.items.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    className="text-sm text-red-600 hover:text-red-800"
                    onClick={() => removeCertificationItem(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Certification Name</label>
                <input
                  className={createInputClass()}
                  value={item.name}
                  onChange={(event) => handleCertificationChange(index, event.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
