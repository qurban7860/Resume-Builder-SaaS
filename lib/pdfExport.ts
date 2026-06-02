export async function exportResumeToPDF(_resume: any, filename: string, _templateId: string = 'classic') {
  try {
    const { default: html2pdf } = await import('html2pdf.js');

    // 1) Find the actual rendered resume in the DOM
    const previewElement = document.getElementById('resume-preview');
    if (!previewElement) {
      throw new Error('Resume preview element not found');
    }

    // 2) Clone it to ensure perfect fidelity
    const wrapper = previewElement.cloneNode(true) as HTMLElement;
    
    // Reset transform scale on any elements so it renders at 100% scale (794px width)
    const allElements = wrapper.querySelectorAll('*');
    allElements.forEach((el: any) => {
      if (el.style && el.style.transform && el.style.transform.includes('scale')) {
        el.style.transform = 'none';
        el.style.transformOrigin = 'unset';
        el.style.transition = 'none';
      }
      // Reset shadows, margins, and roundings for print mode
      if (el.classList && (el.classList.contains('shadow-lg') || el.classList.contains('rounded-lg') || el.classList.contains('p-8'))) {
        el.style.boxShadow = 'none';
        el.style.borderRadius = '0';
        el.style.padding = '0';
        el.style.margin = '0';
        el.style.minHeight = 'auto';
      }
    });

    // Make sure the wrapper itself and its immediate children have correct full width
    wrapper.style.width = '794px';
    wrapper.style.margin = '0';
    wrapper.style.padding = '0';
    if (wrapper.firstElementChild) {
      (wrapper.firstElementChild as HTMLElement).style.width = '794px';
      (wrapper.firstElementChild as HTMLElement).style.margin = '0';
      if (wrapper.firstElementChild.firstElementChild) {
        (wrapper.firstElementChild.firstElementChild as HTMLElement).className = 'bg-white w-full';
        (wrapper.firstElementChild.firstElementChild as HTMLElement).style.boxShadow = 'none';
        (wrapper.firstElementChild.firstElementChild as HTMLElement).style.borderRadius = '0';
        (wrapper.firstElementChild.firstElementChild as HTMLElement).style.margin = '0';
        (wrapper.firstElementChild.firstElementChild as HTMLElement).style.padding = '0';
        (wrapper.firstElementChild.firstElementChild as HTMLElement).style.minHeight = 'auto';
      }
    }
    
    // 3) Create a visible but hidden (behind the page) container inside the viewport
    // This ensures html2canvas renders the layout and text correctly
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.zIndex = '-9999';
    container.style.opacity = '1';
    container.style.pointerEvents = 'none';
    container.style.width = '794px';
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
