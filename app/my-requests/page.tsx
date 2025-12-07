'use client';

import { useEffect, useState } from 'react';
import { LeftNav } from '@/components/ui/LeftNav';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { useInvestorStore } from '@/lib/investorStore';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default function MyRequestsPage() {
    const router = useRouter();
    const { currentUser, accessRequests, proposals } = useInvestorStore();

    // Filter requests made by this investor
    const myRequests = accessRequests.filter(r => r.investorId === currentUser.id);
    const myProposals = proposals.filter(p => p.investorId === currentUser.id);

    return (
        <div className="min-h-screen">
            <LeftNav />

            <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-sm border-b border-card-border">
                <div className="text-xl font-bold">Colossify - My Requests</div>
                <div className="flex items-center gap-4">
                    <NotificationBell />
                    <Button variant="secondary" size="sm" onClick={() => router.push('/home-investor')}>
                        Home
                    </Button>
                </div>
            </header>

            <main className="pt-24 pb-16 px-8 lg:pl-32 max-w-7xl mx-auto">
                <div className="mb-8 animate-slide-up">
                    <h1 className="text-4xl font-bold mb-3">My Requests & Proposals</h1>
                    <p className="text-muted text-lg">
                        Track your access requests and investment proposals
                    </p>
                </div>

                {/* Access Requests */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Access Requests</h2>
                    {myRequests.length === 0 ? (
                        <Card className="p-8 text-center">
                            <p className="text-muted">No access requests yet</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {myRequests.map((request) => (
                                <Card key={request.id} className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-2">Access Request</h3>
                                            <p className="text-sm text-muted mb-3">{request.message}</p>
                                            <div className="text-xs text-muted">
                                                Sent {new Date(request.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {request.status === 'pending' && (
                                                <>
                                                    <Clock className="w-4 h-4 text-yellow-500" />
                                                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                                                        Pending
                                                    </span>
                                                </>
                                            )}
                                            {request.status === 'approved' && (
                                                <>
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                                        Approved
                                                    </span>
                                                </>
                                            )}
                                            {request.status === 'rejected' && (
                                                <>
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                                                        Rejected
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Proposals */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">My Proposals</h2>
                    {myProposals.length === 0 ? (
                        <Card className="p-8 text-center">
                            <p className="text-muted">No proposals yet</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {myProposals.map((proposal) => (
                                <Card key={proposal.id} className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-2">Investment Proposal</h3>
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <div className="text-xs text-muted">Funding Amount</div>
                                                    <div className="font-semibold">${proposal.fundingAmount.toLocaleString()}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-muted">Equity Offer</div>
                                                    <div className="font-semibold">{proposal.equityOffer}%</div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted">
                                                Sent {new Date(proposal.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${proposal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                            proposal.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                                proposal.status === 'countered' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>
                                            {proposal.status}
                                        </span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
