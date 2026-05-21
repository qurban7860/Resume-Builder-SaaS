import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function LandingPage() {
  const [demoTitle, setDemoTitle] = useState('Senior Software Engineer');
  const [demoCompany, setDemoCompany] = useState('Google');
  const [demoBullets, setDemoBullets] = useState([
    'Led development of high-throughput microservices using Next.js and Node.js.',
    'Optimized SQL database query execution times by 42% through strategic indexing.'
  ]);

  const handleBulletChange = (index: number, val: string) => {
    const updated = [...demoBullets];
    updated[index] = val;
    setDemoBullets(updated);
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white">
      <Head>
        <title>ResumeBuilder Pro | Premium AI-Powered ATS Resume Builder</title>
        <meta name="description" content="Build a top 1% FAANG-standard, ATS-optimized resume using our elite AI engine. Compete with leading platforms like Resume.io and Novoresume with real-time scoring, recruiter scan heatmaps, and elite typography." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Radial Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[200px] pointer-events-none" />

      {/* ── Premium Glassmorphic Header ── */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-[#070913]/70 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-lg shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-transform duration-300">
              R
            </div>
            <div>
              <span className="text-md font-black tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                ResumeBuilder<span className="text-indigo-400">Pro</span>
              </span>
              <span className="block text-[8px] font-extrabold uppercase tracking-widest text-slate-500">AI Ecosystem</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#templates" className="hover:text-white transition-colors duration-200">Templates</a>
            <a href="#recruiter-sim" className="hover:text-white transition-colors duration-200">Recruiter Vision</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/builder" 
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(99,102,241,0.25)] transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-95 duration-200"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Go to Workspace
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:translate-x-0 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/5 px-4 py-1.5 mb-8 animate-fade-slide-in">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Powered by Gemini 1.5 & ATS Core Engine v2.0</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-[70px] sm:leading-[1.1] mb-6 animate-fade-slide-in">
          Build a Resume That Lands <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">FAANG Interviews</span>
        </h1>

        <p className="mx-auto max-w-2xl text-md sm:text-lg text-slate-400 leading-relaxed mb-10 animate-fade-in">
          An elite AI-powered resume builder designed to outperform standard ATS filters and grab recruiters' attention in under 6 seconds. Trusted by engineers at Google, Meta, and Stripe.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in">
          <Link
            href="/builder"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-[0_10px_30px_rgba(99,102,241,0.3)] hover:bg-indigo-500 active:scale-95 transition-all duration-200"
          >
            Create Resume Now
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/30 hover:bg-slate-800/70 hover:border-slate-600 px-8 py-4 text-sm font-bold uppercase tracking-wider text-slate-300 transition-all duration-200"
          >
            Watch Live Demo
          </a>
        </div>

        {/* ── Interactive Live Sandbox Demo ── */}
        <div id="demo" className="mx-auto max-w-5xl rounded-3xl border border-slate-800/80 bg-slate-950/40 p-5 sm:p-8 backdrop-blur-sm shadow-[0_30px_80px_rgba(0,0,0,0.4)] relative animate-fade-slide-in">
          <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-6 border-b border-slate-900 pb-4">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-2">Interactive Preview Editor Sandbox</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-5 text-left">
            {/* Input Panel */}
            <div className="lg:col-span-2 space-y-5 bg-slate-900/50 p-5 rounded-2xl border border-slate-800/50 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400">Interactive Inputs</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Job Title</label>
                  <input
                    type="text"
                    value={demoTitle}
                    onChange={(e) => setDemoTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={demoCompany}
                    onChange={(e) => setDemoCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Impact Bullet points</label>
                  <div className="space-y-2">
                    {demoBullets.map((bullet, idx) => (
                      <textarea
                        key={idx}
                        value={bullet}
                        onChange={(e) => handleBulletChange(idx, e.target.value)}
                        className="w-full min-h-[50px] bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <Link 
                href="/builder" 
                className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center shadow-lg active:scale-95 transition-all"
              >
                Open Full Workstation
              </Link>
            </div>

            {/* A4 Preview Mockup */}
            <div className="lg:col-span-3 flex justify-center bg-slate-950/60 p-6 rounded-2xl border border-slate-800/50 relative overflow-hidden">
              <div className="w-[100%] min-h-[380px] bg-white text-slate-900 p-6 rounded-lg shadow-2xl relative select-none scale-[0.98] transition-transform duration-200">
                {/* Header Mock */}
                <div className="text-center border-b pb-3 mb-3">
                  <h4 className="text-base font-extrabold text-slate-900 leading-tight">Qurban Hanif</h4>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">{demoTitle}</p>
                  <p className="text-[8px] text-slate-400 mt-1">qurbanhanif120@gmail.com | 03085651015 | Lahore</p>
                </div>
                
                {/* Experience section mock */}
                <div>
                  <h5 className="text-[10px] font-black uppercase border-b border-slate-900 pb-0.5 mb-2 tracking-wide text-slate-900">Experience</h5>
                  <div className="mb-2">
                    <div className="flex justify-between items-baseline text-[9px] font-bold">
                      <span>{demoTitle} at <span className="text-indigo-600">{demoCompany}</span></span>
                      <span className="text-slate-500 text-[8px]">07/2025 - Present</span>
                    </div>
                    <ul className="list-disc pl-3 mt-1 space-y-1">
                      {demoBullets.map((bullet, idx) => (
                        <li key={idx} className="text-[8px] text-slate-600 leading-normal">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Score Widget Overlay */}
                <div className="absolute right-4 bottom-4 bg-[#070913] border border-slate-800 text-white px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xl animate-float">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <div>
                    <p className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">ATS Score Check</p>
                    <p className="text-xs font-black text-indigo-400">92/100 (Strong)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="bg-[#0b0e1e] border-y border-slate-800/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-4">
              Advanced Technology to Outperform Competitors
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400 text-sm">
              We provide the tools used by successful candidates to break through strict applicant tracking filters and secure high-paying roles.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'ATS Scoring Engine',
                desc: 'Real-time scoring mapping details of your experience, skills, projects, and format against standard applicant tracking criteria.',
                icon: '📊'
              },
              {
                title: 'Recruiter Scan Simulator',
                desc: 'Visual eye-tracking simulated heatmap overlays displaying exactly where recruiters look first during quick 6-second scans.',
                icon: '👁️'
              },
              {
                title: 'Gemini AI Assistant',
                desc: 'Optimize experience bullets on-the-fly. Translates technical duties into metrics-driven achievements using the STAR methodology.',
                icon: '⚡'
              },
              {
                title: 'FAANG-Approved Layouts',
                desc: 'Clean, print-perfect templates styled on formats proven to work at top technology companies and enterprise firms.',
                icon: '🏛️'
              },
              {
                title: 'Secure Local Storage',
                desc: 'Your data is 100% yours, stored locally in your browser. Edit in confidence without third-party tracking.',
                icon: '🔒'
              },
              {
                title: 'Elite PDF Compiler',
                desc: 'A robust dual-channel (client-side and Puppeteer serverless API) renderer that compiles A4-dimension PDF files flawlessly.',
                icon: '📄'
              }
            ].map((feat, idx) => (
              <div 
                key={idx} 
                className="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/80 hover:border-indigo-500/50 hover:shadow-[0_4px_30px_rgba(99,102,241,0.05)] transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-md font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Recruiter Scan Simulation Showcase ── */}
      <section id="recruiter-sim" className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <span>Recruiter Eyes Simulation</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Optimize for the 6-Second Glance
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Recruiters spend an average of 6 seconds scan-reading resumes before making an initial shortlist decision. Our built-in **Heatmap Scan Simulator** simulates eye fixation.
            </p>
            <div className="space-y-4">
              {[
                { label: 'Name & Headline Focus', desc: 'Ensures immediate brand recognition with premium alignment.' },
                { label: 'Chronological Work Hierarchy', desc: 'Simulates tracking eye paths from latest to earliest accomplishments.' },
                { label: 'Key Tech Verbs', desc: 'Highlights words like "Architected" or "Led" to ensure they fall along the reading path.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-[10px] font-black text-indigo-400 mt-0.5">{idx + 1}</div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.label}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link 
              href="/builder" 
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
            >
              Test Your Heatmap
            </Link>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden flex items-center justify-center">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[60px]" />
            
            {/* Visual Heatmap Representation */}
            <div className="w-full max-w-[340px] bg-white rounded-xl p-5 shadow-2xl relative select-none">
              {/* Blur Heatmap circles */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-14 h-14 bg-red-500/30 rounded-full blur-md" />
              <div className="absolute top-20 left-12 w-10 h-10 bg-orange-500/30 rounded-full blur-md" />
              <div className="absolute top-28 left-20 w-8 h-8 bg-yellow-500/25 rounded-full blur-sm" />
              <div className="absolute top-[160px] left-12 w-12 h-12 bg-red-500/30 rounded-full blur-md" />
              <div className="absolute top-[220px] left-12 w-8 h-8 bg-orange-500/20 rounded-full blur-sm" />

              <div className="text-center border-b pb-2 mb-3">
                <div className="h-3 w-20 bg-slate-900 rounded mx-auto mb-1" />
                <div className="h-2 w-28 bg-slate-400 rounded mx-auto" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between">
                      <div className="h-2.5 w-32 bg-slate-700 rounded" />
                      <div className="h-2 w-12 bg-slate-300 rounded" />
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded" />
                    <div className="h-2 w-5/6 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Matrix ── */}
      <section id="pricing" className="bg-[#0b0e1e] border-t border-slate-800/50 py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-4">
            Simple, Transparent SaaS Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400 text-sm mb-16">
            Get started for free or upgrade to Pro to unlock advanced AI modules and multi-version snapshots.
          </p>

          <div className="grid gap-8 max-w-4xl mx-auto md:grid-cols-3">
            {[
              {
                title: 'Free Core',
                price: '$0',
                period: 'forever',
                features: ['Standard Resume Editor', 'Classic Template Style', 'Basic ATS Scoring', 'Local Web Storage', 'Client PDF Download'],
                btn: 'Start Free',
                border: 'border-slate-800',
                popular: false
              },
              {
                title: 'Pro AI',
                price: '$9',
                period: 'month',
                features: ['Gemini AI Enhancer', 'All 7 Premium Templates', 'Interactive Recruiter Heatmap', 'Version snapshots', 'Puppeteer PDF Render'],
                btn: 'Upgrade to Pro',
                border: 'border-indigo-500/80 shadow-[0_0_30px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/20',
                popular: true
              },
              {
                title: 'Enterprise',
                price: '$29',
                period: 'month',
                features: ['All Pro features included', 'Shared workspace manager', 'Unlimited revisions', 'Custom fonts support', 'Priority API queues'],
                btn: 'Deploy Enterprise',
                border: 'border-slate-800',
                popular: false
              }
            ].map((plan, idx) => (
              <div 
                key={idx} 
                className={`bg-slate-950/70 p-6 rounded-2xl border ${plan.border} flex flex-col justify-between text-left relative`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-2">{plan.title}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-slate-500 font-medium">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3.5 mb-8 text-[11px] text-slate-300 font-medium">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/builder"
                  className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center active:scale-95 transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500'
                      : 'border border-slate-700 bg-slate-800/30 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  {plan.btn}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-900 bg-[#05060b] py-12 text-slate-500 text-xs font-medium text-center">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/90 text-white flex items-center justify-center font-black text-xs">R</div>
            <p>© 2026 ResumeBuilder Pro Inc. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="/builder" className="text-indigo-400 hover:text-indigo-300 transition-colors">App Workspace</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
