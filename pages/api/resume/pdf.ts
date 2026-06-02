import type { NextApiRequest, NextApiResponse } from 'next';
import { renderResumeHTML } from '@/lib/pdfTemplate';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { resume, filename, templateId } = req.body;

    if (!resume) {
      return res.status(400).json({ error: 'Resume payload required' });
    }

    const html = renderResumeHTML(resume, templateId || 'classic');

    let browser;

    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      const puppeteerCore = await import('puppeteer-core');
      const chromium = (await import('@sparticuz/chromium-min')).default as any;
      
      const executablePath = await chromium.executablePath(
        'https://github.com/Sparticuz/chromium/releases/download/v119.0.0/chromium-v119.0.0-pack.tar'
      );

      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: executablePath,
        headless: chromium.headless,
      } as any);
    } else {
      const puppeteer = await import('puppeteer');
      browser = await puppeteer.default.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' } as any);

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
    return res.status(500).json({
      error: 'PDF generation failed',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
