import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [demoTitle, setDemoTitle] = useState('Senior Software Engineer');
  const [demoCompany, setDemoCompany] = useState('Google');
  const [demoBullets, setDemoBullets] = useState([
    'Led architecture of high-throughput distributed microservices using Next.js, Node.js, and Redis.',
    'Optimized SQL database execution paths, reducing database query latencies by 42% via strategic indexing.'
  ]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBulletChange = (index: number, val: string) => {
    const updated = [...demoBullets];
    updated[index] = val;
    setDemoBullets(updated);
  };

  return (
    <div
      className="relative min-h-screen w-full bg-[#05060b] text-slate-100 overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white flex flex-col isolate"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <Head>
        <title>ResumeBuilder Pro | Premium AI-Powered ATS Resume Ecosystem</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="description" content="Build a top 1% FAANG-standard, ATS-optimized resume using our elite AI engine. Compete with leading platforms with real-time scoring, recruiter scan heatmaps, and elite typography." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[700px] bg-indigo-500/5 rounded-full blur-[180px]" />
      </div>

      <header 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
          scrolled 
            ? 'bg-[#05060b]/80 backdrop-blur-xl border-slate-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.4)]' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-lg shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-transform duration-300">
              R
            </div>
            <div>
              <span className="text-md font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                ResumeBuilder<span className="text-indigo-400">Pro</span>
              </span>
              <span className="block text-[8px] font-extrabold uppercase tracking-widest text-slate-500">AI Ecosystem</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#recruiter-sim" className="hover:text-white transition-colors duration-200">Recruiter Vision</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/builder" 
              className="hidden sm:inline-flex group relative items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(99,102,241,0.25)] transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-95 duration-200"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Go to Workspace
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:translate-x-0 transition-transform duration-300" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu Window"
              className="md:hidden relative z-50 w-10 h-10 inline-flex items-center justify-center rounded-xl bg-slate-900/50 text-slate-200 border border-slate-800/60 hover:bg-slate-800 transition-colors focus:outline-none"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div 
          className={`md:hidden absolute top-full left-0 w-full bg-[#05060b]/98 backdrop-blur-2xl border-b transition-all duration-300 ease-in-out overflow-hidden z-40 ${
            mobileMenuOpen ? 'max-h-[340px] border-slate-800/80 opacity-100' : 'max-h-0 border-transparent opacity-0'
          }`}
        >
          <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-4">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors py-1">Features</a>
            <a href="#recruiter-sim" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors py-1">Recruiter Vision</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors py-1">Pricing</a>
            <div className="h-px w-full bg-slate-800/50 my-1" />
            <Link 
              href="/builder" 
              onClick={() => setMobileMenuOpen(false)} 
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-xs font-bold uppercase tracking-wider text-center shadow-lg transition-colors active:scale-98"
            > 
              Go to Workspace 
            </Link>
          </div>
        </div>
      </header>

      <main className="relative pt-20 lg:pt-40 z-10">
        <section className="mx-auto max-w-7xl px-6 pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/5 px-4 py-1.5 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Powered by Gemini & ATS Core Engine v2.0</span>
          </div>

          <h1 className="mx-auto max-w-5xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-[72px] sm:leading-[1.15] mb-6">
            Build a Resume That Lands <br className="hidden sm:block"/>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">FAANG Interviews</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed mb-10">
            An elite AI-powered resume stack engineered to outperform technical ATS filters and secure engineering roles at market-leading organizations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <Link
              href="/builder"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-[0_10px_30px_rgba(99,102,241,0.3)] hover:bg-indigo-500 active:scale-95 transition-all duration-200"
            >
              Create Resume Now
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-800/60 px-8 py-4 text-sm font-bold uppercase tracking-wider text-slate-300 transition-all duration-200"
            >
              Interactive Demo
            </a>
          </div>

          {/* ── Interactive Live Sandbox Demo ── */}
          <div id="demo" className="mx-auto max-w-5xl rounded-3xl border border-slate-800/80 bg-[#090b14]/80 p-4 sm:p-8 backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.6)] relative text-left">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-900 pb-4">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-2">Real-Time Sync Sandbox Preview</span>
            </div>

            <div className="grid gap-8 lg:grid-cols-5">
              {/* Interactive Input Panel */}
              <div className="lg:col-span-2 space-y-5 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/60 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400">Reactive Controls</h3>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Target Role Headline</label>
                    <input
                      type="text"
                      value={demoTitle}
                      onChange={(e) => setDemoTitle(e.target.value)}
                      className="w-full bg-[#05060b] border border-slate-800/80 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Target Company</label>
                    <input
                      type="text"
                      value={demoCompany}
                      onChange={(e) => setDemoCompany(e.target.value)}
                      className="w-full bg-[#05060b] border border-slate-800/80 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">STAR-Methodology Experience Bullets</label>
                    <div className="space-y-2.5">
                      {demoBullets.map((bullet, idx) => (
                        <textarea
                          key={idx}
                          value={bullet}
                          onChange={(e) => handleBulletChange(idx, e.target.value)}
                          className="w-full min-h-[65px] bg-[#05060b] border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Link 
                  href="/builder" 
                  className="mt-6 w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center shadow-lg active:scale-95 transition-all"
                >
                  Launch Full Production Workspace
                </Link>
              </div>

              <div className="lg:col-span-3 flex justify-center bg-slate-950/40 p-4 sm:p-6 rounded-2xl border border-slate-800/60 relative overflow-hidden">
                <div className="w-full max-w-[400px] min-h-[390px] bg-white text-slate-900 p-6 rounded-xl shadow-2xl relative select-none scale-[0.96] sm:scale-100 origin-top transition-transform duration-200">
                  <div className="text-center border-b border-slate-200 pb-3 mb-4">
                    <h4 className="text-lg font-black text-slate-900 leading-tight tracking-tight">Qurban Hanif</h4>
                    <p className="text-[10px] uppercase tracking-wider text-indigo-600 font-extrabold mt-1">{demoTitle}</p>
                    <p className="text-[8px] text-slate-500 mt-1 font-medium">qurbanhanif120@gmail.com | Lahore, Pakistan</p>
                  </div>
                  
                  {/* Dynamic Core Nodes */}
                  <div>
                    <h5 className="text-[10px] font-black uppercase border-b border-slate-900 pb-0.5 mb-2 tracking-wide text-slate-900">Professional Experience</h5>
                    <div>
                      <div className="flex justify-between items-baseline text-[10px] font-bold mb-1">
                        <span className="text-slate-900 font-extrabold">{demoTitle} <span className="text-slate-400 font-normal">at</span> <span className="text-indigo-600">{demoCompany}</span></span>
                        <span className="text-slate-500 text-[8px] font-semibold">07/2025 - Present</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-1.5">
                        {demoBullets.map((bullet, idx) => (
                          <li key={idx} className="text-[9px] text-slate-700 leading-relaxed font-medium">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Elite Score Widget Module */}
                  <div className="absolute right-4 bottom-4 bg-[#05060b] border border-slate-800 text-white px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 shadow-2xl shadow-black/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <div>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">ATS Score Matrix</p>
                      <p className="text-xs font-black text-indigo-400">92/100 (Elite)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Features Grid Section ── */}
      <section id="features" className="bg-[#080a14] border-y border-slate-800/60 py-24 relative z-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-4">
              Advanced Tooling to Outperform Filters
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400 text-sm leading-relaxed">
              Engineered with algorithmic precision to parse cleanly across core ATS architectures while preserving premium aesthetics.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'ATS Matrix Core Engine', desc: 'Real-time structural alignment analysis mapping raw text arrays against industry-standard parser logic models.', icon: '📊' },
              { title: 'Recruiter Vision Simulator', desc: 'Pre-rendered eye fixation simulators showcasing focal point zones to capture critical details in under 6 seconds.', icon: '👁️' },
              { title: 'Gemini Optimization Module', desc: 'In-context AI models translating flat responsibilities into metrics-driven achievements using the STAR methodology.', icon: '⚡' },
              { title: 'FAANG-Approved Presets', desc: 'Pixel-perfect CSS layouts completely decoupled from the data objects to ensure absolute zero spatial distortion.', icon: '🏛️' },
              { title: 'Decentralized Local Ecosystem', desc: 'Your data is fully portable and securely retained inside your client environment. Zero unauthorized analytical data mining.', icon: '🔒' },
              { title: 'Serverless PDF Compilation', desc: 'Dual-pipeline client compilation backed by a headless serverless engine ensuring correct dimension rendering.', icon: '📄' }
            ].map((feat, idx) => (
              <div 
                key={idx} 
                className="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/60 hover:border-indigo-500/40 transition-all duration-300 group hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-lg mb-4 group-hover:scale-105 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="recruiter-sim" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <span>Recruiter Fixation Map</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Optimize for the 6-Second Glance
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Technical screeners make decisions rapidly. The platform maps out textual alignment vectors to make certain that active impact parameters instantly engage human eyes.
            </p>
            <div className="space-y-4">
              {[
                { label: 'Name & Structural Branding Focus', desc: 'Ensures optimal typography alignment for identity preservation.' },
                { label: 'Chronological Work Hierarchy Paths', desc: 'Bypasses layout shifting to stream screen attention downward sequentially.' },
                { label: 'Action-Verb Technical Terminus Mapping', desc: 'Accentuates active verbs directly within standard initial vision clusters.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-[10px] font-black text-indigo-400 mt-0.5 flex-shrink-0">{idx + 1}</div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.label}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Link 
                href="/builder" 
                className="inline-flex items-center gap-1.5 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
              >
                Analyze Your Layout Match
              </Link>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-3xl p-6 relative overflow-hidden flex items-center justify-center min-h-[400px]">
            <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[60px]" />
            
            <div className="w-full max-w-[320px] bg-white rounded-xl p-5 shadow-2xl relative select-none">
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-red-500/25 rounded-full blur-md animate-pulse" />
              <div className="absolute top-20 left-12 w-12 h-12 bg-orange-500/25 rounded-full blur-md" />
              <div className="absolute top-[160px] left-14 w-14 h-14 bg-red-500/20 rounded-full blur-md animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-[220px] left-12 w-10 h-10 bg-orange-500/20 rounded-full blur-sm" />

              <div className="text-center border-b border-slate-200 pb-2 mb-4">
                <div className="h-3 w-24 bg-slate-900 rounded mx-auto mb-1.5" />
                <div className="h-2 w-32 bg-slate-400 rounded mx-auto" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-2.5 w-36 bg-slate-700 rounded" />
                      <div className="h-2 w-12 bg-slate-300 rounded" />
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded" />
                    <div className="h-2 w-5/6 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#080a14] border-t border-slate-800/60 py-24 relative z-10">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-4">
            Transparent SaaS Tier Architectures
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400 text-sm mb-16 leading-relaxed">
            Begin engineering your node objects for free, or scale up to Pro to access localized AI enhancers and layout variations.
          </p>

          <div className="grid gap-8 max-w-5xl mx-auto md:grid-cols-3 items-stretch">
            {[
              {
                title: 'Free Core',
                price: '$0',
                period: 'forever',
                features: ['Standard Base Schema Editor', 'Classic Uniform Template Format', 'Client-Side Real-Time Score Engine', 'Localized Storage Nodes', 'Standard Web Document Compile'],
                btn: 'Access Core',
                border: 'border-slate-800/80',
                popular: false
              },
              {
                title: 'Pro AI',
                price: '$9',
                period: 'month',
                features: ['In-Context Gemini Enhancer Module', 'Access to Full Layout Catalog', 'Interactive Recruiter Fixation Simulator', 'Persistent Version Snapshots', 'Headless Puppeteer Server Rendering'],
                btn: 'Deploy Pro',
                border: 'border-indigo-500/80 shadow-[0_0_40px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/20',
                popular: true
              },
              {
                title: 'Enterprise',
                price: '$29',
                period: 'month',
                features: ['All Active Pro Node Features', 'Collaborative Team Workspace Hub', 'Unlimited Snapshot Repositories', 'Custom Domain Font Registries', 'Isolated Priority API Channels'],
                btn: 'Launch Cluster',
                border: 'border-slate-800/80',
                popular: false
              }
            ].map((plan, idx) => (
              <div 
                key={idx} 
                className={`bg-slate-950/70 p-6 sm:p-8 rounded-2xl border ${plan.border} flex flex-col justify-between text-left relative transition-all`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md shadow-indigo-600/20">
                    Most Selected
                  </span>
                )}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">{plan.title}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-black text-white tracking-tight">{plan.price}</span>
                    <span className="text-xs text-slate-500 font-semibold">/{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8 text-[11px] text-slate-300 font-medium">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 leading-tight">
                        <svg className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/builder"
                  className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all active:scale-98 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/10 hover:from-indigo-500 hover:to-violet-500'
                      : 'border border-slate-800 bg-slate-900/30 text-slate-300 hover:bg-slate-800/50'
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
      <footer className="border-t border-slate-900 bg-[#030407] py-12 text-slate-500 text-xs font-medium relative z-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-indigo-600/10">R</div>
            <p>© 2026 ResumeBuilder Pro Ecosystem. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Architecture</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <Link href="/builder" className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
              App Workstation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}