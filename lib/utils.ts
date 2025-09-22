import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

interface CampaignStep {
  id: string;
  name: string;
}

interface Campaign {
  id: string;
  name: string;
  steps: CampaignStep[];
}

export async function exportCampaignToPDF(
  campaign: Campaign,
  setSelectedStepId: (id: string) => void
): Promise<void> {
  if (!campaign || campaign.steps.length === 0) {
    throw new Error('No campaign or steps to export');
  }

  // Create PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Process each step
  for (let i = 0; i < campaign.steps.length; i++) {
    const step = campaign.steps[i];

    // Update the selected step to render the correct content
    setSelectedStepId(step.id);

    // Wait for React to update the UI and styles to apply
    await new Promise(resolve => setTimeout(resolve, 500));

    let targetElement = document.getElementById('campaign-canvas') as HTMLElement;
    
    const alternativeSelectors = [
      '.phone-mockup',
      '.device-mockup',
      '.mobile-frame',
      '.phone-container',
      '[data-phone-mockup]',
      '.mockup-phone'
    ];
    
    for (const selector of alternativeSelectors) {
      const altElement = document.querySelector(selector) as HTMLElement;
      if (altElement) {
        const hasStatusBar = altElement.querySelector('[class*="status"]') || 
                            altElement.textContent?.includes('9:41') ||
                            altElement.textContent?.includes('100%');
        if (hasStatusBar) {
          targetElement = altElement;
          break;
        }
      }
    }

    if (!targetElement) {
      continue;
    }

    const computedStyle = window.getComputedStyle(targetElement);
    const originalRect = targetElement.getBoundingClientRect();
    const clonedElement = targetElement.cloneNode(true) as HTMLElement;
    
    clonedElement.style.cssText = `
      position: absolute !important;
      left: -9999px !important;
      top: -9999px !important;
      width: ${originalRect.width}px !important;
      height: ${originalRect.height}px !important;
      transform: none !important;
      background: ${computedStyle.backgroundColor || '#ffffff'} !important;
      overflow: visible !important;
      z-index: -1 !important;
      box-sizing: border-box !important;
      margin: 0 !important;
      padding: ${computedStyle.padding} !important;
    `;

    const applyFallbackStyles = (element: HTMLElement) => {
      const originalStyle = window.getComputedStyle(element);
      
      element.style.borderColor = element.style.borderColor || '#e4e4e7';
      element.style.color = element.style.color || '#09090b';
      
      if (element.textContent?.includes('9:41') || 
          element.textContent?.includes('100%') || 
          element.classList.contains('status-bar') ||
          element.getAttribute('class')?.includes('status')) {
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        element.style.display = originalStyle.display === 'none' ? 'block' : originalStyle.display;
      }

      const inlineStyle = element.getAttribute('style');
      if (inlineStyle && (inlineStyle.includes('oklch') || inlineStyle.includes('color-mix'))) {
        element.setAttribute('style', 
          inlineStyle
            .replace(/oklch\([^)]+\)/g, '#e4e4e7')
            .replace(/color-mix\([^)]+\)/g, '#e4e4e7')
        );
      }

      Array.from(element.children).forEach(child => {
        applyFallbackStyles(child as HTMLElement);
      });
    };

    applyFallbackStyles(clonedElement);
    document.body.appendChild(clonedElement);
    await new Promise(resolve => setTimeout(resolve, 150));

    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: clonedElement.offsetWidth,
      height: clonedElement.offsetHeight,
      ignoreElements: (element) => {
        if (element.textContent?.includes('9:41') || 
            element.textContent?.includes('100%') || 
            element.classList.contains('status-bar')) {
          return false;
        }
        
        const classList = element.classList;
        return classList.contains('group-hover:opacity-100') ||
               classList.contains('opacity-0') ||
               element.tagName === 'SCRIPT' ||
               element.tagName === 'STYLE' ||
               element.style.visibility === 'hidden';
      },
      onclone: (clonedDoc) => {
        const style = clonedDoc.createElement('style');
        style.textContent = `
          * {
            border-color: #e4e4e7 !important;
            color: #09090b !important;
          }
          .status-bar,
          [class*="status"],
          [class*="time"],
          [class*="battery"],
          [class*="signal"] {
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
          }

          /* Override all component colors for PDF export */
          [data-radix-calendar],
          [data-radix-calendar] *,
          [data-slot="datefield"],
          [data-slot="datefield"] *,
          [data-slot="input"],
          [data-slot="input"] *,
          [data-slot="select"],
          [data-slot="select"] *,
          [data-slot="select-trigger"],
          [data-slot="select-trigger"] *,
          [data-slot="select-content"],
          [data-slot="select-content"] *,
          [data-slot="select-item"],
          [data-slot="select-item"] *,
          [data-slot="input-addon"],
          [data-slot="input-addon"] *,
          [role="group"][aria-label],
          [role="group"][aria-label] *,
          [data-segment],
          [data-segment]:focus,
          [data-segment]:hover,
          [data-placeholder],
          [data-placeholder]:focus,
          [data-placeholder]:hover {
            border-color: #e4e4e7 !important;
            background-color: #ffffff !important;
            color: #09090b !important;
            fill: #09090b !important;
            stroke: #e4e4e7 !important;
            outline: none !important;
            box-shadow: none !important;
          }

          /* Ensure all input elements use safe colors */
          input,
          input:focus,
          input:hover,
          select,
          select:focus,
          select:hover,
          input[type="date"],
          input[type="date"]:focus,
          input[type="date"]:hover {
            border-color: #e4e4e7 !important;
            background-color: #ffffff !important;
            color: #09090b !important;
          }
        `;
        clonedDoc.head.appendChild(style);
      },
      logging: false
    });

    document.body.removeChild(clonedElement);

    const imgData = canvas.toDataURL('image/png', 1.0);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const availableWidth = pdfWidth - (margin * 2);
    const availableHeight = pdfHeight - (margin * 2);
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    if (i > 0) {
      pdf.addPage();
    }

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    const stepNameText = `Step ${i + 1}: ${step.name}`;
    const textWidth = pdf.getTextWidth(stepNameText);
    const textX = (pdfWidth - textWidth) / 2;
    const textY = 20;

    pdf.text(stepNameText, textX, textY);

    const imageY = textY + 10;
    const availableHeightForImage = pdfHeight - imageY - 10;
    const imageRatio = Math.min(availableWidth / (imgWidth / 2), availableHeightForImage / (imgHeight / 2));
    const finalImgScaledWidth = (imgWidth / 2) * imageRatio;
    const finalImgScaledHeight = (imgHeight / 2) * imageRatio;
    const finalX = (pdfWidth - finalImgScaledWidth) / 2;
    const finalY = imageY;

    pdf.addImage(imgData, 'PNG', finalX, finalY, finalImgScaledWidth, finalImgScaledHeight);
  }

  const fileName = `${campaign.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_campaign.pdf`;
  pdf.save(fileName);
  return;
}
