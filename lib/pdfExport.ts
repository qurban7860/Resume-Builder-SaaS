import { renderResumeHTMLBody, pageStyle } from '@/lib/pdfTemplate';

export async function exportResumeToPDF(resume: any, filename: string) {
  try {
    const { default: html2pdf } = await import('html2pdf.js');

    const htmlFragment = renderResumeHTMLBody(resume);
    
    // Create element with styles and resume-container wrapper
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = '-9999px';
    wrapper.style.left = '-9999px';
    wrapper.style.width = '210mm'; // Standard A4 width (793.7px at 96 DPI)
    
    wrapper.innerHTML = `
      <style>${pageStyle}</style>
      <div class="resume-container" style="box-shadow: none; border-radius: 0; padding: 0;">
        ${htmlFragment}
      </div>
    `;
    
    document.body.appendChild(wrapper);

    const options = {
      margin: [10, 10, 10, 10], // 10mm margins
      filename: filename || 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        letterRendering: true
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
