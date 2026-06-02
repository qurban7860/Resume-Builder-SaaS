import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useResumeStore } from '@/store/useResumeStore';
import { normalizePlainText, sanitizeRichText } from '@/lib/textUtils';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="p-4 text-sm text-slate-500">Loading editor…</div>,
});

const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'blockquote', 'code-block'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'link',
  'blockquote',
  'code-block',
];

// ─── AI enhance helper ───────────────────────────────────────────────
async function callAiEnhance(type: 'bullet' | 'summary' | 'keywords', text: string, jobTitle?: string): Promise<string> {
  const res = await fetch('/api/ai/enhance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, text, jobTitle }),
  });
  if (!res.ok) throw new Error('AI request failed');
  const json = await res.json();
  return json.enhanced || text;
}

export const ResumeEditor = () => {
  const resume = useResumeStore((state) => state.resume);
  const setResume = useResumeStore((state) => state.setResume);
  const updateSection = useResumeStore((state) => state.updateSection);
  const moveSectionItem = useResumeStore((state) => state.moveSectionItem);
  const moveSection = useResumeStore((state) => state.moveSection);

  const [expandedSection, setExpandedSection] = useState<string | null>('basics');
  const [draggedItem, setDraggedItem] = useState<{ section: string; index: number } | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<{ section: string; index: number } | null>(null);

  // AI state
  const [aiLoading, setAiLoading] = useState<string | null>(null); // key: 'summary' | 'exp-{n}'
  const [aiDiff, setAiDiff] = useState<{ key: string; original: string; enhanced: string } | null>(null);

  const handleDragStart = (e: React.DragEvent, section: string, index: number) => {
    setDraggedItem({ section, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, section: string, index: number) => {
    e.preventDefault();
    if (draggedItem?.section === section && draggedItem?.index !== index) {
      setDragOverIndex({ section, index });
    }
  };

  const handleDrop = (e: React.DragEvent, section: string, index: number) => {
    e.preventDefault();
    if (draggedItem && draggedItem.section === section && draggedItem.index !== index) {
      moveSectionItem(section as any, draggedItem.index, index);
    }
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const normalizeTextInput = (value: string) => normalizePlainText(value);

  if (!resume) return null;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const premiumInputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:shadow-sm';
  const premiumLabelClass =
    'block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5';

  const handleBasicsChange = (field: string, value: string) => {
    if (!resume) return;
    setResume({
      ...resume,
      basics: {
        ...resume.basics,
        [field]: value,
      },
    });
  };

  const handleWebsiteLabelChange = (value: string) => {
    if (!resume) return;
    setResume({
      ...resume,
      basics: {
        ...resume.basics,
        url: {
          ...(resume.basics.url || {}),
          label: value,
        },
      },
    });
  };

  const handleSummaryChange = (value: string) => {
    if (!resume) return;
    updateSection('summary', { content: sanitizeRichText(value) });
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    if (!resume) return;
    const items = (resume.sections.experience?.items || []).map((item: any, itemIndex: number) =>
      itemIndex === index
        ? {
            ...item,
            [field]: field === 'summary' ? sanitizeRichText(value) : value,
          }
        : item
    );
    updateSection('experience', { items });
  };

  const addExperienceItem = () => {
    if (!resume) return;
    const newItem = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `exp-${Date.now()}`,
      title: 'New Role',
      company: 'Company Name',
      companyUrl: '',
      startDate: '',
      endDate: '',
      location: '',
      summary: 'Add your accomplishment',
    };
    updateSection('experience', {
      items: [...(resume.sections.experience?.items || []), newItem],
    });
    setExpandedSection('experience');
  };

  const removeExperienceItem = (index: number) => {
    if (!resume) return;
    const items = (resume.sections.experience?.items || []).filter((_: any, itemIndex: number) =>
      itemIndex !== index
    );
    updateSection('experience', { items });
  };

  const handleSkillsChange = (index: number, field: 'name' | 'keywords', value: string) => {
    if (!resume) return;
    const items = (resume.sections.skills?.items || []).map((item: any, itemIndex: number) => {
      if (itemIndex !== index) return item;
      return {
        ...item,
        [field]:
          field === 'keywords'
            ? value
                .split(',')
                .map((keyword) => keyword.trim())
                .filter(Boolean)
            : value,
      };
    });
    updateSection('skills', { items });
  };

  const addSkillCategory = () => {
    if (!resume) return;
    const items = [
      ...(resume.sections.skills?.items || []),
      {
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `skill-${Date.now()}`,
        name: 'New Skill Group',
        keywords: ['Skill 1', 'Skill 2'],
      },
    ];
    updateSection('skills', { items });
    setExpandedSection('skills');
  };

  const removeSkillCategory = (index: number) => {
    if (!resume) return;
    const items = (resume.sections.skills?.items || []).filter((_: any, itemIndex: number) =>
      itemIndex !== index
    );
    updateSection('skills', { items });
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    if (!resume) return;
    const items = (resume.sections.projects?.items || []).map((item: any, itemIndex: number) =>
      itemIndex === index
        ? { ...item, [field]: field === 'description' ? sanitizeRichText(value) : value }
        : item
    );
    updateSection('projects', { items });
  };

  const addProject = () => {
    if (!resume) return;
    const items = [
      ...(resume.sections.projects?.items || []),
      {
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `prj-${Date.now()}`,
        name: 'New Project',
        description: 'Add a short description.',
        projectUrl: '',
        githubUrl: '',
        technologies: '',
      },
    ];
    updateSection('projects', { items });
    setExpandedSection('projects');
  };

  const removeProject = (index: number) => {
    if (!resume) return;
    const items = (resume.sections.projects?.items || []).filter((_: any, itemIndex: number) =>
      itemIndex !== index
    );
    updateSection('projects', { items });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    if (!resume) return;
    const items = (resume.sections.education?.items || []).map((item: any, itemIndex: number) =>
      itemIndex === index ? { ...item, [field]: value } : item
    );
    updateSection('education', { items });
  };

  const addEducationItem = () => {
    if (!resume) return;
    const items = [
      ...(resume.sections.education?.items || []),
      {
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `edu-${Date.now()}`,
        institution: 'New Institution',
        studyType: 'Degree or Certificate',
        startDate: '',
        endDate: '',
        location: '',
        coursework: '',
      },
    ];
    updateSection('education', { items });
    setExpandedSection('education');
  };

  const removeEducationItem = (index: number) => {
    if (!resume) return;
    const items = (resume.sections.education?.items || []).filter((_: any, itemIndex: number) =>
      itemIndex !== index
    );
    updateSection('education', { items });
  };

  const handleCertificationChange = (index: number, value: string) => {
    if (!resume) return;
    const items = (resume.sections.certifications?.items || []).map((item: any, itemIndex: number) =>
      itemIndex === index ? { ...item, name: value } : item
    );
    updateSection('certifications', { items });
  };

  const addCertificationItem = () => {
    if (!resume) return;
    const items = [
      ...(resume.sections.certifications?.items || []),
      {
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `cert-${Date.now()}`,
        name: 'New Certification',
      },
    ];
    updateSection('certifications', { items });
    setExpandedSection('certifications');
  };

  const removeCertificationItem = (index: number) => {
    if (!resume) return;
    const items = (resume.sections.certifications?.items || []).filter((_: any, itemIndex: number) =>
      itemIndex !== index
    );
    updateSection('certifications', { items });
  };

  // Relevant coursework is handled inline with Education items; removed separate coursework editors.

  const addKeyAchievementItem = () => {
    if (!resume) return;
    const items = [
      ...(resume.sections.keyAchievements?.items || []),
      {
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `ka-${Date.now()}`,
        content: 'New Key Achievement',
      },
    ];
    updateSection('keyAchievements', { items });
    setExpandedSection('keyAchievements');
  };

  const handleKeyAchievementChange = (index: number, value: string) => {
    if (!resume) return;
    const items = (resume.sections.keyAchievements?.items || []).map((item: any, itemIndex: number) =>
      itemIndex === index ? { ...item, content: value } : item
    );
    updateSection('keyAchievements', { items });
  };

  const removeKeyAchievementItem = (index: number) => {
    if (!resume) return;
    const items = (resume.sections.keyAchievements?.items || []).filter((_: any, itemIndex: number) => itemIndex !== index);
    updateSection('keyAchievements', { items });
  };

  const moveItem = (
    section: 'experience' | 'projects' | 'skills' | 'education' | 'certifications' | 'keyAchievements',
    index: number,
    direction: 'up' | 'down'
  ) => {
    if (!resume) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0) return;
    moveSectionItem(section, index, targetIndex);
  };

  const renderAccordionHeader = (
    id: string,
    title: string,
    description: string,
    icon: React.ReactNode,
    badgeText: string
  ) => {
    const isExpanded = expandedSection === id;
    const isReorderable = id !== 'basics';
    const sectionOrder = resume.sectionOrder || ['keyAchievements', 'experience', 'skills', 'projects', 'education', 'certifications'];
    const idx = sectionOrder.indexOf(id);

    return (
      <div className="w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 hover:bg-slate-50/60 select-none">
        <div
          onClick={() => toggleSection(id)}
          className="flex-1 cursor-pointer flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50/70 flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-sm border border-indigo-100/40">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">{title}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isReorderable && idx !== -1 && (
            <div className="flex items-center gap-1 bg-slate-100/60 p-0.5 rounded-lg border border-slate-200/40">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (idx > 0) moveSection(idx, idx - 1);
                }}
                disabled={idx === 0}
                className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-white rounded-md transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                title="Move Section Up"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (idx < sectionOrder.length - 1) moveSection(idx, idx + 1);
                }}
                disabled={idx === sectionOrder.length - 1}
                className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-white rounded-md transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                title="Move Section Down"
              >
                ▼
              </button>
            </div>
          )}

          {badgeText && (
            <span 
              onClick={() => toggleSection(id)}
              className="cursor-pointer text-[10px] font-bold px-2.5 py-0.5 bg-slate-100/70 border border-slate-200/50 text-slate-500 rounded-full"
            >
              {badgeText}
            </span>
          )}
          <button
            type="button"
            onClick={() => toggleSection(id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"
          >
            <svg
              className={`w-4 h-4 transform transition-transform duration-300 ${
                isExpanded ? 'rotate-180 text-indigo-500' : ''
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const summaryLen = normalizePlainText(resume.sections?.summary?.content || '').length;

  
  const sectionRenderers: Record<string, () => React.ReactNode> = {
    keyAchievements: () => (
      <div className={`rounded-2xl border transition-all duration-300 ${
        expandedSection === 'keyAchievements' 
          ? 'border-indigo-200 bg-white shadow-[0_8px_30px_rgba(99,102,241,0.1)] ring-1 ring-indigo-50' 
          : 'border-slate-200/80 bg-white shadow-sm hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/50'
      }`}>
        <div className="flex items-center justify-between pr-4">
          <div className="flex-1">
            {renderAccordionHeader(
              'keyAchievements',
              'Key Achievements',
              'Crucial career milestones & highlights',
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>,
              `${(resume.sections.keyAchievements?.items || []).length} items`
            )}
          </div>
          {expandedSection === 'keyAchievements' && (
            <button
              onClick={addKeyAchievementItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add
            </button>
          )}
        </div>

        <div className={`accordion-body ${expandedSection === 'keyAchievements' ? 'open' : ''}`}>
          <div>
            <div className="border-t border-slate-100 p-5 bg-white rounded-b-2xl space-y-4">
            {(resume.sections.keyAchievements?.items || []).length === 0 ? (
              <p className="text-center py-6 text-xs font-medium text-slate-400">No key achievements added. Click 'Add' to showcase highlights.</p>
            ) : (
              <div className="space-y-4">
                {(resume.sections.keyAchievements?.items || []).map((item: any, index: number) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'keyAchievements', index)}
                    onDragOver={(e) => handleDragOver(e, 'keyAchievements', index)}
                    onDrop={(e) => handleDrop(e, 'keyAchievements', index)}
                    onDragEnd={handleDragEnd}
                    className={`rounded-xl border p-4 transition-all duration-200 ${
                      draggedItem?.section === 'keyAchievements' && draggedItem?.index === index
                        ? 'opacity-40 border-dashed border-indigo-400 bg-slate-100 scale-95'
                        : 'border-slate-100 bg-slate-50/45 hover:border-slate-200'
                    } ${
                      dragOverIndex?.section === 'keyAchievements' && dragOverIndex?.index === index
                        ? 'border-indigo-400 shadow-md ring-2 ring-indigo-100 scale-[1.01] bg-indigo-50/30'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing transition-colors"
                          title="Drag to Reorder"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                          </svg>
                        </div>
                        <p className="font-bold text-xs text-slate-700 uppercase tracking-wider">Highlight #{index + 1}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all duration-200"
                          onClick={() => moveItem('keyAchievements', index, 'up')}
                          disabled={index === 0}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all duration-200"
                          onClick={() => moveItem('keyAchievements', index, 'down')}
                          disabled={index === (resume.sections.keyAchievements?.items || []).length - 1}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 active:scale-95 transition-all duration-200"
                          onClick={() => removeKeyAchievementItem(index)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className={premiumLabelClass}>Achievement Description</label>
                      <input
                        className={premiumInputClass}
                        value={item.content}
                        placeholder="e.g. Built multiple production-grade SaaS platforms..."
                        onChange={(event) => handleKeyAchievementChange(index, event.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    ),
    experience: () => (
      <div
        className={`rounded-2xl border transition-all duration-300 ${
          expandedSection === 'experience'
            ? 'border-indigo-200 bg-white shadow-[0_8px_30px_rgba(99,102,241,0.1)] ring-1 ring-indigo-50'
            : 'border-slate-200/80 bg-white shadow-sm hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/50'
        }`}
      >
        <div className="flex items-center justify-between pr-4">
          <div className="flex-1">
            {renderAccordionHeader(
              'experience',
              'Work Experience',
              'Roles, Companies & Contributions',
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>,
              ''
          )}
          </div>
          {expandedSection === 'experience' && (
            <button
              onClick={addExperienceItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add
            </button>
          )}
        </div>

        <div className={`accordion-body ${expandedSection === 'experience' ? 'open' : ''}`}>
          <div>
            <div className="border-t border-slate-100 p-5 bg-white rounded-b-2xl space-y-4">
            {(resume.sections.experience?.items || []).length === 0 ? (
              <p className="text-center py-6 text-xs font-medium text-slate-400">No positions added. Click 'Add' above to start.</p>
            ) : (
              <div className="space-y-6">
                {(resume.sections.experience?.items || []).map((item: any, index: number) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'experience', index)}
                    onDragOver={(e) => handleDragOver(e, 'experience', index)}
                    onDrop={(e) => handleDrop(e, 'experience', index)}
                    onDragEnd={handleDragEnd}
                    className={`rounded-xl border p-4 transition-all duration-200 ${
                      draggedItem?.section === 'experience' && draggedItem?.index === index
                        ? 'opacity-40 border-dashed border-indigo-400 bg-slate-100 scale-95'
                        : 'border-slate-100 bg-slate-50/45 hover:border-slate-200'
                    } ${
                      dragOverIndex?.section === 'experience' && dragOverIndex?.index === index
                        ? 'border-indigo-400 shadow-md ring-2 ring-indigo-100 scale-[1.01] bg-indigo-50/30'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                       <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing transition-colors"
                          title="Drag to Reorder"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                          </svg>
                        </div>
                        <p className="font-bold text-xs text-slate-700 uppercase tracking-wider">Experience #{index + 1}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all duration-200"
                          onClick={() => moveItem('experience', index, 'up')}
                          disabled={index === 0}
                          title="Move Up"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all duration-200"
                          onClick={() => moveItem('experience', index, 'down')}
                          disabled={index === (resume.sections.experience?.items || []).length - 1}
                          title="Move Down"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 active:scale-95 transition-all duration-200"
                          onClick={() => removeExperienceItem(index)}
                          title="Remove Item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <label className={premiumLabelClass}>Job Title</label>
                        <input
                          className={premiumInputClass}
                          value={item.title}
                          placeholder="e.g. Senior Frontend Engineer"
                          onChange={(event) => handleExperienceChange(index, 'title', event.target.value)}
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className={premiumLabelClass}>Company Name</label>
                          <input
                            className={premiumInputClass}
                            value={item.company}
                            placeholder="e.g. Strategist Hub"
                            onChange={(event) => handleExperienceChange(index, 'company', event.target.value)}
                          />
                        </div>
                        <div>
                          <label className={premiumLabelClass}>Company URL</label>
                          <input
                            className={premiumInputClass}
                            placeholder="e.g. https://sigitechnologies.com"
                            value={item.companyUrl || ''}
                            onChange={(event) => handleExperienceChange(index, 'companyUrl', event.target.value)}
                          />
                        </div>
                        <div>
                          <label className={premiumLabelClass}>Location</label>
                          <input
                            className={premiumInputClass}
                            placeholder="e.g. Lahore, Pakistan"
                            value={item.location || ''}
                            onChange={(event) => handleExperienceChange(index, 'location', event.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className={premiumLabelClass}>Start Date</label>
                          <input
                            className={premiumInputClass}
                            placeholder="e.g. 07/2025"
                            value={item.startDate}
                            onChange={(event) => handleExperienceChange(index, 'startDate', event.target.value)}
                          />
                        </div>
                        <div>
                          <label className={premiumLabelClass}>End Date</label>
                          <input
                            className={premiumInputClass}
                            placeholder="e.g. Present or 12/2026"
                            value={item.endDate}
                            onChange={(event) => handleExperienceChange(index, 'endDate', event.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className={premiumLabelClass}>Summary (Accomplishments)</label>
                          <button
                            type="button"
                            disabled={aiLoading === `exp-${index}`}
                            onClick={async () => {
                              const rawText = normalizeTextInput(item.summary || '');
                              if (!rawText) return;
                              try {
                                setAiLoading(`exp-${index}`);
                                const enhanced = await callAiEnhance('bullet', rawText, item.title);
                                setAiDiff({ key: `exp-${index}`, original: item.summary, enhanced });
                              } catch { setAiLoading(null); }
                              finally { setAiLoading(null); }
                            }}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 text-[10px] font-bold transition-all active:scale-95 disabled:opacity-50"
                            title="AI bullet point improver"
                          >
                            {aiLoading === `exp-${index}` ? (
                              <span className="w-2.5 h-2.5 border border-violet-500 border-t-transparent rounded-full animate-spin" />
                            ) : '✨'}
                            AI Improve
                          </button>
                        </div>
                        {/* AI Diff Preview for Experience bullet */}
                        {aiDiff?.key === `exp-${index}` && (
                          <div className="mb-2 rounded-lg border border-violet-200 bg-violet-50 p-3 text-xs">
                            <p className="text-violet-700 font-bold mb-1">✨ AI Improved Bullet:</p>
                            <p className="text-slate-700 leading-relaxed">{aiDiff.enhanced}</p>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => {
                                  const cleaned = normalizeTextInput(aiDiff.enhanced);
                                  handleExperienceChange(index, 'summary', cleaned);
                                  setAiDiff(null);
                                }}
                                className="px-2.5 py-1 bg-violet-600 text-white rounded-md font-bold text-[10px] hover:bg-violet-700 transition-all"
                              >Apply</button>
                              <button
                                onClick={() => setAiDiff(null)}
                                className="px-2.5 py-1 bg-white text-slate-500 border border-slate-200 rounded-md font-bold text-[10px] hover:bg-slate-50 transition-all"
                              >Dismiss</button>
                            </div>
                          </div>
                        )}
                        <ReactQuill
                          theme="snow"
                          value={item.summary}
                          onChange={(value) => handleExperienceChange(index, 'summary', value)}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder="e.g. Achieved 30% faster load time by refactoring React components"
                          className="bg-white"
                        />
                        <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Use plain-text bullets or short lines. HTML tags are removed automatically.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    ),
    skills: () => (
      <div className={`rounded-2xl border transition-all duration-300 ${
        expandedSection === 'skills' 
          ? 'border-indigo-200 bg-white shadow-[0_8px_30px_rgba(99,102,241,0.1)] ring-1 ring-indigo-50' 
          : 'border-slate-200/80 bg-white shadow-sm hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/50'
      }`}>
        <div className="flex items-center justify-between pr-4">
          <div className="flex-1">
            {renderAccordionHeader(
              'skills',
              'Skills & Keywords',
              'Core competencies & stacks',
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>,
              `${(resume.sections.skills?.items || []).length} categories`
            )}
          </div>
          {expandedSection === 'skills' && (
            <button
              onClick={addSkillCategory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add
            </button>
          )}
        </div>

        <div className={`accordion-body ${expandedSection === 'skills' ? 'open' : ''}`}>
          <div>
            <div className="border-t border-slate-100 p-5 bg-white rounded-b-2xl space-y-4">
            {(resume.sections.skills?.items || []).length === 0 ? (
              <p className="text-center py-6 text-xs font-medium text-slate-400">No skill categories. Click 'Add' above to build a list.</p>
            ) : (
              <div className="space-y-4">
                {(resume.sections.skills?.items || []).map((item: any, index: number) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'skills', index)}
                    onDragOver={(e) => handleDragOver(e, 'skills', index)}
                    onDrop={(e) => handleDrop(e, 'skills', index)}
                    onDragEnd={handleDragEnd}
                    className={`rounded-xl border p-4 transition-all duration-200 ${
                      draggedItem?.section === 'skills' && draggedItem?.index === index
                        ? 'opacity-40 border-dashed border-indigo-400 bg-slate-100 scale-95'
                        : 'border-slate-100 bg-slate-50/45 hover:border-slate-200'
                    } ${
                      dragOverIndex?.section === 'skills' && dragOverIndex?.index === index
                        ? 'border-indigo-400 shadow-md ring-2 ring-indigo-100 scale-[1.01] bg-indigo-50/30'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing transition-colors"
                          title="Drag to Reorder"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                          </svg>
                        </div>
                        <p className="font-bold text-xs text-slate-700 uppercase tracking-wider">Group #{index + 1}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all duration-200"
                          onClick={() => moveItem('skills', index, 'up')}
                          disabled={index === 0}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all duration-200"
                          onClick={() => moveItem('skills', index, 'down')}
                          disabled={index === (resume.sections.skills?.items || []).length - 1}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 active:scale-95 transition-all duration-200"
                          onClick={() => removeSkillCategory(index)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <div>
                        <label className={premiumLabelClass}>Category Name</label>
                        <input
                          className={premiumInputClass}
                          value={item.name}
                          placeholder="e.g. Languages / Libraries"
                          onChange={(event) => handleSkillsChange(index, 'name', event.target.value)}
                        />
                      </div>
                      <div>
                        <label className={premiumLabelClass}>Keywords</label>
                        <input
                          className={premiumInputClass}
                          value={(item.keywords || []).join(', ')}
                          placeholder="e.g. React, TypeScript, Next.js"
                          onChange={(event) => handleSkillsChange(index, 'keywords', event.target.value)}
                        />
                        <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Comma separated elements are optimized automatically for ATS parsing.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    ),
    projects: () => (
      <div className={`rounded-2xl border transition-all duration-300 ${
        expandedSection === 'projects' 
          ? 'border-indigo-200 bg-white shadow-[0_8px_30px_rgba(99,102,241,0.1)] ring-1 ring-indigo-50' 
          : 'border-slate-200/80 bg-white shadow-sm hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/50'
      }`}>
        <div className="flex items-center justify-between pr-4">
          <div className="flex-1">
            {renderAccordionHeader(
              'projects',
              'Key Projects',
              'Personal & engineering works',
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>,
              `${(resume.sections.projects?.items || []).length} projects`
            )}
          </div>
          {expandedSection === 'projects' && (
            <button
              onClick={addProject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add
            </button>
          )}
        </div>

        <div className={`accordion-body ${expandedSection === 'projects' ? 'open' : ''}`}>
          <div>
            <div className="border-t border-slate-100 p-5 bg-white rounded-b-2xl space-y-4">
            {(resume.sections.projects?.items || []).length === 0 ? (
              <p className="text-center py-6 text-xs font-medium text-slate-400">No projects added. Click 'Add' to showcase your projects.</p>
            ) : (
              <div className="space-y-6">
                {(resume.sections.projects?.items || []).map((item: any, index: number) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'projects', index)}
                    onDragOver={(e) => handleDragOver(e, 'projects', index)}
                    onDrop={(e) => handleDrop(e, 'projects', index)}
                    onDragEnd={handleDragEnd}
                    className={`rounded-xl border p-4 transition-all duration-200 ${
                      draggedItem?.section === 'projects' && draggedItem?.index === index
                        ? 'opacity-40 border-dashed border-indigo-400 bg-slate-100 scale-95'
                        : 'border-slate-100 bg-slate-50/45 hover:border-slate-200'
                    } ${
                      dragOverIndex?.section === 'projects' && dragOverIndex?.index === index
                        ? 'border-indigo-400 shadow-md ring-2 ring-indigo-100 scale-[1.01] bg-indigo-50/30'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing transition-colors"
                          title="Drag to Reorder"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                          </svg>
                        </div>
                        <p className="font-bold text-xs text-slate-700 uppercase tracking-wider">Project #{index + 1}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all duration-200"
                          onClick={() => moveItem('projects', index, 'up')}
                          disabled={index === 0}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all duration-200"
                          onClick={() => moveItem('projects', index, 'down')}
                          disabled={index === (resume.sections.projects?.items || []).length - 1}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 active:scale-95 transition-all duration-200"
                          onClick={() => removeProject(index)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className={premiumLabelClass}>Project Name</label>
                          <input
                            className={premiumInputClass}
                            value={item.name}
                            placeholder="e.g. Howick Customer Portal"
                            onChange={(event) => handleProjectChange(index, 'name', event.target.value)}
                          />
                        </div>
                        <div>
                          <label className={premiumLabelClass}>Technologies (e.g. React, Next.js)</label>
                          <input
                            className={premiumInputClass}
                            value={item.technologies || ''}
                            placeholder="e.g. Next.js, TypeScript, Tailind"
                            onChange={(event) => handleProjectChange(index, 'technologies', event.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className={premiumLabelClass}>Demo URL (Live Site)</label>
                          <input
                            className={premiumInputClass}
                            value={item.projectUrl || ''}
                            placeholder="e.g. https://howick-portal.com"
                            onChange={(event) => handleProjectChange(index, 'projectUrl', event.target.value)}
                          />
                        </div>
                        <div>
                          <label className={premiumLabelClass}>Code URL (GitHub Repo)</label>
                          <input
                            className={premiumInputClass}
                            value={item.githubUrl || ''}
                            placeholder="e.g. https://github.com/qurban7860/portal"
                            onChange={(event) => handleProjectChange(index, 'githubUrl', event.target.value)}
                          />
                        </div>
                        <div>
                          <label className={premiumLabelClass}>Date (e.g. 04/2025)</label>
                          <input
                            className={premiumInputClass}
                            value={item.date || ''}
                            placeholder="e.g. 04/2025"
                            onChange={(event) => handleProjectChange(index, 'date', event.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className={premiumLabelClass}>Description (HTML supported)</label>
                          <span className={`text-[10px] font-bold ${
                            item.description.length < 40 ? 'text-amber-500' : 'text-green-500'
                          }`}>
                            {item.description.length}/40+ chars
                          </span>
                        </div>
                        <ReactQuill
                          theme="snow"
                          value={item.description}
                          onChange={(value) => handleProjectChange(index, 'description', value)}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder="Provide details about your project accomplishments..."
                          className="bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    ),
    education: () => (
      <div className={`rounded-2xl border transition-all duration-300 ${
        expandedSection === 'education' 
          ? 'border-indigo-200 bg-white shadow-[0_8px_30px_rgba(99,102,241,0.1)] ring-1 ring-indigo-50' 
          : 'border-slate-200/80 bg-white shadow-sm hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/50'
      }`}>
        <div className="flex items-center justify-between pr-4">
          <div className="flex-1">
            {renderAccordionHeader(
              'education',
              'Education',
              'Degrees, universities & coursework',
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
              </svg>,
              `${(resume.sections.education?.items || []).length} records`
            )}
          </div>
          {expandedSection === 'education' && (
            <button
              onClick={addEducationItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add
            </button>
          )}
        </div>

        <div className={`accordion-body ${expandedSection === 'education' ? 'open' : ''}`}>
          <div>
            <div className="border-t border-slate-100 p-5 bg-white rounded-b-2xl space-y-4">
            {(resume.sections.education?.items || []).length === 0 ? (
              <p className="text-center py-6 text-xs font-medium text-slate-400">No education entries. Click 'Add' to specify degrees.</p>
            ) : (
              <div className="space-y-6">
                {(resume.sections.education?.items || []).map((item: any, index: number) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'education', index)}
                    onDragOver={(e) => handleDragOver(e, 'education', index)}
                    onDrop={(e) => handleDrop(e, 'education', index)}
                    onDragEnd={handleDragEnd}
                    className={`rounded-xl border p-4 transition-all duration-200 ${
                      draggedItem?.section === 'education' && draggedItem?.index === index
                        ? 'opacity-40 border-dashed border-indigo-400 bg-slate-100 scale-95'
                        : 'border-slate-100 bg-slate-50/45 hover:border-slate-200'
                    } ${
                      dragOverIndex?.section === 'education' && dragOverIndex?.index === index
                        ? 'border-indigo-400 shadow-md ring-2 ring-indigo-100 scale-[1.01] bg-indigo-50/30'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing transition-colors"
                          title="Drag to Reorder"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                          </svg>
                        </div>
                        <p className="font-bold text-xs text-slate-700 uppercase tracking-wider">Education #{index + 1}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all duration-200"
                          onClick={() => moveItem('education', index, 'up')}
                          disabled={index === 0}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all duration-200"
                          onClick={() => moveItem('education', index, 'down')}
                          disabled={index === (resume.sections.education?.items || []).length - 1}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 active:scale-95 transition-all duration-200"
                          onClick={() => removeEducationItem(index)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <div>
                        <label className={premiumLabelClass}>Institution / School</label>
                        <input
                          className={premiumInputClass}
                          value={item.institution}
                          placeholder="e.g. Punjab University College of Information Technology (PUCIT)"
                          onChange={(event) => handleEducationChange(index, 'institution', event.target.value)}
                        />
                      </div>
                      <div>
                        <label className={premiumLabelClass}>Degree / Program</label>
                        <input
                          className={premiumInputClass}
                          value={item.studyType}
                          placeholder="e.g. BS Software Engineering"
                          onChange={(event) => handleEducationChange(index, 'studyType', event.target.value)}
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className={premiumLabelClass}>Start Date</label>
                          <input
                            className={premiumInputClass}
                            value={item.startDate}
                            placeholder="e.g. 10/2020"
                            onChange={(event) => handleEducationChange(index, 'startDate', event.target.value)}
                          />
                        </div>
                        <div>
                          <label className={premiumLabelClass}>End Date</label>
                          <input
                            className={premiumInputClass}
                            value={item.endDate}
                            placeholder="e.g. 06/2024"
                            onChange={(event) => handleEducationChange(index, 'endDate', event.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className={premiumLabelClass}>Location</label>
                          <input
                            className={premiumInputClass}
                            placeholder="e.g. Lahore, Pakistan"
                            value={item.location || ''}
                            onChange={(event) => handleEducationChange(index, 'location', event.target.value)}
                          />
                        </div>
                        <div>
                          <label className={premiumLabelClass}>Relevant Coursework</label>
                          <input
                            className={premiumInputClass}
                            placeholder="e.g. Software Engineering, OOP, DBMS"
                            value={item.coursework || ''}
                            onChange={(event) => handleEducationChange(index, 'coursework', event.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    ),
    certifications: () => (
      <div className={`rounded-2xl border transition-all duration-300 ${
        expandedSection === 'certifications' 
          ? 'border-indigo-200 bg-white shadow-[0_8px_30px_rgba(99,102,241,0.1)] ring-1 ring-indigo-50' 
          : 'border-slate-200/80 bg-white shadow-sm hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/50'
      }`}>
        <div className="flex items-center justify-between pr-4">
          <div className="flex-1">
            {renderAccordionHeader(
              'certifications',
              'Certifications',
              'Industry credentials & licenses',
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>,
              `${(resume.sections.certifications?.items || []).length} active`
            )}
          </div>
          {expandedSection === 'certifications' && (
            <button
              onClick={addCertificationItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add
            </button>
          )}
        </div>

        <div className={`accordion-body ${expandedSection === 'certifications' ? 'open' : ''}`}>
          <div>
            <div className="border-t border-slate-100 p-5 bg-white rounded-b-2xl space-y-4">
            {(resume.sections.certifications?.items || []).length === 0 ? (
              <p className="text-center py-6 text-xs font-medium text-slate-400">No certifications. Click 'Add' to document certifications.</p>
            ) : (
              <div className="space-y-4">
                {(resume.sections.certifications?.items || []).map((item: any, index: number) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'certifications', index)}
                    onDragOver={(e) => handleDragOver(e, 'certifications', index)}
                    onDrop={(e) => handleDrop(e, 'certifications', index)}
                    onDragEnd={handleDragEnd}
                    className={`rounded-xl border p-4 transition-all duration-200 ${
                      draggedItem?.section === 'certifications' && draggedItem?.index === index
                        ? 'opacity-40 border-dashed border-indigo-400 bg-slate-100 scale-95'
                        : 'border-slate-100 bg-slate-50/45 hover:border-slate-200'
                    } ${
                      dragOverIndex?.section === 'certifications' && dragOverIndex?.index === index
                        ? 'border-indigo-400 shadow-md ring-2 ring-indigo-100 scale-[1.01] bg-indigo-50/30'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing transition-colors"
                          title="Drag to Reorder"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                          </svg>
                        </div>
                        <p className="font-bold text-xs text-slate-700 uppercase tracking-wider">Certification #{index + 1}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all duration-200"
                          onClick={() => moveItem('certifications', index, 'up')}
                          disabled={index === 0}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all duration-200"
                          onClick={() => moveItem('certifications', index, 'down')}
                          disabled={index === (resume.sections.certifications?.items || []).length - 1}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 active:scale-95 transition-all duration-200"
                          onClick={() => removeCertificationItem(index)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className={premiumLabelClass}>Certification Title</label>
                      <input
                        className={premiumInputClass}
                        value={item.name}
                        placeholder="e.g. AWS Certified Solutions Architect"
                        onChange={(event) => handleCertificationChange(index, event.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    )
  };

  const defaultOrder = ['keyAchievements', 'experience', 'skills', 'projects', 'education', 'certifications'];
  const sectionOrder = [...(resume.sectionOrder || defaultOrder)];
  
  defaultOrder.forEach((sec) => {
    if (!sectionOrder.includes(sec)) {
      sectionOrder.push(sec);
    }
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── Personal Details & Summary ── */}
      <div
        className={`rounded-2xl border transition-all duration-300 ${
          expandedSection === 'basics'
            ? 'border-indigo-200 bg-white shadow-[0_8px_30px_rgba(99,102,241,0.1)] ring-1 ring-indigo-50'
            : 'border-slate-200/80 bg-white shadow-sm hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/50'
        }`}
      >
        {renderAccordionHeader(
          'basics',
          'Personal Details',
          'Identity, Contact & Summary',
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>,
          resume.basics.name ? 'Basics OK' : 'Required'
        )}

        <div className={`accordion-body ${expandedSection === 'basics' ? 'open' : ''}`}>
          <div>
            <div className="border-t border-slate-100 p-5 bg-white rounded-b-2xl space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className={premiumLabelClass}>Full Name</label>
                  <input
                    className={premiumInputClass}
                    value={resume.basics.name}
                    placeholder="e.g. Qurban Hanif"
                    onChange={(event) => handleBasicsChange('name', event.target.value)}
                  />
                </div>
                <div>
                  <label className={premiumLabelClass}>Headline</label>
                  <input
                    className={premiumInputClass}
                    value={resume.basics.headline}
                    placeholder="e.g. Software Engineer"
                    onChange={(event) => handleBasicsChange('headline', event.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={premiumLabelClass}>Email Address</label>
                    <input
                      type="email"
                      className={premiumInputClass}
                      value={resume.basics.email}
                      placeholder="e.g. qurbanhanif120@gmail.com"
                      onChange={(event) => handleBasicsChange('email', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className={premiumLabelClass}>Phone Number</label>
                    <input
                      type="tel"
                      className={premiumInputClass}
                      value={resume.basics.phone}
                      placeholder="e.g. 03085651015"
                      onChange={(event) => handleBasicsChange('phone', event.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={premiumLabelClass}>Location</label>
                    <input
                      className={premiumInputClass}
                      value={resume.basics.location}
                      placeholder="e.g. Lahore, Pakistan"
                      onChange={(event) => handleBasicsChange('location', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className={premiumLabelClass}>LinkedIn URL</label>
                    <input
                      type="url"
                      className={premiumInputClass}
                      value={resume.basics.linkedin || ''}
                      placeholder="e.g. https://linkedin.com/in/qurban-hanif"
                      onChange={(event) => handleBasicsChange('linkedin', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className={premiumLabelClass}>GitHub URL</label>
                    <input
                      type="url"
                      className={premiumInputClass}
                      value={resume.basics.github || ''}
                      placeholder="e.g. https://github.com/qurban7860"
                      onChange={(event) => handleBasicsChange('github', event.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={premiumLabelClass}>Website / Portfolio URL</label>
                    <input
                      type="url"
                      className={premiumInputClass}
                      value={resume.basics.url?.href || ''}
                      placeholder="e.g. https://qurbanhanif.dev"
                      onChange={(event) => {
                        setResume({
                          ...resume,
                          basics: {
                            ...resume.basics,
                            url: { ...(resume.basics.url || {}), href: event.target.value },
                          },
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label className={premiumLabelClass}>Website Label (optional)</label>
                    <input
                      type="text"
                      className={premiumInputClass}
                      value={(resume.basics.url as any)?.label || ''}
                      placeholder="e.g. Portfolio"
                      onChange={(event) => handleWebsiteLabelChange(event.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className={premiumLabelClass}>Summary (Bio)</label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold ${
                          summaryLen > 400 || summaryLen < 100 ? 'text-amber-500' : 'text-green-500'
                        }`}
                      >
                        {summaryLen}/400 chars
                      </span>
                      <button
                        type="button"
                        disabled={aiLoading === 'summary'}
                        onClick={async () => {
                          try {
                            setAiLoading('summary');
                            const enhanced = await callAiEnhance(
                              'summary',
                              normalizePlainText(resume.sections.summary.content),
                              resume.basics.headline
                            );
                            setAiDiff({ key: 'summary', original: resume.sections.summary.content, enhanced });
                          } catch {
                            setAiLoading(null);
                          } finally {
                            setAiLoading(null);
                          }
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 text-[10px] font-bold transition-all active:scale-95 disabled:opacity-50"
                        title="AI-powered summary generator"
                      >
                        {aiLoading === 'summary' ? (
                          <span className="w-2.5 h-2.5 border border-violet-500 border-t-transparent rounded-full animate-spin" />
                        ) : '✨'}
                        AI Write
                      </button>
                    </div>
                  </div>
                  {/* AI Diff Preview for Summary */}
                  {aiDiff?.key === 'summary' && (
                    <div className="mb-2 rounded-lg border border-violet-200 bg-violet-50 p-3 text-xs">
                      <p className="text-violet-700 font-bold mb-1">✨ AI Suggestion:</p>
                      <p className="text-slate-700 leading-relaxed">{aiDiff.enhanced}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => { handleSummaryChange(aiDiff.enhanced); setAiDiff(null); }}
                          className="px-2.5 py-1 bg-violet-600 text-white rounded-md font-bold text-[10px] hover:bg-violet-700 transition-all"
                        >Apply</button>
                        <button
                          onClick={() => setAiDiff(null)}
                          className="px-2.5 py-1 bg-white text-slate-500 border border-slate-200 rounded-md font-bold text-[10px] hover:bg-slate-50 transition-all"
                        >Dismiss</button>
                      </div>
                    </div>
                  )}
                  <ReactQuill
                    theme="snow"
                    value={resume.sections.summary.content}
                    onChange={handleSummaryChange}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Draft your professional summary..."
                    className="bg-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Optimal: 100-400 chars for ATS scanning.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamically ordered sections */}
      {sectionOrder.map((secId) => {
        const renderFn = sectionRenderers[secId];
        return renderFn ? <React.Fragment key={secId}>{renderFn()}</React.Fragment> : null;
      })}

      {/* Relevant coursework handled inline with Education (editor removed) */}


    </div>
  );
};
