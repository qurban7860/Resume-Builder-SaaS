import type { NextApiRequest, NextApiResponse } from 'next';

// ─── Strong STAR-method action verb vocabulary ───────────────────────────────
const ACTION_VERBS = [
  'Architected', 'Spearheaded', 'Engineered', 'Optimized', 'Developed',
  'Designed', 'Implemented', 'Led', 'Delivered', 'Reduced', 'Increased',
  'Improved', 'Streamlined', 'Deployed', 'Automated', 'Integrated',
  'Scaled', 'Built', 'Launched', 'Collaborated', 'Migrated', 'Refactored',
  'Mentored', 'Reviewed', 'Established', 'Managed', 'Created', 'Transformed',
];

// ─── Fallback: Local rule-based bullet point enhancer ──────────────────────
function enhanceBulletLocally(text: string): string {
  const clean = text.replace(/^<li>|<\/li>$/g, '').trim();

  // Strip existing weak openers
  const withoutWeakStarts = clean
    .replace(/^(?:i\s+)?(?:was\s+responsible\s+for|helped\s+with|worked\s+on|assisted\s+(?:in|with)?|did|participated\s+in)\s+/i, '')
    .replace(/^(?:my\s+job\s+was\s+to|in\s+my\s+role\s+i)\s+/i, '')
    .trim();

  // Pick a strong verb
  const randomVerb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];

  // Check if the cleaned text already starts with a strong action verb
  const hasStrongVerb = ACTION_VERBS.some((v) =>
    withoutWeakStarts.toLowerCase().startsWith(v.toLowerCase())
  );

  let enhanced = hasStrongVerb ? withoutWeakStarts : `${randomVerb} ${withoutWeakStarts.charAt(0).toLowerCase()}${withoutWeakStarts.slice(1)}`;

  // Append quantified metric if none is present
  const hasMetric = /\d+%|\d+\+|[0-9]+\s*(?:users|ms|projects|teams|countries|services|clients|\$|USD)/.test(enhanced);
  if (!hasMetric) {
    const metrics = [
      ', reducing latency by 30%',
      ', improving team efficiency by 25%',
      ', serving 10,000+ users',
      ', cutting costs by 20%',
      ', accelerating delivery by 2x',
    ];
    enhanced += metrics[Math.floor(Math.random() * metrics.length)];
  }

  return enhanced;
}

function enhanceSummaryLocally(currentSummary: string, jobTitle: string): string {
  const roleLabel = jobTitle || 'Software Engineer';
  const trimmedSummary = currentSummary.trim();
  const meaningfulIntro = trimmedSummary ? `${trimmedSummary.split('. ')[0]}. ` : '';

  return `${meaningfulIntro}Results-driven ${roleLabel} with proven expertise in designing, building, and scaling high-impact software solutions. Passionate about clean code, system architecture, and data-driven optimizations. Adept at cross-functional collaboration to deliver features that improve user experience and business outcomes. Committed to continuous learning and staying current with industry best practices.`;
}

// ─── Gemini API integration ─────────────────────────────────────────────────
async function callGeminiAPI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error('No API key');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 400,
          topP: 0.9,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const json = await res.json();
  return json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

// ─── Main handler ────────────────────────────────────────────────────────────
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, text, jobTitle, context } = req.body as {
    type: 'bullet' | 'summary' | 'keywords';
    text: string;
    jobTitle?: string;
    context?: string;
  };

  if (!type || !text) {
    return res.status(400).json({ error: 'type and text are required' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  try {
    let enhanced = '';

    if (apiKey) {
      // ─── Use Gemini AI ───────────────────────────────────────────────────
      let prompt = '';

      if (type === 'bullet') {
        prompt = `You are an expert FAANG resume writer. Rewrite the following resume bullet point to use the STAR method (Situation, Task, Action, Result). Start with a strong action verb, add a quantifiable metric if possible, and keep it to 1-2 sentences under 120 characters.

Bullet: "${text}"
Job Title: ${jobTitle || 'Software Engineer'}

Return ONLY the enhanced bullet point text. Do not include bullet symbols, HTML tags, or any explanation.`;
      } else if (type === 'summary') {
        prompt = `You are an elite FAANG resume coach. Write a 3-sentence professional summary for a ${jobTitle || 'Software Engineer'} role. It should:
- Start with a strong descriptor phrase
- Mention key technical skills
- Highlight measurable impact or career highlight
- Sound professional and confident, not generic

Current summary: "${text}"

Return ONLY the improved summary text, no quotes or labels.`;
      } else if (type === 'keywords') {
        prompt = `List 8-12 highly relevant ATS keywords for a ${jobTitle || 'Software Engineer'} job description. These should be a mix of technical skills, tools, and soft skills that recruiters search for. Context: "${context || text}".

Return ONLY a comma-separated list of keywords, nothing else.`;
      }

      enhanced = await callGeminiAPI(prompt);
    } else {
      // ─── Local rule-based fallback ───────────────────────────────────────
      if (type === 'bullet') {
        enhanced = enhanceBulletLocally(text);
      } else if (type === 'summary') {
        enhanced = enhanceSummaryLocally(text, jobTitle || 'Software Engineer');
      } else if (type === 'keywords') {
        const role = (jobTitle || 'Software Engineer').toLowerCase();
        if (role.includes('frontend') || role.includes('react') || role.includes('ui')) {
          enhanced = 'React, TypeScript, Next.js, CSS3, Tailwind CSS, Redux, Webpack, REST APIs, GraphQL, Jest, UI/UX Design, Responsive Design';
        } else if (role.includes('backend') || role.includes('node') || role.includes('api')) {
          enhanced = 'Node.js, Express, PostgreSQL, MongoDB, REST APIs, GraphQL, Microservices, Docker, AWS, Redis, CI/CD, System Design';
        } else if (role.includes('fullstack') || role.includes('full stack') || role.includes('full-stack')) {
          enhanced = 'React, Node.js, TypeScript, PostgreSQL, REST APIs, Docker, AWS, CI/CD, Tailwind CSS, Redis, GraphQL, Git';
        } else {
          enhanced = 'JavaScript, TypeScript, Python, React, Node.js, SQL, Git, Docker, AWS, CI/CD, Agile, System Design, REST APIs, Testing';
        }
      }
    }

    if (!enhanced) {
      return res.status(500).json({ error: 'No enhanced content generated' });
    }

    return res.status(200).json({
      original: text,
      enhanced,
      source: apiKey ? 'gemini' : 'local',
    });
  } catch (error) {
    console.error('AI enhance error:', error);

    // Graceful fallback even if Gemini fails
    let fallback = '';
    if (type === 'bullet') fallback = enhanceBulletLocally(text);
    else if (type === 'summary') fallback = enhanceSummaryLocally(text, jobTitle || 'Software Engineer');
    else fallback = 'JavaScript, TypeScript, React, Node.js, Git, Docker, AWS, PostgreSQL, REST APIs, CI/CD';

    return res.status(200).json({
      original: text,
      enhanced: fallback,
      source: 'fallback',
    });
  }
}
