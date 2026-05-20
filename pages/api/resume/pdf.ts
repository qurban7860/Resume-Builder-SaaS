import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import { renderResumeHTML } from '@/lib/pdfTemplate';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { resume, filename } = req.body;

    if (!resume) {
      return res.status(400).json({ error: 'Resume payload required' });
    }

    const html = renderResumeHTML(resume);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Set viewport for A4 size
    await page.setViewport({
      width: Math.round(210 * 3.78),
      height: Math.round(297 * 3.78),
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename || 'resume.pdf'}"`
    );

    return res.send(pdf);
  } catch (error) {
    console.error('PDF generation error:', error);
    return res.status(500).json({ error: 'PDF generation failed' });
  }
}
