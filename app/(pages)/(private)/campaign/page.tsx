'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Campaign } from '@/types';
import { useCampaigns, useDeleteCampaign, useUpdateCampaignStatus } from '@/hooks/useCampaigns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Trash2, FileText } from 'lucide-react';

const CampaignListView: React.FC<{
    campaigns: Campaign[];
    onSelectCampaign: (id: string) => void;
    onCreateCampaign: () => void;
    onDeleteCampaign: (id: string) => void;
    onUpdateCampaignStatus: (id: string, status: 'active' | 'inactive') => void;
    isDeleting: boolean;
    isUpdating: boolean;
}> = ({ campaigns, onSelectCampaign, onCreateCampaign, onDeleteCampaign, onUpdateCampaignStatus, isDeleting, isUpdating }) => {
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const filteredCampaigns = campaigns.filter(c => statusFilter === 'all' || c.status === statusFilter);

    const StatusToggle: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
        const handleToggle = (checked: boolean) => {
            onUpdateCampaignStatus(campaign.id, checked ? 'active' : 'inactive');
        };

        return (
            <Switch
                checked={campaign.status === 'active'}
                onCheckedChange={handleToggle}
                disabled={isUpdating}
            />
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
                    <p className="text-muted-foreground">Manage your marketing campaigns</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-muted p-1 rounded-lg">
                        <Button
                            variant={statusFilter === 'all' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setStatusFilter('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={statusFilter === 'active' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setStatusFilter('active')}
                        >
                            Active
                        </Button>
                        <Button
                            variant={statusFilter === 'inactive' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setStatusFilter('inactive')}
                        >
                            Inactive
                        </Button>
                    </div>
                    <Button onClick={onCreateCampaign}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Campaign
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Campaign Name</TableHead>
                                <TableHead>Steps</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Modified</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCampaigns.map(campaign => (
                                <TableRow key={campaign.id} className="cursor-pointer hover:bg-muted/50">
                                    <TableCell>
                                        <Link
                                            href={`/campaign/${campaign.id}`}
                                            className="font-medium hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {campaign.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <FileText className="w-4 h-4" />
                                            <span>{campaign.steps.length}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <StatusToggle campaign={campaign} />
                                            <Badge variant={campaign.status === 'active' ? 'primary' : 'secondary'}>
                                                {campaign.status === 'active' ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(campaign.lastModified).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => onDeleteCampaign(campaign.id)}
                                                        disabled={isDeleting}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default function CampaignList() {
    const router = useRouter();
    const { data: campaigns = [], isLoading, error } = useCampaigns();
    const deleteCampaignMutation = useDeleteCampaign();
    const updateStatusMutation = useUpdateCampaignStatus();

    const handleSelectCampaign = useCallback((id: string) => {
        router.push(`/campaign/${id}`);
    }, [router]);

    const handleCreateCampaign = useCallback(() => {
        router.push('/campaign/create-campaign');
    }, [router]);

    const handleDeleteCampaign = useCallback((id: string) => {
        deleteCampaignMutation.mutate(id);
    }, [deleteCampaignMutation]);

    const handleUpdateCampaignStatus = useCallback((id: string, status: 'active' | 'inactive') => {
        updateStatusMutation.mutate({ id, status });
    }, [updateStatusMutation]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-muted-foreground">Loading campaigns...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-destructive">Error loading campaigns</div>
            </div>
        );
    }

    return (
        <CampaignListView
            campaigns={campaigns}
            onSelectCampaign={handleSelectCampaign}
            onCreateCampaign={handleCreateCampaign}
            onDeleteCampaign={handleDeleteCampaign}
            onUpdateCampaignStatus={handleUpdateCampaignStatus}
            isDeleting={deleteCampaignMutation.isPending}
            isUpdating={updateStatusMutation.isPending}
        />
    );
}
