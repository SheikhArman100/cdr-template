import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Campaign, Step, ContentItem, ContentContainerStyle } from '@/types/campaign.types';

interface CampaignState {
  // Current campaign being edited
  currentCampaign: Campaign | null;
  setCurrentCampaign: (campaign: Campaign | null) => void;

  // Draft campaigns (for creation)
  draftCampaigns: Campaign[];
  saveDraftCampaign: (campaign: Campaign) => void;
  getDraftCampaign: (id: string) => Campaign | undefined;
  removeDraftCampaign: (id: string) => void;

  // Campaign editing actions
  updateCampaignName: (name: string) => void;
  updateCampaignSteps: (steps: Step[]) => void;
  updateStep: (stepId: string, updates: Partial<Step>) => void;
  addStep: () => void;
  deleteStep: (stepId: string) => void;
  updateStepName: (stepId: string, name: string) => void;
  updateStyle: (stepId: string, style: Partial<ContentContainerStyle>) => void;
  setBackground: (stepId: string, assetId: string) => void;
  addContent: (stepId: string, item: Omit<ContentItem, 'width' | 'height'>) => void;
  removeContent: (stepId: string, index: number) => void;
  reorderContent: (stepId: string, dragIndex: number, hoverIndex: number) => void;
  resizeContent: (stepId: string, index: number, size: { width: number; height: number }) => void;
  updateLogic: (stepId: string, questionId: string, optionValue: string, nextStepId: string | null) => void;

  // Reset current campaign
  resetCurrentCampaign: () => void;
}

const createNewCampaign = (): Campaign => ({
  id: `campaign-${Date.now()}`,
  name: 'New Campaign',
  userId: '123',
  status: 'inactive',
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
});

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      currentCampaign: null,
      draftCampaigns: [],

      setCurrentCampaign: (campaign) => set({ currentCampaign: campaign }),

      saveDraftCampaign: (campaign) =>
        set((state) => ({
          draftCampaigns: [
            ...state.draftCampaigns.filter(c => c.id !== campaign.id),
            { ...campaign, lastModified: new Date().toISOString() }
          ]
        })),

      getDraftCampaign: (id) => get().draftCampaigns.find(c => c.id === id),

      removeDraftCampaign: (id) =>
        set((state) => ({
          draftCampaigns: state.draftCampaigns.filter(c => c.id !== id)
        })),

      updateCampaignName: (name) =>
        set((state) => ({
          currentCampaign: state.currentCampaign
            ? { ...state.currentCampaign, name, lastModified: new Date().toISOString() }
            : null
        })),

      updateCampaignSteps: (steps) =>
        set((state) => ({
          currentCampaign: state.currentCampaign
            ? { ...state.currentCampaign, steps, lastModified: new Date().toISOString() }
            : null
        })),

      updateStep: (stepId, updates) =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const updatedSteps = state.currentCampaign.steps.map(s =>
            s.id === stepId ? { ...s, ...updates } : s
          );
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: updatedSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      addStep: () =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const newStep: Step = {
            id: `step-${Date.now()}`,
            name: `New Step ${state.currentCampaign.steps.length + 1}`,
            backgroundAssetId: null,
            contentContainerStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderColor: '#000000',
              borderWidth: 1,
              textColor: '#000000',
            },
            contentItems: [],
            logic: [],
          };
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: [...state.currentCampaign.steps, newStep],
              lastModified: new Date().toISOString()
            }
          };
        }),

      deleteStep: (stepId) =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const newSteps = state.currentCampaign.steps.filter(step => step.id !== stepId);
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: newSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      updateStepName: (stepId, name) =>
        get().updateStep(stepId, { name }),

      updateStyle: (stepId, style) =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const updatedSteps = state.currentCampaign.steps.map(s =>
            s.id === stepId
              ? { ...s, contentContainerStyle: { ...s.contentContainerStyle, ...style } }
              : s
          );
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: updatedSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      setBackground: (stepId, assetId) =>
        get().updateStep(stepId, { backgroundAssetId: assetId }),

      addContent: (stepId, item) =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const updatedSteps = state.currentCampaign.steps.map(s =>
            s.id === stepId
              ? {
                  ...s,
                  contentItems: [...s.contentItems, { ...item, width: undefined, height: undefined }]
                }
              : s
          );
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: updatedSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      removeContent: (stepId, index) =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const updatedSteps = state.currentCampaign.steps.map(s =>
            s.id === stepId
              ? { ...s, contentItems: s.contentItems.filter((_, i) => i !== index) }
              : s
          );
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: updatedSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      reorderContent: (stepId, dragIndex, hoverIndex) =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const updatedSteps = state.currentCampaign.steps.map(s => {
            if (s.id === stepId) {
              const newItems = [...s.contentItems];
              const [draggedItem] = newItems.splice(dragIndex, 1);
              newItems.splice(hoverIndex, 0, draggedItem);
              return { ...s, contentItems: newItems };
            }
            return s;
          });
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: updatedSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      resizeContent: (stepId, index, size) =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const updatedSteps = state.currentCampaign.steps.map(s => {
            if (s.id === stepId) {
              const newItems = s.contentItems.map((item, i) =>
                i === index ? { ...item, width: size.width, height: size.height } : item
              );
              return { ...s, contentItems: newItems };
            }
            return s;
          });
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: updatedSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      updateLogic: (stepId, questionId, optionValue, nextStepId) =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const updatedSteps = state.currentCampaign.steps.map(s => {
            if (s.id === stepId) {
              const otherLogic = (s.logic || []).filter(l =>
                !(l.questionId === questionId && l.optionValue === optionValue)
              );
              const newLogic = nextStepId
                ? [...otherLogic, { questionId, optionValue, nextStepId }]
                : otherLogic;
              return { ...s, logic: newLogic };
            }
            return s;
          });
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: updatedSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      resetCurrentCampaign: () => set({ currentCampaign: null }),
    }),
    {
      name: 'campaign-store',
      partialize: (state) => ({
        draftCampaigns: state.draftCampaigns,
        currentCampaign: state.currentCampaign,
      }),
    }
  )
);

// Helper functions
export const createCampaign = () => {
  const campaign = createNewCampaign();
  useCampaignStore.getState().setCurrentCampaign(campaign);
  return campaign;
};

export const loadCampaignForEditing = (campaignId: string) => {
  // This would typically fetch from API, but for now we'll use mock data
  const mockCampaign: Campaign = {
    id: campaignId,
    name: 'Loaded Campaign',
    userId: '123',
    status: 'active',
    lastModified: new Date().toISOString(),
    steps: [
      {
        id: 'step-1',
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
  useCampaignStore.getState().setCurrentCampaign(mockCampaign);
  return mockCampaign;
};
