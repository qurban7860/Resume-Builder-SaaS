import { renderResumeHTML } from '@/lib/pdfTemplate';

export async function exportResumeToPDF(resume: any, filename: string, templateId: string = 'classic') {
  try {
    const { default: html2pdf } = await import('html2pdf.js');

    const html = renderResumeHTML(resume, templateId);
    
    // Create element with styles and resume-container wrapper
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = '-9999px';
    wrapper.style.left = '-9999px';
    wrapper.style.width = '210mm'; // Standard A4 width (793.7px at 96 DPI)
    
    wrapper.innerHTML = html;
    
    document.body.appendChild(wrapper);

    const options = {
      margin: [8, 10, 8, 10], // 8mm top/bottom, 10mm left/right — matches @page CSS margins
      filename: filename || 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        letterRendering: true,
        windowWidth: 794, // A4 at 96 DPI
      },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };

    await html2pdf().set(options).from(wrapper).save();
    document.body.removeChild(wrapper);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
}
