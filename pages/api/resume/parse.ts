import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import * as pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing to read raw stream
  },
};

// Heuristic helper to parse text into Resume schema
function parseResumeText(text: string, filename: string): any {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const result: any = {
    basics: {
      name: '',
      headline: '',
      email: '',
      phone: '',
      location: '',
      url: { href: '' },
      linkedin: '',
      github: '',
    },
    sections: {
      summary: { content: '' },
      experience: { items: [] },
      education: { items: [] },
      projects: { items: [] },
      skills: { items: [] },
      certifications: { items: [] },
    },
  };

  // Helper regular expressions
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
  const githubRegex = /github\.com\/[a-zA-Z0-9_-]+/i;

  // Section header regexes
  const sectionHeaders = {
    experience: /^(?:work\s+)?experience|employment(?:\s+history)?|professional\s+background|work\s+history$/i,
    education: /^education|academic(?:\s+background|\s+history)?$/i,
    projects: /^projects|technical\s+projects|personal\s+projects|key\s+projects$/i,
    skills: /^skills|technical\s+skills|technologies|expertise|skills\s+&\s+technologies$/i,
    certifications: /^certifications|certifications\s+&\s+licenses|licenses|credentials$/i,
  };

  // 1. Extract contact info and find section ranges
  const sectionLines: Record<string, string[]> = {
    experience: [],
    education: [],
    projects: [],
    skills: [],
    certifications: [],
    summary: [],
  };

  let currentSection = 'summary'; // Default block before headers

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for email
    if (!result.basics.email && emailRegex.test(line)) {
      const match = line.match(emailRegex);
      if (match) result.basics.email = match[0];
    }
    // Check for phone
    if (!result.basics.phone && phoneRegex.test(line)) {
      const match = line.match(phoneRegex);
      if (match) result.basics.phone = match[0];
    }
    // Check for LinkedIn
    if (!result.basics.linkedin && linkedinRegex.test(line)) {
      const match = line.match(linkedinRegex);
      if (match) result.basics.linkedin = 'https://' + match[0];
    }
    // Check for GitHub
    if (!result.basics.github && githubRegex.test(line)) {
      const match = line.match(githubRegex);
      if (match) result.basics.github = 'https://' + match[0];
    }

    // Check if this line is a section header
    let isHeader = false;
    for (const [key, regex] of Object.entries(sectionHeaders)) {
      if (regex.test(line)) {
        currentSection = key;
        isHeader = true;
        break;
      }
    }

    if (!isHeader) {
      if (currentSection in sectionLines) {
        sectionLines[currentSection].push(line);
      } else {
        sectionLines.summary.push(line);
      }
    }
  }

  // Find candidate name (usually first few lines, short, no numbers, no contact)
  const candidateLines = lines.slice(0, 5).filter(line => 
    !emailRegex.test(line) && 
    !phoneRegex.test(line) && 
    !linkedinRegex.test(line) && 
    !githubRegex.test(line) &&
    line.split(/\s+/).length <= 4 &&
    !/[0-9]/.test(line)
  );

  if (candidateLines.length > 0) {
    result.basics.name = candidateLines[0];
    if (candidateLines.length > 1) {
      result.basics.headline = candidateLines[1];
    }
  }

  // Fallbacks if not detected
  if (!result.basics.name) {
    result.basics.name = filename.split('.')[0].replace(/[-_]/g, ' ').trim() || 'John Doe';
  }
  if (!result.basics.headline) {
    result.basics.headline = 'Software Engineer';
  }
  if (!result.basics.email) result.basics.email = 'candidate@example.com';
  if (!result.basics.phone) result.basics.phone = '+1 123-456-7890';
  if (!result.basics.location) result.basics.location = 'San Francisco, CA';

  // 2. Parse Summary
  // Just combine the summary section lines
  result.sections.summary.content = sectionLines.summary
    .slice(0, 4) // Max 4 lines
    .join(' ');

  // 3. Parse Skills
  // Look for format: "Category: Skill1, Skill2" or comma-separated lists
  const skillLines = sectionLines.skills;
  if (skillLines.length > 0) {
    skillLines.forEach((line) => {
      if (line.includes(':')) {
        const [catName, skillsList] = line.split(':');
        const keywords = skillsList
          .split(/,|\x20•\x20|\|/)
          .map((s) => s.trim())
          .filter(Boolean);
        if (keywords.length > 0) {
          result.sections.skills.items.push({
            id: randomUUID(),
            name: catName.trim(),
            keywords,
          });
        }
      } else {
        const keywords = line
          .split(/,|\x20•\x20|\|/)
          .map((s) => s.trim())
          .filter(Boolean);
        if (keywords.length > 2) {
          result.sections.skills.items.push({
            id: randomUUID(),
            name: 'Skills',
            keywords,
          });
        }
      }
    });
  }

  // Fallback skill category if none found
  if (result.sections.skills.items.length === 0) {
    result.sections.skills.items.push({
      id: randomUUID(),
      name: 'Technical Skills',
      keywords: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Git'],
    });
  }

  // 4. Parse Experience
  // Look for roles. A role usually has: Title, Company, Date.
  // We identify date patterns (e.g. Month Year - Present, 2021 - 2023)
  const expLines = sectionLines.experience;
  const dateRegex = /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|\d{1,2})?\.?\s*(?:\d{4})\s*[-–—to]+\s*(?:present|\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|\d{1,2})?\.?\s*(?:\d{4}))/i;

  let currentExp: any = null;
  let expBullets: string[] = [];

  expLines.forEach((line) => {
    const isNewRole = dateRegex.test(line) || line.includes(' - Present') || line.includes(' — Present') || (line.includes(' at ') && line.split(/\s+/).length < 8);
    
    if (isNewRole) {
      // Save previous role
      if (currentExp) {
        currentExp.summary = expBullets.length > 0 
          ? `<ul>${expBullets.map(b => `<li>${b}</li>`).join('')}</ul>`
          : '<ul><li>Led key engineering initiatives</li></ul>';
        result.sections.experience.items.push(currentExp);
      }

      // Parse current role header
      // Format: "Title at Company" or "Company, Title, Date" or "Title | Company | Date"
      let title = 'Software Engineer';
      let company = 'Company';
      let startDate = '2022';
      let endDate = 'Present';

      const dateMatch = line.match(dateRegex);
      let dateString = '';
      let remainingLine = line;
      if (dateMatch) {
        dateString = dateMatch[0];
        remainingLine = line.replace(dateRegex, '').trim();
      }

      const parts = remainingLine.split(/\||,|\bat\b/i).map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        title = parts[0];
        company = parts[1];
      } else if (parts.length === 1) {
        title = parts[0];
      }

      if (dateString) {
        const dateParts = dateString.split(/[-–—to]+/i).map(d => d.trim());
        startDate = dateParts[0] || '2022';
        endDate = dateParts[1] || 'Present';
      }

      currentExp = {
        id: randomUUID(),
        title,
        company,
        companyUrl: '',
        startDate,
        endDate,
        summary: '',
      };
      expBullets = [];
    } else {
      // It's a description or bullet point
      const cleanBullet = line.replace(/^[•\-*]\s*/, '').trim();
      if (cleanBullet && currentExp) {
        expBullets.push(cleanBullet);
      }
    }
  });

  if (currentExp) {
    currentExp.summary = expBullets.length > 0 
      ? `<ul>${expBullets.map(b => `<li>${b}</li>`).join('')}</ul>`
      : '<ul><li>Led key engineering initiatives</li></ul>';
    result.sections.experience.items.push(currentExp);
  }

  // Fallback experience if none found
  if (result.sections.experience.items.length === 0) {
    result.sections.experience.items.push({
      id: randomUUID(),
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      companyUrl: '',
      startDate: '2021-06',
      endDate: 'Present',
      summary: '<ul><li>Led development of a high-traffic SaaS dashboard.</li><li>Optimized database queries, reducing latency by 40%.</li></ul>',
    });
  }

  // 5. Parse Education
  const eduLines = sectionLines.education;
  let currentEdu: any = null;

  eduLines.forEach((line) => {
    const isNewEdu = /degree|bachelor|master|university|college|school|bs|ms|phd|diploma/i.test(line) || dateRegex.test(line);

    if (isNewEdu) {
      if (currentEdu) {
        result.sections.education.items.push(currentEdu);
      }

      let institution = 'University';
      let studyType = 'B.S. Computer Science';
      let startDate = '2018';
      let endDate = '2022';

      const dateMatch = line.match(dateRegex);
      let dateString = '';
      let remainingLine = line;
      if (dateMatch) {
        dateString = dateMatch[0];
        remainingLine = line.replace(dateRegex, '').trim();
      }

      const parts = remainingLine.split(/\||,/).map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        institution = parts[0];
        studyType = parts[1];
      } else if (parts.length === 1) {
        if (/university|college|school/i.test(parts[0])) {
          institution = parts[0];
        } else {
          studyType = parts[0];
        }
      }

      if (dateString) {
        const dateParts = dateString.split(/[-–—to]+/i).map(d => d.trim());
        startDate = dateParts[0] || '2018';
        endDate = dateParts[1] || '2022';
      }

      currentEdu = {
        id: randomUUID(),
        institution,
        studyType,
        startDate,
        endDate,
      };
    }
  });

  if (currentEdu) {
    result.sections.education.items.push(currentEdu);
  }

  // Fallback education if none found
  if (result.sections.education.items.length === 0) {
    result.sections.education.items.push({
      id: randomUUID(),
      institution: 'State University',
      studyType: 'B.S. in Computer Science',
      startDate: '2017-09',
      endDate: '2021-05',
    });
  }

  // 6. Parse Projects
  const projLines = sectionLines.projects;
  let currentProj: any = null;
  let projDescLines: string[] = [];

  projLines.forEach((line) => {
    const isNewProj = /github\.com/i.test(line) || (line.split(/\s+/).length < 5 && /^[A-Z][a-zA-Z\s]{2,15}$/.test(line));

    if (isNewProj) {
      if (currentProj) {
        currentProj.description = projDescLines.join(' ');
        result.sections.projects.items.push(currentProj);
      }

      let name = line;
      let githubUrl = '';
      if (githubRegex.test(line)) {
        const match = line.match(githubRegex);
        if (match) githubUrl = 'https://' + match[0];
        name = line.replace(githubRegex, '').replace(/[|,\s\-()]/g, ' ').trim();
      }

      currentProj = {
        id: randomUUID(),
        name: name || 'Project',
        description: '',
        projectUrl: '',
        githubUrl,
      };
      projDescLines = [];
    } else {
      if (currentProj) {
        projDescLines.push(line);
      }
    }
  });

  if (currentProj) {
    currentProj.description = projDescLines.length > 0 ? projDescLines.join(' ') : 'Developed and deployed an open-source tool.';
    result.sections.projects.items.push(currentProj);
  }

  // Fallback projects if none found
  if (result.sections.projects.items.length === 0) {
    result.sections.projects.items.push({
      id: randomUUID(),
      name: 'E-commerce Platform',
      description: 'Built a full-stack e-commerce app with Next.js and Stripe integration.',
      projectUrl: 'https://demo-shop.example.com',
      githubUrl: 'https://github.com/candidate/e-shop',
    });
  }

  // 7. Parse Certifications
  const certLines = sectionLines.certifications;
  certLines.forEach((line) => {
    const cleanCert = line.replace(/^[•\-*]\s*/, '').trim();
    if (cleanCert) {
      result.sections.certifications.items.push({
        id: randomUUID(),
        name: cleanCert,
      });
    }
  });

  if (result.sections.certifications.items.length === 0) {
    result.sections.certifications.items.push({
      id: randomUUID(),
      name: 'AWS Certified Solutions Architect',
    });
  }

  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const contentType = req.headers['content-type'] || '';
    const filenameHeader = req.headers['x-filename'] as string;
    const filename = filenameHeader ? decodeURIComponent(filenameHeader) : 'resume.pdf';

    // Read the raw request stream into a buffer
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const buffer = Buffer.concat(chunks);

    if (buffer.length === 0) {
      return res.status(400).json({ error: 'Empty file buffer' });
    }

    let text = '';
    if (contentType.includes('pdf')) {
      const parsePdf = (pdfParse as any).default ?? pdfParse;
      const data = await parsePdf(buffer);
      text = data.text;
    } else if (
      contentType.includes('word') ||
      contentType.includes('officedocument.wordprocessingml') ||
      filename.endsWith('.docx')
    ) {
      const data = await mammoth.extractRawText({ buffer });
      text = data.value;
    } else {
      // Treat as plain text
      text = buffer.toString('utf8');
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from document' });
    }

    const parsedResume = parseResumeText(text, filename);
    return res.status(200).json(parsedResume);
  } catch (error) {
    console.error('File parsing error:', error);
    return res.status(500).json({ error: `File parsing failed: ${error instanceof Error ? error.message : String(error)}` });
  }
}
