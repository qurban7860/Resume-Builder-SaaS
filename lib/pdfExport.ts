export async function exportResumeToPDF(_resume: any, filename: string, _templateId: string = 'classic') {
  try {
    const { default: html2pdf } = await import('html2pdf.js');

    // 1) Find the actual rendered resume in the DOM
    const previewElement = document.getElementById('resume-preview');
    if (!previewElement) {
      throw new Error('Resume preview element not found');
    }

    // 2) Clone it to ensure perfect fidelity without affecting the live preview
    const clone = previewElement.cloneNode(true) as HTMLElement;
    
    // 3) Create an off-screen container styled with A4 dimensions (794px width)
    const outerWrapper = document.createElement('div');
    outerWrapper.style.position = 'fixed';
    outerWrapper.style.top = '0';
    outerWrapper.style.left = '-9999px'; // Position it completely off-screen to avoid visual disturbance
    outerWrapper.style.width = '794px';
    outerWrapper.style.height = 'auto';
    outerWrapper.style.overflow = 'visible';
    outerWrapper.style.zIndex = '-9999';
    outerWrapper.style.pointerEvents = 'none';

    // The container element inside the outerWrapper
    const container = document.createElement('div');
    container.style.width = '794px';
    container.style.backgroundColor = '#ffffff';
    
    // Append the clone into our container
    container.appendChild(clone);
    outerWrapper.appendChild(container);
    document.body.appendChild(outerWrapper);

    const options = {
      margin: 0, // Margin is already built into the template/renderer via '8mm 10mm' padding
      filename: filename || 'resume.pdf',
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 2, // High resolution scaling
        useCORS: true, 
        logging: false,
        letterRendering: true,
        width: 794,
        windowWidth: 794,
      },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    // Run export on the container element
    await html2pdf().set(options).from(container).save();
    
    // Cleanup
    document.body.removeChild(outerWrapper);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
}

