import { useEffect, useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { useTemplateStore } from '@/store/useTemplateStore';
import { ResumeRenderer } from '@/components/resume/ResumeRenderer';
import { ResumeEditor } from '@/components/editor/ResumeEditor';
import resumeData from '@/data/resume.json';
import { exportResumeToPDF } from '@/lib/pdfExport';
import { AtsFeedbackWidget } from '@/components/resume/AtsFeedbackWidget';
import { TemplatePicker } from '@/components/resume/TemplatePicker';

export default function Dashboard() {
  const { resume, setResume, getScore } = useResumeStore();
  const { templateId } = useTemplateStore();
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial resume data
    if (!resume) {
      setResume(resumeData as any);
    }
    setLoading(false);
  }, [resume, setResume]);

  useEffect(() => {
    // Update score whenever resume changes
    const newScore = getScore();
    setScore(newScore);
  }, [resume, getScore]);

  const handleExportPDF = async () => {
    try {
      if (!resume) return;
      const filename = `${resume.basics.name.replace(/\s+/g, '-')}-resume.pdf`;

      const response = await fetch('/api/resume/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, filename, templateId }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || 'PDF export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.warn('Server PDF export failed; falling back to client-side PDF export.', error);
      try {
        if (!resume) return;
        await exportResumeToPDF(resume, `${resume.basics.name.replace(/\s+/g, '-')}-resume.pdf`, templateId);
      } catch (fallbackError) {
        console.error('Client-side PDF fallback failed:', fallbackError);
        alert('Failed to export PDF. Please try again or use a different browser.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
            <p className="text-sm text-gray-500">ATS-Optimized Resume Generator</p>
          </div>

          {/* Score Display */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Resume Score</p>
              <div className="text-4xl font-bold text-blue-600">{score}/100</div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportPDF}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              📥 Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)] gap-8">
          {/* Editor Column */}
          <div className="space-y-6">
            <ResumeEditor />

            {/* Template Picker */}
            <TemplatePicker />

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume Status</h2>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="text-lg font-bold text-gray-900">{resume?.sections.experience.items.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Skills</span>
                  <span className="text-lg font-bold text-gray-900">{resume?.sections.skills.items.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Projects</span>
                  <span className="text-lg font-bold text-gray-900">{resume?.sections.projects.items.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Education</span>
                  <span className="text-lg font-bold text-gray-900">{resume?.sections.education.items.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Certifications</span>
                  <span className="text-lg font-bold text-gray-900">{resume?.sections.certifications.items.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div id="resume-preview" className="p-8">
                <ResumeRenderer resume={resume} />
              </div>
            </div>

            <AtsFeedbackWidget />
          </div>
        </div>
      </main>
    </div>
  );
}
