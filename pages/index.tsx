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
  const [isExporting, setIsExporting] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    // Load initial resume data
    if (!resume) {
      setResume(resumeData as any);
    }
    setLoading(false);
  }, [resume, setResume]);

  useEffect(() => {
    // Dynamic auto-scaling depending on the container width to fit canvas perfectly
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const parent = document.getElementById('preview-workspace-parent');
        if (parent) {
          const parentWidth = parent.clientWidth - 48; // subtract padding (e.g. px-6 = 48px)
          const a4WidthPx = 794; // 210mm in pixels at 96 DPI
          let calculatedZoom = parentWidth / a4WidthPx;
          // Clamp zoom level between 0.35 and 1.1 to avoid extreme sizes
          calculatedZoom = Math.min(1.1, Math.max(0.35, calculatedZoom));
          setZoom(calculatedZoom);
        } else {
          // Standard window width fallback
          const width = window.innerWidth;
          if (width < 480) {
            setZoom(0.42);
          } else if (width < 640) {
            setZoom(0.5);
          } else if (width < 1024) {
            setZoom(0.75);
          } else if (width < 1280) {
            setZoom(0.85);
          } else {
            setZoom(1.0);
          }
        }
      }
    };
    
    if (!loading) {
      handleResize();
      const timer = setTimeout(handleResize, 100);
      window.addEventListener('resize', handleResize);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [loading]);

  useEffect(() => {
    // Update score whenever resume changes
    const newScore = getScore();
    setScore(newScore);
  }, [resume, getScore]);

  const handleExportPDF = async () => {
    if (isExporting) return;
    try {
      setIsExporting(true);
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
        alert('Failed to export PDF. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const loadSampleData = () => {
    if (window.confirm('Are you sure you want to load the premium sample resume? This will overwrite your current draft.')) {
      setResume(resumeData as any);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading Resume Workstation...</p>
        </div>
      </div>
    );
  }

  // Get active template display name
  const activeTemplateName = templateId.charAt(0).toUpperCase() + templateId.slice(1);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col bg-slate-50 font-sans antialiased text-slate-800">
      
      {/* ── Top Premium Glassmorphic Header ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm sm:text-base shadow-md shadow-indigo-150">
            R
          </div>
          <div>
            <h1 className="text-sm sm:text-md font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 bg-clip-text text-transparent">
              ResumeBuilder Pro
            </h1>
            <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Top 1% FAANG Standard Engine</p>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-2 sm:gap-6">
          {/* ATS Mini Badge */}
          <div className="hidden md:flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-full shadow-inner">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-500">ATS Score:</span>
            <span className={`text-sm font-black ${
              score >= 90 ? 'text-green-600' : score >= 75 ? 'text-indigo-600' : 'text-amber-500'
            }`}>
              {score}/100
            </span>
          </div>
          {/* Mobile ATS Mini Badge - visible below md */}
          <div className="md:hidden flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-slate-500">ATS:</span>
            <span className={`text-xs font-black ${
              score >= 90 ? 'text-green-600' : score >= 75 ? 'text-indigo-600' : 'text-amber-500'
            }`}>
              {score}
              <span className="text-slate-400">/100</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Load Mock Data */}
            <button
              onClick={loadSampleData}
              title="Reset to Premium Sample Data"
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 transition-all rounded-lg"
            >
              <span className="sm:hidden">🔄</span>
              <span className="hidden sm:inline">🔄 Load Sample</span>
            </button>

            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`
                px-3 py-1.5 sm:px-5 sm:py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700
                text-white rounded-lg shadow-sm font-bold text-[10px] sm:text-xs uppercase tracking-wider active:scale-[0.97]
                transition-all duration-200 flex items-center gap-1.5 sm:gap-2
                ${isExporting ? 'opacity-75 cursor-not-allowed' : ''}
              `}
            >
              {isExporting ? (
                <>
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Building...</span>
                </>
              ) : (
                <>
                  <span>📥 Export PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>
 
      {/* ── Mobile Tab Switcher (visible only below lg) ── */}
      <div className="lg:hidden flex items-center bg-white border-b border-slate-200 no-print" role="tablist" aria-label="Panel switcher">
        <button
          role="tab"
          aria-selected={mobileTab === 'editor'}
          onClick={() => setMobileTab('editor')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 relative ${
            mobileTab === 'editor'
              ? 'text-indigo-600 tab-active-underline'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editor
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
            score >= 90 ? 'bg-green-100 text-green-700' : score >= 75 ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
          }`}>{score}</span>
        </button>
        <div className="w-px h-6 bg-slate-200" />
        <button
          role="tab"
          aria-selected={mobileTab === 'preview'}
          onClick={() => setMobileTab('preview')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 relative ${
            mobileTab === 'preview'
              ? 'text-indigo-600 tab-active-underline'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </button>
      </div>

      {/* ── Main Workspace Area (Independent Scrolls) ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Dynamic Editor Column */}
        <aside className={`w-full lg:w-[440px] xl:w-[460px] lg:h-full lg:overflow-y-auto lg:border-r border-slate-200 bg-white p-4 sm:p-6 flex-shrink-0 space-y-6 ${
            mobileTab === 'editor' ? 'block' : 'hidden lg:block'
          }`}>
          
          {/* Real-time ATS Dashboard gauge */}
          <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl" />
            <div className="absolute -left-6 -top-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-lg" />
            
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-indigo-300 font-extrabold">Active Layout Style</span>
                <h3 className="text-sm font-extrabold text-white mt-0.5">{activeTemplateName}</h3>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-white/10 text-white font-bold text-[9px] uppercase tracking-wider backdrop-blur-sm">
                ATS Engine v2.0
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mt-4 bg-white/5 border border-white/10 rounded-xl p-3">
              <div>
                <p className="text-[10px] text-indigo-200">Score Rating</p>
                <p className="text-xs font-black text-white">
                  {score >= 90 ? 'Elite (Top 1%)' : score >= 75 ? 'Strong Competitor' : 'Needs Work'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black">{score}</span>
                <span className="text-[10px] text-white/50">/100</span>
              </div>
            </div>
          </div>

          {/* Core Accordion Editor */}
          <ResumeEditor />

          {/* Premium FAANG Layout Picker */}
          <TemplatePicker />

          {/* Structural Completeness Meter */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span>📋 Document Completeness</span>
            </h3>
            <div className="space-y-3.5">
              {[
                { name: 'Professional Experience', count: resume?.sections.experience.items.length || 0, icon: '💼' },
                { name: 'Core Skill Categories', count: resume?.sections.skills.items.length || 0, icon: '⚡' },
                { name: 'Key Engineering Projects', count: resume?.sections.projects.items.length || 0, icon: '🚀' },
                { name: 'Educational Institutions', count: resume?.sections.education.items.length || 0, icon: '🎓' },
                { name: 'Industry Certifications', count: resume?.sections.certifications.items.length || 0, icon: '📜' },
              ].map((sect, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] sm:text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm">{sect.icon}</span>
                    <span className="font-semibold text-slate-600">{sect.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    sect.count > 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {sect.count} active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Side: Lock-A4 Preview Workspace Canvas */}
        <main 
          id="preview-workspace-parent"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
            backgroundSize: '16px 16px',
          }}
          className={`flex-1 lg:h-full lg:overflow-y-auto bg-slate-50 py-6 px-4 flex flex-col items-center gap-6 relative transition-all duration-300 ${
            mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          
          {/* Dynamic Scroll Indicator / Top Utility Bar */}
          <div className="w-full max-w-[210mm] flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/80 backdrop-blur border border-slate-200/50 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">A4 Dimension:</span>
              <span className="text-[10px] px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-md font-bold text-indigo-600 uppercase">
                210mm × 297mm
              </span>
            </div>

            {/* Premium Dynamic Zoom Widget */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/50 px-2 py-1 rounded-lg">
              <button 
                onClick={() => setZoom(z => Math.max(0.35, z - 0.05))} 
                className="w-6 h-6 flex items-center justify-center text-xs font-black text-slate-500 hover:text-slate-900 border border-slate-200 bg-white active:scale-90 transition-all rounded shadow-sm"
                title="Zoom Out"
              >
                -
              </button>
              <span className="text-xs font-mono font-bold text-slate-600 px-1 min-w-[36px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button 
                onClick={() => setZoom(z => Math.min(1.2, z + 0.05))} 
                className="w-6 h-6 flex items-center justify-center text-xs font-black text-slate-500 hover:text-slate-900 border border-slate-200 bg-white active:scale-90 transition-all rounded shadow-sm"
                title="Zoom In"
              >
                +
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button 
                onClick={() => {
                  const parent = document.getElementById('preview-workspace-parent');
                  if (parent) {
                    const parentWidth = parent.clientWidth - 48;
                    const a4WidthPx = 794;
                    let calculatedZoom = parentWidth / a4WidthPx;
                    calculatedZoom = Math.min(1.1, Math.max(0.35, calculatedZoom));
                    setZoom(calculatedZoom);
                  }
                }}
                className="px-2 py-0.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 active:scale-95 transition-all rounded"
                title="Auto Fit to Screen"
              >
                Fit
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Current Theme:</span>
              <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                {templateId === 'classic' ? 'Georgia Monochrome' : templateId === 'modern' ? 'Indigo Sans' : 'Executive Royal Plum'}
              </span>
            </div>
          </div>

          {/* Centered Premium Shadow-A4 Preview Box */}
          <div className="w-full flex justify-center items-start overflow-visible py-2" style={{ minHeight: `calc(297mm * ${zoom})` }}>
            <div 
              style={{ 
                width: `calc(210mm * ${zoom})`,
                height: `calc(297mm * ${zoom})`,
                position: 'relative',
                overflow: 'visible'
              }}
              className="flex-shrink-0 select-none"
            >
              <div 
                style={{ 
                  transform: `scale(${zoom})`, 
                  transformOrigin: 'top left',
                  width: '210mm',
                  height: '297mm',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                className="bg-white shadow-[0_25px_60px_rgba(15,23,42,0.12)] border border-slate-200/60 rounded-2xl overflow-hidden"
              >
                <div id="resume-preview" className="w-full">
                  <ResumeRenderer resume={resume} printMode={true} />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive ATS Feedback Widget docked under the sheet */}
          <div className="w-full max-w-[210mm]">
            <div className="bg-slate-800 text-white rounded-xl px-4 py-2 text-xs font-bold shadow-md inline-flex items-center gap-1.5 mb-3.5">
              <span>💡 ATS Core Feedback & Optimizations</span>
            </div>
            <AtsFeedbackWidget />
          </div>
        </main>
      </div>
    </div>
  );
}
