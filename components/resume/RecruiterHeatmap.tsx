import React, { useState, useEffect, useRef } from 'react';

interface HotSpot {
  label: string;
  description: string;
  /** Top position as % of the A4 page height */
  topPct: number;
  /** Left position as % of the A4 page width */
  leftPct: number;
  /** Width as % */
  widthPct: number;
  /** Height as % */
  heightPct: number;
  /** Duration the recruiter's eye lingers (seconds) */
  duration: number;
  /** Heatmap color intensity */
  color: string;
}

// The standard 6-second recruiter eye-fixation hotspots
const HOT_SPOTS: HotSpot[] = [
  {
    label: 'Name',
    description: 'Your full name — recruiters spend ~2 seconds here to identify you.',
    topPct: 1.0,
    leftPct: 10,
    widthPct: 80,
    heightPct: 5.5,
    duration: 2.0,
    color: 'rgba(220, 38, 38, 0.72)',    // Red-hot
  },
  {
    label: 'Job Title / Headline',
    description: 'Current or target role — recruiters confirm role match instantly.',
    topPct: 6.5,
    leftPct: 15,
    widthPct: 70,
    heightPct: 3.5,
    duration: 1.5,
    color: 'rgba(234, 88, 12, 0.62)',    // Orange
  },
  {
    label: 'Contact Info',
    description: 'Email, phone, LinkedIn — recruiter checks if you can be contacted.',
    topPct: 10.5,
    leftPct: 5,
    widthPct: 90,
    heightPct: 3.5,
    duration: 0.5,
    color: 'rgba(245, 158, 11, 0.45)',   // Amber
  },
  {
    label: 'Most Recent Role',
    description: 'First experience entry — recruiter identifies your current level.',
    topPct: 27,
    leftPct: 5,
    widthPct: 90,
    heightPct: 10,
    duration: 1.2,
    color: 'rgba(234, 88, 12, 0.55)',    // Orange
  },
  {
    label: 'Skills Summary',
    description: 'Technical skills — ATS keyword matching happens in this zone.',
    topPct: 14,
    leftPct: 5,
    widthPct: 90,
    heightPct: 9,
    duration: 0.6,
    color: 'rgba(245, 158, 11, 0.40)',   // Amber
  },
  {
    label: 'Education',
    description: 'Degree info — confirms minimum educational qualifications.',
    topPct: 76,
    leftPct: 5,
    widthPct: 90,
    heightPct: 7,
    duration: 0.3,
    color: 'rgba(16, 185, 129, 0.35)',   // Green - lighter
  },
];

interface RecruiterHeatmapProps {
  /** Whether the heatmap overlay is visible */
  visible: boolean;
}

export const RecruiterHeatmap: React.FC<RecruiterHeatmapProps> = ({ visible }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animate fixation points sequentially
  useEffect(() => {
    if (!visible) {
      setAnimationStep(0);
      setScanComplete(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    setAnimationStep(0);
    setScanComplete(false);

    let cumulativeMs = 300;

    // Reveal each hotspot after a delay proportional to cumulative duration
    HOT_SPOTS.forEach((_spot, idx) => {
      cumulativeMs += idx === 0 ? 0 : HOT_SPOTS[idx - 1].duration * 600;
      timerRef.current = setTimeout(() => {
        setAnimationStep(idx + 1);
      }, cumulativeMs);
    });

    // Mark scan as complete after all spots are shown
    const totalMs = cumulativeMs + HOT_SPOTS[HOT_SPOTS.length - 1].duration * 600 + 400;
    timerRef.current = setTimeout(() => {
      setScanComplete(true);
    }, totalMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* Overlay container — positioned absolute over the A4 resume canvas */}
      <div
        className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-sm"
        aria-hidden="true"
      >
        {/* Dark vignette base */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Animated fixation hotspots */}
        {HOT_SPOTS.map((spot, idx) => {
          const isVisible = animationStep > idx;
          return (
            <div
              key={spot.label}
              className="absolute transition-all duration-700 ease-out rounded-md"
              style={{
                top: `${spot.topPct}%`,
                left: `${spot.leftPct}%`,
                width: `${spot.widthPct}%`,
                height: `${spot.heightPct}%`,
                background: isVisible ? spot.color : 'transparent',
                boxShadow: isVisible
                  ? `0 0 ${spot.duration * 20}px ${spot.duration * 10}px ${spot.color}`
                  : 'none',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.85)',
                filter: 'blur(8px)',
                mixBlendMode: 'multiply',
              }}
            />
          );
        })}

        {/* Scan-complete grid overlay */}
        {scanComplete && (
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 8%, rgba(220,38,38,0.08) 0%, transparent 55%), radial-gradient(circle at 50% 28%, rgba(234,88,12,0.06) 0%, transparent 35%)',
            }}
          />
        )}
      </div>

      {/* Legend panel — overlaid at the bottom of the preview pane (NOT on the resume itself) */}
      <div className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="mx-auto max-w-full bg-slate-900/90 backdrop-blur-sm border-t border-slate-700 px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
              👁 6-Second Recruiter Eye Scan
            </span>
            {scanComplete && (
              <span className="text-[9px] bg-green-900/60 text-green-300 px-2 py-0.5 rounded-full font-semibold">
                Scan Complete
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {HOT_SPOTS.map((spot, idx) => (
              <div
                key={spot.label}
                className={`flex items-start gap-1.5 transition-opacity duration-300 ${
                  animationStep > idx ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <div
                  className="mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: spot.color.replace('0.', '0.9') }}
                />
                <div>
                  <p className="text-[9px] font-semibold text-white leading-tight">{spot.label}</p>
                  <p className="text-[8px] text-slate-400 leading-tight">{spot.duration}s fixation</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[8px] text-slate-500">
            Heatmap shows recruiters' typical eye-fixation pattern in the first 6 seconds of reviewing a resume.
          </p>
        </div>
      </div>
    </>
  );
};
