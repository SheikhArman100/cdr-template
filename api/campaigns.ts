import { Campaign } from '@/types/campaign.types';
import { useCampaignsDataStore } from '@/stores/campaignStore';

// Mock API functions - now using Zustand store for persistence
export const campaignApi = {
  // Fetch all campaigns
  async getCampaigns(): Promise<Campaign[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Initialize campaigns if needed
    useCampaignsDataStore.getState().initializeCampaigns();

    return useCampaignsDataStore.getState().getCampaigns();
  },

  // Fetch single campaign
  async getCampaign(id: string): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Initialize campaigns if needed
    useCampaignsDataStore.getState().initializeCampaigns();

    const campaign = useCampaignsDataStore.getState().getCampaign(id);

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    return campaign;
  },

  // Create new campaign
  async createCampaign(campaign: Omit<Campaign, 'id' | 'lastModified'>): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newCampaign: Campaign = {
      ...campaign,
      id: `campaign-${Date.now()}`,
      lastModified: new Date().toISOString(),
    };

    // Ensure userId is correct
    newCampaign.userId = '123'; // Force correct userId

    // Add to store (persists automatically)
    useCampaignsDataStore.getState().addCampaign(newCampaign);

    return newCampaign;
  },

  // Update campaign
  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update in store (persists automatically)
    useCampaignsDataStore.getState().updateCampaign(id, updates);

    const updatedCampaign = useCampaignsDataStore.getState().getCampaign(id);
    if (!updatedCampaign) {
      throw new Error('Campaign not found after update');
    }

    return updatedCampaign;
  },

  // Delete campaign
  async deleteCampaign(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Delete from store (persists automatically)
    useCampaignsDataStore.getState().deleteCampaign(id);
  },

  // Update campaign status
  async updateCampaignStatus(id: string, status: 'active' | 'inactive'): Promise<Campaign> {
    return this.updateCampaign(id, { status });
  },
};
