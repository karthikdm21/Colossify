'use client';

import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Proposal, Milestone } from '@/lib/mockInvestorApi';
import { DollarSign, TrendingUp, Calendar, FileText } from 'lucide-react';
import { ProposalModal } from './ProposalModal';

interface ProposalInboxProps {
    proposals: Proposal[];
    onAccept: (proposalId: string) => void;
    onCounter: (proposalId: string, data: any) => void;
    onReject: (proposalId: string) => void;
}

export function ProposalInbox({ proposals, onAccept, onCounter, onReject }: ProposalInboxProps) {
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

    if (proposals.length === 0) {
        return (
            <Card className="p-8 text-center">
                <p className="text-muted">No proposals yet</p>
            </Card>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {proposals.map((proposal) => (
                    <Card key={proposal.id} className="p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-lg">{proposal.investorName}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${proposal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                proposal.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                                    proposal.status === 'countered' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-red-500/20 text-red-400'
                                            }`}>
                                            {proposal.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted">
                                        Received {new Date(proposal.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-accent" />
                                        <div>
                                            <div className="text-xs text-muted">Funding</div>
                                            <div className="font-semibold">${(proposal.fundingAmount / 1000).toFixed(0)}K</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-accent" />
                                        <div>
                                            <div className="text-xs text-muted">Equity</div>
                                            <div className="font-semibold">{proposal.equityOffer}%</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-accent" />
                                        <div>
                                            <div className="text-xs text-muted">Milestones</div>
                                            <div className="font-semibold">{proposal.milestones.length}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-accent" />
                                        <div>
                                            <div className="text-xs text-muted">Terms</div>
                                            <div className="font-semibold">{proposal.termSheetNotes ? 'Yes' : 'No'}</div>
                                        </div>
                                    </div>
                                </div>

                                {proposal.status === 'pending' && (
                                    <div className="flex gap-2 pt-2">
                                        <Button onClick={() => onAccept(proposal.id)} size="sm">
                                            Accept
                                        </Button>
                                        <Button onClick={() => setSelectedProposal(proposal)} variant="secondary" size="sm">
                                            Counter
                                        </Button>
                                        <Button onClick={() => onReject(proposal.id)} variant="secondary" size="sm">
                                            Reject
                                        </Button>
                                    </div>
                                )}

                                {proposal.status !== 'pending' && (
                                    <Button onClick={() => setSelectedProposal(proposal)} variant="secondary" size="sm">
                                        View Details
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {selectedProposal && (
                <ProposalModal
                    proposal={selectedProposal}
                    onClose={() => setSelectedProposal(null)}
                    onCounter={(data) => {
                        onCounter(selectedProposal.id, data);
                        setSelectedProposal(null);
                    }}
                />
            )}
        </>
    );
}
