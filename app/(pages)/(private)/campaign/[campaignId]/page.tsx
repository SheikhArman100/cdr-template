'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Play, Pause } from 'lucide-react';
import { useCampaign } from '@/lib/hooks/useCampaigns';

export default function CampaignDetail() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.campaignId as string;

  const { data: campaign, isLoading, error } = useCampaign(campaignId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading campaign...</div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-destructive">Campaign not found</div>
      </div>
    );
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
            <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
            <p className="text-muted-foreground">Campaign details and management</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={campaign.status === 'active' ? 'primary' : 'secondary'}>
            {campaign.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button size="sm">
            {campaign.status === 'active' ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Activate
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={campaign.status === 'active' ? 'primary' : 'secondary'}>
                  {campaign.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Steps</span>
                <span className="font-medium">{campaign.steps.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Modified</span>
                <span className="font-medium">
                  {new Date(campaign.lastModified).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contacts</span>
                <span className="font-medium">1,250,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trials</span>
                <span className="font-medium">850,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conversion</span>
                <span className="font-medium">68%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                View Analytics
              </Button>
              <Button className="w-full" variant="outline">
                Export Data
              </Button>
              <Button className="w-full" variant="outline">
                Clone Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Flow</CardTitle>
          <CardDescription>The sequence of steps in this campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaign.steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{step.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.contentItems.length} content items
                  </p>
                </div>
                <Badge variant="outline">
                  {step.logic.length} logic rules
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
