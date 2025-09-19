'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { useCampaignStore, createCampaign } from '@/stores/campaignStore';
import { useCreateCampaign } from '@/hooks/useCampaigns';
import { ScreenLoader } from '@/components/screen-loader';

export default function CreateCampaign() {
  const router = useRouter();
  const { currentCampaign, updateCampaignName, addStep, updateStepName, deleteStep } = useCampaignStore();
  const createCampaignMutation = useCreateCampaign();

  const [campaignName, setCampaignName] = useState(currentCampaign?.name || 'New Campaign');

  const handleCreateCampaign = () => {
    const newCampaign = createCampaign();
    setCampaignName(newCampaign.name);
  };

  const handleSaveCampaign = () => {
    if (!currentCampaign) return;

    // Update the campaign name
    updateCampaignName(campaignName);

    // Here you would typically save to the API
    createCampaignMutation.mutate({
      ...currentCampaign,
      name: campaignName,
    }, {
      onSuccess: () => {
        router.push('/campaign');
      }
    });
  };

  const handleAddStep = () => {
    addStep();
  };

  const handleStepNameChange = (stepId: string, name: string) => {
    updateStepName(stepId, name);
  };

  const handleDeleteStep = (stepId: string) => {
    deleteStep(stepId);
  };

  // Initialize campaign if not exists
  if (!currentCampaign) {
    handleCreateCampaign();
    return <ScreenLoader title="Loading campaigns" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/campaign">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
            <p className="text-muted-foreground">Build your marketing campaign flow</p>
          </div>
        </div>
        <Button onClick={handleSaveCampaign} disabled={createCampaignMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {createCampaignMutation.isPending ? 'Saving...' : 'Save Campaign'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>Configure the basic information for your campaign</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input
              id="campaign-name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="Enter campaign name"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">Status: Draft</Badge>
            <Badge variant="outline">{currentCampaign.steps.length} Steps</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaign Steps</CardTitle>
              <CardDescription>Define the flow of your campaign</CardDescription>
            </div>
            <Button onClick={handleAddStep} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentCampaign.steps.map((step, index) => (
              <Card key={step.id} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <Input
                          value={step.name}
                          onChange={(e) => handleStepNameChange(step.id, e.target.value)}
                          className="text-lg font-medium border-none p-0 h-auto focus-visible:ring-0"
                        />
                        <p className="text-sm text-muted-foreground">Step {index + 1}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteStep(step.id)}
                      disabled={currentCampaign.steps.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Content Items</Label>
                      <div className="mt-2 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center text-muted-foreground">
                        {step.contentItems.length === 0 ? (
                          <p>Drag content items here or click to add</p>
                        ) : (
                          <div className="space-y-2">
                            {step.contentItems.map((item, itemIndex) => (
                              <div key={itemIndex} className="p-2 bg-muted rounded text-sm">
                                {item.type === 'TEXT_SNIPPET' ? 'Text Snippet' : 'Question'}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Background Color</Label>
                        <Input
                          value={step.contentContainerStyle.backgroundColor}
                          onChange={(e) => {
                            // Update style logic would go here
                          }}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Text Color</Label>
                        <Input
                          value={step.contentContainerStyle.textColor}
                          onChange={(e) => {
                            // Update style logic would go here
                          }}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-muted-foreground">
        <p>Visual builder canvas and inspector panel coming soon...</p>
        <p className="text-sm mt-1">This is a basic form-based editor for campaign creation.</p>
      </div>
    </div>
  );
}
