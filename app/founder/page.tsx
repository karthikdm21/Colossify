'use client';

import { useEffect, useState } from 'react';
import { LeftNav } from '@/components/ui/LeftNav';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { AccessRequestList } from '@/components/founder/AccessRequestList';
import { ProposalInbox } from '@/components/founder/ProposalInbox';
import { useRouter } from 'next/navigation';
import { useInvestorStore } from '@/lib/investorStore';
import { getAccessRequests, respondToAccessRequest, getProposals, acceptProposal, rejectProposal, counterProposal } from '@/lib/mockInvestorApi';
import { Card } from '@/components/ui/Card';

export default function FounderDashboardPage() {
    const router = useRouter();
    const { currentUser, setCurrentUser, accessRequests, setAccessRequests, updateAccessRequest, proposals, setProposals, updateProposal, addNotification } = useInvestorStore();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'requests' | 'proposals'>('requests');

    useEffect(() => {
        // Set user to founder mode
        setCurrentUser({
            id: 'founder-1',
            name: 'Sarah Chen',
            email: 'sarah@startup.com',
            role: 'founder',
        });
        loadData();
    }, []);

    const loadData = async () => {
        const [requests, proposalsData] = await Promise.all([
            getAccessRequests('founder-1'),
            getProposals('founder-1', 'founder'),
        ]);
        setAccessRequests(requests);
        setProposals(proposalsData);
        setLoading(false);
    };

    const handleApprove = async (requestId: string) => {
        const updated = await respondToAccessRequest(requestId, 'approved');
        updateAccessRequest(requestId, updated);

        addNotification({
            id: `notif-${Date.now()}`,
            userId: currentUser.id,
            type: 'access-approved',
            title: 'Access Granted',
            message: `You approved access for ${updated.investorName}`,
            read: false,
            createdAt: new Date().toISOString(),
        });
    };

    const handleReject = async (requestId: string) => {
        const updated = await respondToAccessRequest(requestId, 'rejected');
        updateAccessRequest(requestId, updated);
    };

    const handleRequestMoreInfo = async (requestId: string) => {
        const updated = await respondToAccessRequest(requestId, 'more-info');
        updateAccessRequest(requestId, updated);
    };

    const handleAcceptProposal = async (proposalId: string) => {
        const updated = await acceptProposal(proposalId);
        updateProposal(proposalId, updated);

        addNotification({
            id: `notif-${Date.now()}`,
            userId: currentUser.id,
            type: 'proposal-accepted',
            title: 'Proposal Accepted',
            message: `You accepted a proposal`,
            read: false,
            createdAt: new Date().toISOString(),
        });
    };

    const handleRejectProposal = async (proposalId: string) => {
        const updated = await rejectProposal(proposalId);
        updateProposal(proposalId, updated);
    };

    const handleCounterProposal = async (proposalId: string, data: any) => {
        const updated = await counterProposal(proposalId, data);
        updateProposal(proposalId, updated);

        addNotification({
            id: `notif-${Date.now()}`,
            userId: currentUser.id,
            type: 'proposal-countered',
            title: 'Counter-Proposal Sent',
            message: `You sent a counter-proposal`,
            read: false,
            createdAt: new Date().toISOString(),
        });
    };

    return (
        <div className="min-h-screen">
            <LeftNav />

            <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-sm border-b border-card-border">
                <div className="text-xl font-bold">Colossify - Founder</div>
                <div className="flex items-center gap-4">
                    <NotificationBell />
                    <Button variant="secondary" size="sm" onClick={() => router.push('/')}>
                        Home
                    </Button>
                </div>
            </header>

            <main className="pt-24 pb-16 px-8 lg:pl-32 max-w-7xl mx-auto">
                <div className="mb-8 animate-slide-up">
                    <h1 className="text-4xl font-bold mb-3">Founder Dashboard</h1>
                    <p className="text-muted text-lg">
                        Manage access requests and investment proposals
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'requests'
                            ? 'bg-accent text-white'
                            : 'bg-card-bg text-muted hover:bg-muted/10'
                            }`}
                    >
                        Access Requests
                        {accessRequests.filter(r => r.status === 'pending').length > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                {accessRequests.filter(r => r.status === 'pending').length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('proposals')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'proposals'
                            ? 'bg-accent text-white'
                            : 'bg-card-bg text-muted hover:bg-muted/10'
                            }`}
                    >
                        Proposals
                        {proposals.filter(p => p.status === 'pending').length > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                {proposals.filter(p => p.status === 'pending').length}
                            </span>
                        )}
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-muted">Loading...</p>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        {activeTab === 'requests' && (
                            <AccessRequestList
                                requests={accessRequests}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                onRequestMoreInfo={handleRequestMoreInfo}
                            />
                        )}

                        {activeTab === 'proposals' && (
                            <ProposalInbox
                                proposals={proposals}
                                onAccept={handleAcceptProposal}
                                onCounter={handleCounterProposal}
                                onReject={handleRejectProposal}
                            />
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
