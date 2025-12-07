'use client';

import { useEffect, useState } from 'react';
import { LeftNav } from '@/components/ui/LeftNav';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { InvestorSummaryCard } from '@/components/investor/InvestorSummaryCard';
import { AccessRequestModal } from '@/components/investor/AccessRequestModal';
import { ProposalBuilder } from '@/components/investor/ProposalBuilder';
import { useRouter } from 'next/navigation';
import { useInvestorStore } from '@/lib/investorStore';
import { getProjects, requestAccess, createProposal } from '@/lib/mockInvestorApi';

export default function InvestorDashboardPage() {
    const router = useRouter();
    const { currentUser, projects, setProjects, updateProject, addAccessRequest, addProposal, addNotification } = useInvestorStore();
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [showAccessModal, setShowAccessModal] = useState(false);
    const [showProposalBuilder, setShowProposalBuilder] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        const data = await getProjects();
        setProjects(data);
        setLoading(false);
    };

    const handleRequestAccess = (projectId: string) => {
        setSelectedProject(projectId);
        setShowAccessModal(true);
    };

    const handleSubmitAccessRequest = async (message: string, ndaRequired: boolean) => {
        if (!selectedProject) return;

        const project = projects.find(p => p.id === selectedProject);
        if (!project) return;

        const request = await requestAccess({
            projectId: selectedProject,
            investorId: currentUser.id,
            investorName: currentUser.name,
            investorEmail: currentUser.email,
            message,
            ndaRequired,
        });

        addAccessRequest(request);
        updateProject(selectedProject, { accessStatus: 'requested' });

        addNotification({
            id: `notif-${Date.now()}`,
            userId: currentUser.id,
            type: 'access-request',
            title: 'Access Request Sent',
            message: `Your access request for ${project.title} has been sent`,
            read: false,
            createdAt: new Date().toISOString(),
        });

        setShowAccessModal(false);
        setSelectedProject(null);
    };

    const handleMakeProposal = (projectId: string) => {
        setSelectedProject(projectId);
        setShowProposalBuilder(true);
    };

    const handleSubmitProposal = async (data: any) => {
        if (!selectedProject) return;

        const project = projects.find(p => p.id === selectedProject);
        if (!project) return;

        const proposal = await createProposal({
            projectId: selectedProject,
            investorId: currentUser.id,
            investorName: currentUser.name,
            founderId: project.founderId,
            ...data,
        });

        addProposal(proposal);

        addNotification({
            id: `notif-${Date.now()}`,
            userId: currentUser.id,
            type: 'proposal-received',
            title: 'Proposal Sent',
            message: `Your proposal for ${project.title} has been sent`,
            read: false,
            createdAt: new Date().toISOString(),
        });

        setShowProposalBuilder(false);
        setSelectedProject(null);
    };

    const selectedProjectData = projects.find(p => p.id === selectedProject);

    return (
        <div className="min-h-screen">
            <LeftNav />

            <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-sm border-b border-card-border">
                <div className="text-xl font-bold">Colossify - Investor</div>
                <div className="flex items-center gap-4">
                    <NotificationBell />
                    <Button variant="secondary" size="sm" onClick={() => router.push('/')}>
                        Home
                    </Button>
                </div>
            </header>

            <main className="pt-24 pb-16 px-8 lg:pl-32 max-w-7xl mx-auto">
                <div className="mb-8 animate-slide-up">
                    <h1 className="text-4xl font-bold mb-3">Investment Opportunities</h1>
                    <p className="text-muted text-lg">
                        Browse and invest in promising startups
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-muted">Loading projects...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {projects.map((project) => (
                            <InvestorSummaryCard
                                key={project.id}
                                project={project}
                                onRequestAccess={handleRequestAccess}
                                onMakeProposal={handleMakeProposal}
                            />
                        ))}
                    </div>
                )}
            </main>

            {showAccessModal && selectedProjectData && (
                <AccessRequestModal
                    projectTitle={selectedProjectData.title}
                    onSubmit={handleSubmitAccessRequest}
                    onClose={() => {
                        setShowAccessModal(false);
                        setSelectedProject(null);
                    }}
                />
            )}

            {showProposalBuilder && selectedProjectData && (
                <ProposalBuilder
                    projectTitle={selectedProjectData.title}
                    projectId={selectedProjectData.id}
                    onSubmit={handleSubmitProposal}
                    onClose={() => {
                        setShowProposalBuilder(false);
                        setSelectedProject(null);
                    }}
                />
            )}
        </div>
    );
}
