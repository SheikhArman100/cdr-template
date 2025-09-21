'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ImageAsset, Question, QuestionType, TextSnippet } from '@/types/campaign.types';
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

const initialImageAssets: ImageAsset[] = [
  { id: 'img-1', name: 'Mountain View', url: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2070&auto=format&fit=crop' },
  { id: 'img-2', name: 'Desert Dunes', url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=2070&auto=format&fit=crop' },
];

const initialQuestions: Question[] = [
  { id: 'q-1', text: 'What is your name?', type: QuestionType.TEXT, placeholder: 'Enter your full name' },
  { id: 'q-2', text: 'Which topic are you interested in?', type: QuestionType.DROPDOWN, options: ['Technology', 'Health', 'Science'] },
  { id: 'q-3', text: 'What is your date of birth?', type: QuestionType.DATE },
];

const initialTextSnippets: TextSnippet[] = [
  { id: 'ts-1', name: 'Welcome Message', text: 'Welcome to our campaign!' },
  { id: 'ts-2', name: 'Thank You', text: 'Thank you for your submission.' },
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
    setIsExporting(true);
    try {
      // Add 500ms loading effect
      await new Promise(resolve => setTimeout(resolve, 500));

      // PDF export logic would go here
      console.log('Exporting campaign to PDF...');
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

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
          onRemoveContent={handleRemoveContent}
          onReorderContent={handleReorderContent}
          onResizeContent={handleResizeContent}
        />
        <InspectorPanel
          selectedStep={selectedStep}
          imageAssets={imageAssets}
          questions={questions}
          textSnippets={textSnippets}
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
        />
      </main>
    </div>
  );
}
