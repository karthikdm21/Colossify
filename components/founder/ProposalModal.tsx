'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { X, Plus, Trash2 } from 'lucide-react';
import { Proposal, Milestone } from '@/lib/mockInvestorApi';

interface ProposalModalProps {
    proposal: Proposal;
    onClose: () => void;
    onCounter?: (data: {
        fundingAmount: number;
        equityOffer: number;
        milestones: Milestone[];
        termSheetNotes: string;
    }) => void;
}

export function ProposalModal({ proposal, onClose, onCounter }: ProposalModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [fundingAmount, setFundingAmount] = useState(proposal.fundingAmount.toString());
    const [equityOffer, setEquityOffer] = useState(proposal.equityOffer.toString());
    const [milestones, setMilestones] = useState<Milestone[]>(proposal.milestones);
    const [termSheetNotes, setTermSheetNotes] = useState(proposal.termSheetNotes);
    const [loading, setLoading] = useState(false);

    const addMilestone = () => {
        setMilestones([
            ...milestones,
            { id: Date.now().toString(), description: '', amount: 0, deadline: '' },
        ]);
    };

    const removeMilestone = (id: string) => {
        setMilestones(milestones.filter(m => m.id !== id));
    };

    const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
        setMilestones(milestones.map(m =>
            m.id === id ? { ...m, [field]: value } : m
        ));
    };

    const handleCounter = async () => {
        if (!onCounter) return;

        setLoading(true);
        await onCounter({
            fundingAmount: parseFloat(fundingAmount),
            equityOffer: parseFloat(equityOffer),
            milestones: milestones.filter(m => m.description && m.amount),
            termSheetNotes,
        });
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            <div className="relative bg-card-bg border border-card-border rounded-3xl p-8 max-w-4xl w-full my-8 animate-scale-in shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/20 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-2">Proposal Details</h2>
                <p className="text-muted mb-6">
                    From <span className="text-foreground font-semibold">{proposal.investorName}</span>
                </p>

                <div className="space-y-6">
                    {/* Funding Terms */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Funding Terms</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Funding Amount ($)
                                </label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={fundingAmount}
                                        onChange={(e) => setFundingAmount(e.target.value)}
                                        className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50"
                                    />
                                ) : (
                                    <div className="text-2xl font-bold">${parseFloat(fundingAmount).toLocaleString()}</div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Equity Offer (%)
                                </label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={equityOffer}
                                        onChange={(e) => setEquityOffer(e.target.value)}
                                        className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50"
                                        step="0.1"
                                    />
                                ) : (
                                    <div className="text-2xl font-bold">{equityOffer}%</div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Milestones */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Milestones</h3>
                            {isEditing && (
                                <Button onClick={addMilestone} variant="secondary" size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add
                                </Button>
                            )}
                        </div>
                        <div className="space-y-3">
                            {milestones.map((milestone, idx) => (
                                <div key={milestone.id} className="flex items-start gap-3 p-3 bg-background rounded-lg">
                                    {isEditing ? (
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="text"
                                                value={milestone.description}
                                                onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                                                className="w-full bg-card-bg border border-card-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                                                placeholder="Description"
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="number"
                                                    value={milestone.amount || ''}
                                                    onChange={(e) => updateMilestone(milestone.id, 'amount', parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-card-bg border border-card-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                                                    placeholder="Amount"
                                                />
                                                <input
                                                    type="date"
                                                    value={milestone.deadline}
                                                    onChange={(e) => updateMilestone(milestone.id, 'deadline', e.target.value)}
                                                    className="w-full bg-card-bg border border-card-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1">
                                            <div className="font-medium">{idx + 1}. {milestone.description}</div>
                                            <div className="text-sm text-muted mt-1">
                                                ${milestone.amount.toLocaleString()} • Due: {new Date(milestone.deadline).toLocaleDateString()}
                                            </div>
                                        </div>
                                    )}
                                    {isEditing && milestones.length > 1 && (
                                        <button
                                            onClick={() => removeMilestone(milestone.id)}
                                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Term Sheet Notes */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Term Sheet Notes</h3>
                        {isEditing ? (
                            <textarea
                                value={termSheetNotes}
                                onChange={(e) => setTermSheetNotes(e.target.value)}
                                rows={6}
                                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                            />
                        ) : (
                            <div className="text-sm whitespace-pre-wrap">{termSheetNotes || 'No additional notes'}</div>
                        )}
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        {!isEditing && onCounter && proposal.status === 'pending' && (
                            <Button onClick={() => setIsEditing(true)} className="flex-1">
                                Edit & Counter
                            </Button>
                        )}
                        {isEditing && (
                            <>
                                <Button onClick={handleCounter} disabled={loading} className="flex-1">
                                    {loading ? 'Sending...' : 'Send Counter-Proposal'}
                                </Button>
                                <Button onClick={() => setIsEditing(false)} variant="secondary" className="flex-1">
                                    Cancel
                                </Button>
                            </>
                        )}
                        {!isEditing && (
                            <Button onClick={onClose} variant="secondary" className="flex-1">
                                Close
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
