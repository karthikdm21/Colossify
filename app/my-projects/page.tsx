'use client';

import { useEffect, useState } from 'react';
import { LeftNav } from '@/components/ui/LeftNav';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { useInvestorStore } from '@/lib/investorStore';
import { getProjects } from '@/lib/mockInvestorApi';
import { FileText, TrendingUp, CheckCircle } from 'lucide-react';

export default function MyProjectsPage() {
    const router = useRouter();
    const { currentUser, projects, setProjects } = useInvestorStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        const data = await getProjects();
        // Filter to show only founder's projects
        const myProjects = data.filter(p => p.founderId === currentUser.id);
        setProjects(myProjects);
        setLoading(false);
    };

    return (
        <div className="min-h-screen">
            <LeftNav />

            <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-sm border-b border-card-border">
                <div className="text-xl font-bold">Colossify - My Projects</div>
                <div className="flex items-center gap-4">
                    <NotificationBell />
                    <Button variant="secondary" size="sm" onClick={() => router.push('/home-founder')}>
                        Home
                    </Button>
                </div>
            </header>

            <main className="pt-24 pb-16 px-8 lg:pl-32 max-w-7xl mx-auto">
                <div className="mb-8 animate-slide-up">
                    <h1 className="text-4xl font-bold mb-3">My Projects</h1>
                    <p className="text-muted text-lg">
                        Manage your submitted startup ideas
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-muted">Loading your projects...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <Card className="p-12 text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-muted" />
                        <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                        <p className="text-muted mb-6">Start by submitting your first startup idea</p>
                        <Button onClick={() => router.push('/submit')}>
                            Submit Your First Idea
                        </Button>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {projects.map((project) => (
                            <Card key={project.id} className="p-6">
                                <div className={`h-32 bg-gradient-to-br ${project.thumbnail} rounded-xl mb-4`} />

                                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                                <p className="text-sm text-muted mb-4 line-clamp-2">{project.pitch}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted">Funding Requested</span>
                                        <span className="font-semibold">${(project.requestedFunding / 1000).toFixed(0)}K</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted">Equity Offered</span>
                                        <span className="font-semibold">{project.equityOffered}%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted">Status</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${project.accessStatus === 'approved' ? 'bg-green-500/20 text-green-400' :
                                            project.accessStatus === 'requested' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {project.accessStatus || 'Active'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => router.push(`/report/${project.id}`)}>
                                        View Report
                                    </Button>
                                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => router.push('/founder')}>
                                        Requests
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
