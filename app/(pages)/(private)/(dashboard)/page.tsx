'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import dynamic from 'next/dynamic';

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const dashboardData = {
    filters: {
        regions: ['National', 'North', 'South', 'East', 'West'],
        areas: ['All', 'Urban', 'Rural'],
        distributionHouses: ['All', 'DH-01', 'DH-02', 'DH-03'],
        territories: ['All', 'T-A', 'T-B', 'T-C'],
        points: ['All', 'Retail', 'Event', 'Community'],
    },
    nationalData: {
        contact: { total: 1_250_000, target: 1_500_000, achievement: 83.3 },
        trial: { total: 850_000, target: 1_000_000, achievement: 85.0 },
    },
    targetVsAchievement: [
        { name: 'Contact', data: [83.3] },
        { name: 'Trial', data: [85.0] },
    ],
    brandWiseContact: [
        { name: 'Brand A', data: 450000 },
        { name: 'Brand B', data: 350000 },
        { name: 'Brand C', data: 250000 },
        { name: 'Brand D', data: 200000 },
    ],
    brandWiseTrial: [
        { name: 'Brand A', data: 380000 },
        { name: 'Brand B', data: 220000 },
        { name: 'Brand C', data: 150000 },
        { name: 'Brand D', data: 100000 },
    ],
};

export default function Dashboard() {

    const barChartOptions = {
        chart: {
            type: 'bar' as const,
            height: 350,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: ['Contact', 'Trial'],
        },
        yaxis: {
            title: {
                text: 'Achievement (%)',
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val}%`,
            },
        },
    };

    const barChartSeries = [
        {
            name: 'Achievement',
            data: [83.3, 85.0],
        },
    ];

    const pieChartOptions = {
        chart: {
            type: 'pie' as const,
            height: 350,
        },
        labels: ['Brand A', 'Brand B', 'Brand C', 'Brand D'],
        colors: ['#3b82f6', '#10b981', '#f97316', '#ef4444'],
        legend: {
            position: 'bottom' as const,
        },
        tooltip: {
            y: {
                formatter: (val: number) => val.toLocaleString(),
            },
        },
    };

    const contactPieSeries = [450000, 350000, 250000, 200000];
    const trialPieSeries = [380000, 220000, 150000, 100000];

    const renderOverview = () => (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Region</label>
                            <Select>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dashboardData.filters.regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Area</label>
                            <Select>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select area" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dashboardData.filters.areas.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Distribution House</label>
                            <Select>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select distribution house" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dashboardData.filters.distributionHouses.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Territory</label>
                            <Select>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select territory" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dashboardData.filters.territories.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Point</label>
                            <Select>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select point" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dashboardData.filters.points.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full">Apply</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>National Contact Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl md:text-3xl font-bold">{dashboardData.nationalData.contact.total.toLocaleString()}</p>
                        <p className="text-sm text-green-600 font-semibold">{dashboardData.nationalData.contact.achievement}% Achievement</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>National Trial Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl md:text-3xl font-bold">{dashboardData.nationalData.trial.total.toLocaleString()}</p>
                        <p className="text-sm text-green-600 font-semibold">{dashboardData.nationalData.trial.achievement}% Achievement</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Target vs Achievement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReactApexChart
                            options={barChartOptions}
                            series={barChartSeries}
                            type="bar"
                            height={350}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Brand-wise User Contact</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReactApexChart
                            options={pieChartOptions}
                            series={contactPieSeries}
                            type="pie"
                            height={350}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Brand-wise User Trial</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReactApexChart
                            options={pieChartOptions}
                            series={trialPieSeries}
                            type="pie"
                            height={350}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );





    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm md:text-base text-muted-foreground">Monitor your campaign performance and analytics</p>
            </div>

            {renderOverview()}
        </div>
    );
}
