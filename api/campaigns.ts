import { Campaign } from '@/types/campaign.types';

// In-memory storage for mock campaigns (persists during session)
let mockCampaigns: Campaign[] = [
  {
    id: 'campaign-1',
    name: 'Welcome Journey',
    userId: '123',
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
        contentItems: [
          { type: 'TEXT_SNIPPET', id: 'ts-1', width: 280 },
          { type: 'QUESTION', id: 'q-2', width: 280 }
        ],
        logic: [
          { questionId: 'q-2', optionValue: 'Technology', nextStepId: 'step-2' }
        ]
      },
      {
        id: 'step-2',
        name: 'Technology Path',
        backgroundAssetId: 'img-1',
        contentContainerStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderColor: '#ffffff',
          borderWidth: 1,
          textColor: '#ffffff',
        },
        contentItems: [],
        logic: [],
      },
    ],
    lastModified: new Date('2023-10-26T10:00:00Z').toISOString(),
    status: 'active',
  },
  {
    id: 'campaign-2',
    name: 'New User Onboarding',
    userId: '123',
    steps: [
      {
        id: 'c2-step-1',
        name: 'Get Started',
        backgroundAssetId: null,
        contentContainerStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#3b82f6',
          borderWidth: 3,
          textColor: '#1f2937',
        },
        contentItems: [{ type: 'TEXT_SNIPPET', id: 'ts-1', width: 280 }],
        logic: []
      }
    ],
    lastModified: new Date('2023-10-27T11:30:00Z').toISOString(),
    status: 'inactive',
  }
];

// Mock API functions - replace with actual API calls
export const campaignApi = {
  // Fetch all campaigns
  async getCampaigns(): Promise<Campaign[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return [...mockCampaigns];
  },

  // Fetch single campaign
  async getCampaign(id: string): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const campaigns = await this.getCampaigns();
    const campaign = campaigns.find(c => c.id === id);

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

    // Add to mock storage
    mockCampaigns.push(newCampaign);

    return newCampaign;
  },

  // Update campaign
  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const campaignIndex = mockCampaigns.findIndex(c => c.id === id);
    if (campaignIndex === -1) {
      throw new Error('Campaign not found');
    }

    const updatedCampaign: Campaign = {
      ...mockCampaigns[campaignIndex],
      ...updates,
      lastModified: new Date().toISOString(),
    };

    // Update in mock storage
    mockCampaigns[campaignIndex] = updatedCampaign;

    return updatedCampaign;
  },

  // Delete campaign
  async deleteCampaign(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const campaignIndex = mockCampaigns.findIndex(c => c.id === id);
    if (campaignIndex !== -1) {
      // Remove from mock storage
      mockCampaigns.splice(campaignIndex, 1);
    }
  },

  // Update campaign status
  async updateCampaignStatus(id: string, status: 'active' | 'inactive'): Promise<Campaign> {
    return this.updateCampaign(id, { status });
  },
};
