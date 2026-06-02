import { renderResumeHTML } from '@/lib/pdfTemplate';

export async function exportResumeToPDF(resume: any, filename: string, templateId: string = 'classic') {
  try {
    const { default: html2pdf } = await import('html2pdf.js');

    // 1) Find the actual rendered resume in the DOM
    const previewElement = document.getElementById('resume-preview');
    if (!previewElement) {
      throw new Error('Resume preview element not found');
    }

    // 2) Clone it to ensure perfect fidelity
    const wrapper = previewElement.cloneNode(true) as HTMLElement;
    
    // We remove the inner padding on the clone so html2pdf can apply it as page margins
    // The first child is the ResumeRenderer root div which has the padding
    const innerContainer = wrapper.firstElementChild as HTMLElement;
    if (innerContainer) {
      innerContainer.style.padding = '0';
      innerContainer.style.minHeight = 'auto'; // let html2pdf calculate height natively
    }
    
    // 3) Create an off-screen container for the clone
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.width = '210mm'; // Standard A4 width (793.7px at 96 DPI)
    container.style.backgroundColor = '#ffffff';
    
    container.appendChild(wrapper);
    document.body.appendChild(container);

    const options = {
      margin: [8, 10, 8, 10], // Apply margins natively across all pages
      filename: filename || 'resume.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        letterRendering: true,
        windowWidth: 794,
      },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    await html2pdf().set(options).from(container).save();
    
    // Cleanup
    document.body.removeChild(container);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
}
