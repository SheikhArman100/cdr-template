'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageAsset, Question, QuestionType, TextSnippet } from '@/types/campaign.types';
import { ArrowLeftIcon, DocumentTextIcon, PencilIcon, CheckIcon } from '@/components/icons';
import { CampaignLeftPanel } from '@/components/CampaignLeftPanel';
import { Canvas } from '@/components/Canvas';
import { InspectorPanel } from '@/components/InspectorPanel';
import { useCampaignStore } from '@/stores/campaignStore';
import { useCreateCampaign } from '@/hooks/useCampaigns';
import { ScreenLoader } from '@/components/screen-loader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

export default function CreateCampaign() {
  const router = useRouter();
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
    draftCampaigns,
    saveDraftCampaign,
  } = useCampaignStore();

  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showDraftRecovery, setShowDraftRecovery] = useState(false);

  // Global assets (could also be moved to store if needed)
  const [imageAssets, setImageAssets] = useState<ImageAsset[]>(initialImageAssets);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [textSnippets, setTextSnippets] = useState<TextSnippet[]>(initialTextSnippets);

  // Check for existing drafts on mount
  useEffect(() => {
    if (draftCampaigns.length > 0 && !currentCampaign) {
      setShowDraftRecovery(true);
    } else if (!currentCampaign) {
      // Create new campaign if no drafts
      const newCampaign = {
        id: `campaign-${Date.now()}`,
        name: 'New Campaign',
        userId: '123',
        status: 'inactive' as const,
        lastModified: new Date().toISOString(),
        steps: [
          {
            id: `step-${Date.now()}`,
            name: 'Welcome Screen',
            backgroundAssetId: null,
            contentContainerStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderColor: '#000000',
              borderWidth: 2,
              textColor: '#000000',
            },
            contentItems: [],
            logic: [],
          },
        ],
      };
      setCurrentCampaign(newCampaign);
    }
  }, [draftCampaigns, currentCampaign, setCurrentCampaign]);

  // Set selected step when campaign changes
  useEffect(() => {
    if (currentCampaign && !selectedStepId) {
      setSelectedStepId(currentCampaign.steps[0]?.id || null);
    }
  }, [currentCampaign, selectedStepId]);

  // Auto-save drafts
  useEffect(() => {
    if (currentCampaign) {
      const timeoutId = setTimeout(() => {
        saveDraftCampaign(currentCampaign);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [currentCampaign, saveDraftCampaign]);

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

  const handleExportToPDF = useCallback(async () => {
    // PDF export logic would go here
    console.log('Exporting campaign to PDF...');
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

  const handleSetBackground = useCallback((assetId: string) => {
    if (selectedStepId) setBackground(selectedStepId, assetId);
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



  // Draft recovery UI
  if (showDraftRecovery) {
    return (
      <div className="flex flex-col flex-1 h-[calc(100vh-var(--header-height))] bg-background">
        <div className="flex items-center justify-center h-full">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-3">Resume Your Work</h2>
            <p className="text-muted-foreground mb-4">
              We found an unfinished campaign draft. Would you like to continue working on it?
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  const latestDraft = draftCampaigns[draftCampaigns.length - 1];
                  setCurrentCampaign(latestDraft);
                  setShowDraftRecovery(false);
                }}
                className="w-full"
                variant="primary"
              >
                Resume Draft
              </Button>
              <Button
                onClick={() => {
                  setShowDraftRecovery(false);
                  // This will trigger the useEffect to create a new campaign
                  setCurrentCampaign(null);
                }}
                className="w-full"
                variant="secondary"
              >
                Start New Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCampaign) {
    return (
      <ScreenLoader title='Loading template'/>
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
    <div className="flex flex-col flex-1 h-[calc(100vh-var(--header-height)-40px)] shadow-sm  rounded-lg">
      <header className="bg-card border-b border-border p-2 flex items-center justify-between z-30  shrink-0">
        <div className="flex items-center">
          <Button
            onClick={handleBackToList}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Campaigns
          </Button>
          <div className="w-px h-6 bg-border mx-2"></div>
          <div>
            <EditableCampaignName name={currentCampaign.name} onNameChange={handleCampaignNameChange} />
            <p className="text-xs text-muted-foreground">Creating New Campaign</p>
          </div>
        </div>
        <Button
          onClick={handleExportToPDF}
          disabled={isExporting}
          variant="primary"
          size="sm"
          className="disabled:bg-muted"
        >
          <DocumentTextIcon className="w-5 h-5 mr-2" />
          {isExporting ? 'Exporting...' : 'Export to PDF'}
        </Button>
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
          onAddQuestion={handleAddQuestion}
          onUpdateQuestion={handleUpdateQuestion}
          onAddTextSnippet={handleAddTextSnippet}
          onUpdateTextSnippet={handleUpdateTextSnippet}
        />
      </main>
    </div>
  );
}
