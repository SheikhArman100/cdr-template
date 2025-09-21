'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ImageAsset, Question, QuestionType, TextSnippet, ButtonContent } from '@/types/campaign.types';
import { ArrowLeftIcon, DocumentTextIcon, PencilIcon, CheckIcon, SaveIcon, RefreshCwIcon } from '@/components/icons';
import { CampaignLeftPanel } from '@/components/CampaignLeftPanel';
import { Canvas } from '@/components/Canvas';
import { InspectorPanel } from '@/components/InspectorPanel';
import { useCampaign, useUpdateCampaign, useUpdateCampaignStatus } from '@/hooks/useCampaigns';
import { useCampaignStore } from '@/stores/campaignStore';
import { ScreenLoader } from '@/components/screen-loader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const initialImageAssets: ImageAsset[] = [
  { id: 'img-1', name: 'Mountain View', url: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2070&auto=format&fit=crop' },
  { id: 'img-2', name: 'Desert Dunes', url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=2070&auto=format&fit=crop' },
];

const initialQuestions: Question[] = [
  { id: 'q-1', text: 'What is your name?', type: QuestionType.TEXT, placeholder: 'Enter your full name' },
  { id: 'q-2', text: 'Which topic are you interested in?', type: QuestionType.DROPDOWN, options: ['Technology', 'Health', 'Science'] },
  { id: 'q-3', text: 'What is your date of birth?', type: QuestionType.DATE },
  { id: 'q-4', text: 'Please provide your signature', type: QuestionType.SIGN, placeholder: 'Sign here' },
];

const initialTextSnippets: TextSnippet[] = [
  { id: 'ts-1', name: 'Welcome Message', text: 'Welcome to our campaign!' },
  { id: 'ts-2', name: 'Thank You', text: 'Thank you for your submission.' },
];

const initialButtons: ButtonContent[] = [
  { id: 'btn-signin', text: 'Sign In', isDefault: true },
  { id: 'btn-next', text: 'Next', isDefault: true },
  { id: 'btn-prev', text: 'Prev', isDefault: true },
];





export default function CampaignDetail() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.campaignId as string;

  const { data: campaign, isLoading, error } = useCampaign(campaignId);
  const updateCampaignMutation = useUpdateCampaign();
  const {
    currentCampaign,
    setCurrentCampaign,
    addStep,
    deleteStep,
    updateStepName,
    updateStyle,
    setBackground,
    addContent,
    removeContent,
    reorderContent,
    resizeContent,
  } = useCampaignStore();

  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Global assets (could also be moved to store if needed)
  const [imageAssets, setImageAssets] = useState<ImageAsset[]>(initialImageAssets);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [textSnippets, setTextSnippets] = useState<TextSnippet[]>(initialTextSnippets);
  const [buttons, setButtons] = useState<ButtonContent[]>(initialButtons);

  // Load campaign data when fetched or when campaignId changes
  useEffect(() => {
    if (campaign && (!currentCampaign || currentCampaign.id !== campaign.id)) {
      console.log('Loading campaign data:', campaign);
      console.log('Campaign steps:', campaign.steps);
      console.log('Campaign textSnippets:', campaign.textSnippets);

      setCurrentCampaign(campaign);

      // Load assets from campaign if available
      if (campaign.imageAssets) {
        console.log('Loading imageAssets:', campaign.imageAssets);
        setImageAssets(campaign.imageAssets);
      }
      if (campaign.questions) {
        console.log('Loading questions:', campaign.questions);
        setQuestions(campaign.questions);
      }
      if (campaign.textSnippets) {
        console.log('Loading textSnippets:', campaign.textSnippets);
        setTextSnippets(campaign.textSnippets);
      }
      if (campaign.buttons) {
        console.log('Loading buttons:', campaign.buttons);
        setButtons(campaign.buttons);
      }

      setSelectedStepId(campaign.steps[0]?.id || null);
    }
  }, [campaign, campaignId, currentCampaign?.id, setCurrentCampaign]);

  // No auto-save - only manual save via button

  const selectedStep = currentCampaign?.steps.find(step => step.id === selectedStepId) || undefined;

  const handleBackToList = useCallback(() => {
    router.push('/campaign');
  }, [router]);

  const handleSelectStep = useCallback((id: string) => {
    setSelectedStepId(id);
  }, []);

  const handleAddImageAsset = useCallback((asset: ImageAsset) => {
    setImageAssets(prev => [...prev, asset]);
  }, []);

  const handleRemoveImageAsset = useCallback((assetId: string) => {
    setImageAssets(prev => prev.filter(asset => asset.id !== assetId));
  }, []);

  const handleAddQuestion = useCallback((question: Question) => {
    setQuestions(prev => [...prev, question]);
  }, []);

  const handleUpdateQuestion = useCallback((updatedQuestion: Question) => {
    setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  }, []);

  const handleAddTextSnippet = useCallback((snippet: TextSnippet) => {
    setTextSnippets(prev => [...prev, snippet]);
  }, []);

  const handleUpdateTextSnippet = useCallback((updatedSnippet: TextSnippet) => {
    setTextSnippets(prev => prev.map(s => s.id === updatedSnippet.id ? updatedSnippet : s));
  }, []);

  const handleDeleteQuestion = useCallback((questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  }, []);

  const handleDeleteTextSnippet = useCallback((snippetId: string) => {
    setTextSnippets(prev => prev.filter(s => s.id !== snippetId));
  }, []);

  const handleAddButton = useCallback((button: ButtonContent) => {
    setButtons(prev => [...prev, button]);
  }, []);

  const handleUpdateButton = useCallback((updatedButton: ButtonContent) => {
    setButtons(prev => prev.map(b => b.id === updatedButton.id ? updatedButton : b));
  }, []);

  const handleDeleteButton = useCallback((buttonId: string) => {
    setButtons(prev => prev.filter(b => b.id !== buttonId));
  }, []);

  const handleSaveCampaign = useCallback(async () => {
    if (!currentCampaign) return;

    setIsSaving(true);
    try {
      // Add 500ms loading effect
      await new Promise(resolve => setTimeout(resolve, 500));

      // Save campaign via API
      await updateCampaignMutation.mutateAsync({
        id: currentCampaign.id,
        updates: {
          name: currentCampaign.name,
          steps: currentCampaign.steps,
          lastModified: new Date().toISOString(),
          imageAssets,
          questions,
          textSnippets,
          buttons,
        },
      });

      // Show success toast
      toast.success('Campaign saved successfully!', {
        description: `"${currentCampaign.name}" has been updated.`,
      });

      // Update last saved time
      setLastSaved(new Date().toLocaleString());

      // Redirect to campaign list
      router.push('/campaign');
    } catch (error) {
      console.error('Failed to save campaign:', error);
      toast.error('Failed to save campaign', {
        description: 'Please try again or contact support if the problem persists.',
      });
    } finally {
      setIsSaving(false);
    }
  }, [currentCampaign, router, updateCampaignMutation]);

const handleExportToPDF = useCallback(async () => {
  if (!currentCampaign || currentCampaign.steps.length === 0) {
    console.error('No campaign or steps to export');
    toast.error('No campaign steps to export');
    return;
  }

  setIsExporting(true);

  try {
    console.log('🎯 Starting PDF Export Process...');
    console.log('📊 Campaign:', currentCampaign.name);
    console.log('📄 Total Steps:', currentCampaign.steps.length);

    // Create PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Process each step
    for (let i = 0; i < currentCampaign.steps.length; i++) {
      const step = currentCampaign.steps[i];
      console.log(`\n📄 ===== Processing STEP ${i + 1}: ${step.name} =====`);

      // Update the selected step to render the correct content
      setSelectedStepId(step.id);

      // Wait for React to update the UI and styles to apply
      await new Promise(resolve => setTimeout(resolve, 500));

      // Try to find the complete phone mockup container first
      // Look for common phone mockup container classes/IDs
      let targetElement = document.getElementById('campaign-canvas') as HTMLElement;
      
      // Try alternative selectors for phone mockup containers
      const alternativeSelectors = [
        '.phone-mockup',
        '.device-mockup',
        '.mobile-frame',
        '.phone-container',
        '[data-phone-mockup]',
        '.mockup-phone'
      ];
      
      // If campaign-canvas doesn't include the status bar, try to find the parent container
      for (const selector of alternativeSelectors) {
        const altElement = document.querySelector(selector) as HTMLElement;
        if (altElement) {
          // Check if this element contains the status bar elements
          const hasStatusBar = altElement.querySelector('[class*="status"]') || 
                               altElement.textContent?.includes('9:41') ||
                               altElement.textContent?.includes('100%');
          if (hasStatusBar) {
            targetElement = altElement;
            console.log(`📱 Found complete phone mockup: ${selector}`);
            break;
          }
        }
      }

      if (!targetElement) {
        console.error('❌ Target element not found');
        continue;
      }

      // Get the original element's computed styles and dimensions
      const computedStyle = window.getComputedStyle(targetElement);
      const originalRect = targetElement.getBoundingClientRect();

      // Clone the element and apply safe styles
      const clonedElement = targetElement.cloneNode(true) as HTMLElement;
      
      // Preserve the original layout while making it capturable
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

      // Apply fallback styles to all elements in the cloned tree
      const applyFallbackStyles = (element: HTMLElement) => {
        // Preserve important layout properties
        const originalStyle = window.getComputedStyle(element);
        
        // Apply safe colors while preserving layout
        element.style.borderColor = element.style.borderColor || '#e4e4e7';
        element.style.color = element.style.color || '#09090b';
        
        // Ensure visibility of status bar elements
        if (element.textContent?.includes('9:41') || 
            element.textContent?.includes('100%') || 
            element.classList.contains('status-bar') ||
            element.getAttribute('class')?.includes('status')) {
          element.style.visibility = 'visible';
          element.style.opacity = '1';
          element.style.display = originalStyle.display === 'none' ? 'block' : originalStyle.display;
        }

        // Remove any inline styles that might contain problematic functions
        const inlineStyle = element.getAttribute('style');
        if (inlineStyle && (inlineStyle.includes('oklch') || inlineStyle.includes('color-mix'))) {
          element.setAttribute('style', 
            inlineStyle
              .replace(/oklch\([^)]+\)/g, '#e4e4e7')
              .replace(/color-mix\([^)]+\)/g, '#e4e4e7')
          );
        }

        // Recursively apply to children
        Array.from(element.children).forEach(child => {
          applyFallbackStyles(child as HTMLElement);
        });
      };

      applyFallbackStyles(clonedElement);

      // Temporarily add cloned element to body
      document.body.appendChild(clonedElement);

      // Wait a moment for styles to apply
      await new Promise(resolve => setTimeout(resolve, 150));

      // Use html2canvas with enhanced options
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: clonedElement.offsetWidth,
        height: clonedElement.offsetHeight,
        ignoreElements: (element) => {
          // Don't ignore status bar elements
          if (element.textContent?.includes('9:41') || 
              element.textContent?.includes('100%') || 
              element.classList.contains('status-bar')) {
            return false;
          }
          
          // Ignore problematic elements
          const classList = element.classList;
          return classList.contains('group-hover:opacity-100') ||
                 classList.contains('opacity-0') ||
                 element.tagName === 'SCRIPT' ||
                 element.tagName === 'STYLE' ||
                 element.style.visibility === 'hidden';
        },
        onclone: (clonedDoc) => {
          // Additional cleanup on the cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * { 
              border-color: #e4e4e7 !important; 
              color: #09090b !important;
            }
            /* Ensure status bar elements are visible */
            .status-bar,
            [class*="status"],
            [class*="time"],
            [class*="battery"],
            [class*="signal"] {
              visibility: visible !important;
              opacity: 1 !important;
              display: block !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        },
        logging: false
      });

      // Remove cloned element
      document.body.removeChild(clonedElement);

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png', 1.0);

      // Calculate dimensions to fit A4 page with margins
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // 10mm margin
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - (margin * 2);
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Add new page if not the first step
      if (i > 0) {
        pdf.addPage();
      }

      // Add step name above the mobile wireframe
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      const stepNameText = `Step ${i + 1}: ${step.name}`;
      const textWidth = pdf.getTextWidth(stepNameText);
      const textX = (pdfWidth - textWidth) / 2;
      const textY = 20;

      pdf.text(stepNameText, textX, textY);

      // Calculate image positioning
      const imageY = textY + 10;
      const availableHeightForImage = pdfHeight - imageY - 10;
      const imageRatio = Math.min(availableWidth / (imgWidth / 2), availableHeightForImage / (imgHeight / 2));
      const finalImgScaledWidth = (imgWidth / 2) * imageRatio;
      const finalImgScaledHeight = (imgHeight / 2) * imageRatio;
      const finalX = (pdfWidth - finalImgScaledWidth) / 2;
      const finalY = imageY;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', finalX, finalY, finalImgScaledWidth, finalImgScaledHeight);

      console.log(`✅ ===== STEP ${i + 1} added to PDF (${targetElement.id || targetElement.className}) =====\n`);
    }

    // Save the PDF
    const fileName = `${currentCampaign.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_campaign.pdf`;
    pdf.save(fileName);

    console.log('🎉 PDF Export Complete!');
    toast.success('PDF exported successfully!', {
      description: `Downloaded ${fileName}`,
    });

  } catch (error) {
    console.error('❌ Failed to export PDF:', error);
    toast.error('Failed to export PDF', {
      description: 'Please try again or contact support if the problem persists.',
    });
  } finally {
    setIsExporting(false);
  }
}, [currentCampaign]);

  // Wrapper functions for Canvas and InspectorPanel
  const handleRemoveContent = useCallback((index: number) => {
    if (selectedStepId) removeContent(selectedStepId, index);
  }, [selectedStepId, removeContent]);

  const handleReorderContent = useCallback((dragIndex: number, hoverIndex: number) => {
    if (selectedStepId) reorderContent(selectedStepId, dragIndex, hoverIndex);
  }, [selectedStepId, reorderContent]);

  const handleResizeContent = useCallback((index: number, size: { width: number; height: number }) => {
    if (selectedStepId) resizeContent(selectedStepId, index, size);
  }, [selectedStepId, resizeContent]);

  const handleStyleChange = useCallback((style: any) => {
    if (selectedStepId) updateStyle(selectedStepId, style);
  }, [selectedStepId, updateStyle]);

  const handleAddContent = useCallback((item: any) => {
    if (selectedStepId) addContent(selectedStepId, item);
  }, [selectedStepId, addContent]);

  const handleSetBackground = useCallback((assetId: string | null) => {
    if (selectedStepId) {
      setBackground(selectedStepId, assetId);
    }
  }, [selectedStepId, setBackground]);

  const handleCampaignNameChange = useCallback((newName: string) => {
    if (currentCampaign) {
      setCurrentCampaign({
        ...currentCampaign,
        name: newName,
        lastModified: new Date().toISOString(),
      });
    }
  }, [currentCampaign, setCurrentCampaign]);

  if (isLoading) {
    return (
      <ScreenLoader title='Loading campaign'/>
    );
  }

  if (error || !currentCampaign) {
    return (
      <div className="flex flex-col flex-1 h-[calc(100vh-var(--header-height))]">
        <div className="flex items-center justify-center h-full">
          <div className="text-lg text-destructive">Error loading campaign</div>
        </div>
      </div>
    );
  }

  // Editable Campaign Name Component
  const EditableCampaignName: React.FC<{ name: string; onNameChange: (name: string) => void }> = ({ name, onNameChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(name);

    const handleSave = () => {
      if (editName.trim()) {
        onNameChange(editName.trim());
      }
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditName(name);
      setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSave();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    };

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="text-xl font-bold text-foreground bg-background border-border"
            autoFocus
          />
          <Button
            onClick={handleSave}
            variant="ghost"
            size="icon"
            className="text-primary hover:text-primary/80"
          >
            <CheckIcon className="w-5 h-5" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditing(true)}>
        <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {name}
        </h1>
        <PencilIcon className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-var(--header-height)-40px)] ">
      <header className="bg-card border-b border-border p-2 flex items-center justify-between z-30  shrink-0">
        <div className="flex items-center">
          <Button
            onClick={handleBackToList}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
           <span className='hidden lg:block'>Back to Campaigns</span> 
          </Button>
          <div className="w-px h-6 bg-border mx-2"></div>
          <div>
            <EditableCampaignName name={currentCampaign.name} onNameChange={handleCampaignNameChange} />
            <p className="text-xs text-muted-foreground">Editing Campaign</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSaveCampaign}
            disabled={isSaving}
            variant="primary"
            size="sm"
            className="disabled:bg-muted"
          >
            {isSaving ? (
              <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <SaveIcon className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Campaign'}
          </Button>
          <Button
            onClick={handleExportToPDF}
            disabled={isExporting}
            variant="outline"
            size="sm"
            className="disabled:bg-muted"
          >
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>
      </header>
      <main className="flex flex-1 min-h-0">
        <CampaignLeftPanel
          steps={currentCampaign.steps}
          selectedStepId={selectedStepId}
          onSelectStep={handleSelectStep}
          onAddStep={addStep}
          onDeleteStep={deleteStep}
          onUpdateStepName={updateStepName}
        />
        <Canvas
          step={selectedStep}
          imageAssets={imageAssets}
          questions={questions}
          textSnippets={textSnippets}
          buttons={buttons}
          onRemoveContent={handleRemoveContent}
          onReorderContent={handleReorderContent}
          onResizeContent={handleResizeContent}
        />
        <InspectorPanel
          selectedStep={selectedStep}
          imageAssets={imageAssets}
          questions={questions}
          textSnippets={textSnippets}
          buttons={buttons}
          onStyleChange={handleStyleChange}
          onAddContent={handleAddContent}
          onSetBackground={handleSetBackground}
          onAddImageAsset={handleAddImageAsset}
          onRemoveImageAsset={handleRemoveImageAsset}
          onAddQuestion={handleAddQuestion}
          onUpdateQuestion={handleUpdateQuestion}
          onDeleteQuestion={handleDeleteQuestion}
          onAddTextSnippet={handleAddTextSnippet}
          onUpdateTextSnippet={handleUpdateTextSnippet}
          onDeleteTextSnippet={handleDeleteTextSnippet}
          onAddButton={handleAddButton}
          onUpdateButton={handleUpdateButton}
          onDeleteButton={handleDeleteButton}
        />
      </main>
    </div>
  );
}
