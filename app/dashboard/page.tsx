'use client';

import { LeftNav } from '@/components/ui/LeftNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MetricCard } from '@/components/sections/MetricCard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getDashboardMetrics } from '@/lib/mockApi';
import { useInvestorStore } from '@/lib/investorStore';

export default function DashboardPage() {
    const router = useRouter();
    const { projects, currentUser } = useInvestorStore();
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const metricsData = await getDashboardMetrics();
            setMetrics(metricsData);
            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-muted">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <LeftNav />

            <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-sm border-b border-card-border">
                <div className="text-xl font-bold">Colossify</div>
                <Button variant="secondary" size="sm" onClick={() => router.push('/')}>
                    Back to Home
                </Button>
            </header>

            <main className="pt-24 pb-16 px-8 lg:pl-32 max-w-7xl mx-auto">
                <div className="mb-8 animate-slide-up">
                    <h1 className="text-4xl font-bold mb-3">Dashboard</h1>
                    <p className="text-muted text-lg">
                        Track your startup ideas and performance metrics.
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in">
                    <MetricCard
                        title="Total Ideas"
                        value={metrics.totalIdeas}
                        trend={12}
                    />
                    <MetricCard
                        title="Validated Ideas"
                        value={metrics.validatedIdeas}
                        trend={8}
                    />
                    <MetricCard
                        title="Published Ideas"
                        value={metrics.publishedIdeas}
                        trend={5}
                    />
                    <MetricCard
                        title="Investor Interest"
                        value={metrics.investorInterest}
                        trend={15}
                    />
                </div>

                {/* Recent Ideas */}
                <Card className="animate-slide-up">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Recent Ideas</h2>
                        <Button variant="secondary" size="sm" onClick={() => router.push('/submit')}>
                            Submit New Idea
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-card-border">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted">Title</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted">Score</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects
                                    .filter(project => project.founderId === currentUser.id)
                                    .slice(0, 5)
                                    .map((project) => (
                                        <tr key={project.id} className="border-b border-card-border/50 hover:bg-muted/5 transition-colors">
                                            <td className="py-4 px-4">{project.title}</td>
                                            <td className="py-4 px-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-muted">-</span>
                                            </td>
                                            <td className="py-4 px-4 text-muted">{new Date().toLocaleDateString()}</td>
                                            <td className="py-4 px-4">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => router.push(`/report/${project.id}`)}
                                                >
                                                    View Report
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </main>
        </div>
    );
}
