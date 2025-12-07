'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { X, Plus, Trash2 } from 'lucide-react';
import { Milestone } from '@/lib/mockInvestorApi';

interface ProposalBuilderProps {
    projectTitle: string;
    projectId: string;
    onSubmit: (data: {
        fundingAmount: number;
        equityOffer: number;
        milestones: Milestone[];
        termSheetNotes: string;
    }) => void;
    onClose: () => void;
}

export function ProposalBuilder({ projectTitle, onSubmit, onClose }: ProposalBuilderProps) {
    const [step, setStep] = useState(1);
    const [fundingAmount, setFundingAmount] = useState('');
    const [equityOffer, setEquityOffer] = useState('');
    const [milestones, setMilestones] = useState<Milestone[]>([
        { id: '1', description: '', amount: 0, deadline: '' },
    ]);
    const [termSheetNotes, setTermSheetNotes] = useState('');
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

    const handleSubmit = async () => {
        setLoading(true);
        await onSubmit({
            fundingAmount: parseFloat(fundingAmount),
            equityOffer: parseFloat(equityOffer),
            milestones: milestones.filter(m => m.description && m.amount),
            termSheetNotes,
        });
        setLoading(false);
    };

    const canProceed = () => {
        if (step === 1) return fundingAmount && equityOffer;
        if (step === 2) return milestones.some(m => m.description && m.amount);
        return true;
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

                <h2 className="text-2xl font-bold mb-2">Create Proposal</h2>
                <p className="text-muted mb-6">
                    Proposal for <span className="text-foreground font-semibold">{projectTitle}</span>
                </p>

                {/* Stepper */}
                <div className="flex items-center gap-2 mb-8">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center flex-1">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${s <= step ? 'bg-accent text-white' : 'bg-card-border text-muted'
                                    }`}
                            >
                                {s}
                            </div>
                            {s < 4 && (
                                <div
                                    className={`flex-1 h-1 mx-2 rounded transition-colors ${s < step ? 'bg-accent' : 'bg-card-border'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="min-h-[300px]">
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="text-lg font-semibold">Funding Terms</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Funding Amount ($) *
                                    </label>
                                    <input
                                        type="number"
                                        value={fundingAmount}
                                        onChange={(e) => setFundingAmount(e.target.value)}
                                        className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50"
                                        placeholder="500000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Equity Offer (%) *
                                    </label>
                                    <input
                                        type="number"
                                        value={equityOffer}
                                        onChange={(e) => setEquityOffer(e.target.value)}
                                        className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50"
                                        placeholder="10"
                                        step="0.1"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Milestones</h3>
                                <Button onClick={addMilestone} variant="secondary" size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Milestone
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {milestones.map((milestone, idx) => (
                                    <Card key={milestone.id} className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1 space-y-3">
                                                <input
                                                    type="text"
                                                    value={milestone.description}
                                                    onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                                                    className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                                                    placeholder="Milestone description"
                                                />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="number"
                                                        value={milestone.amount || ''}
                                                        onChange={(e) => updateMilestone(milestone.id, 'amount', parseFloat(e.target.value) || 0)}
                                                        className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                                                        placeholder="Amount ($)"
                                                    />
                                                    <input
                                                        type="date"
                                                        value={milestone.deadline}
                                                        onChange={(e) => updateMilestone(milestone.id, 'deadline', e.target.value)}
                                                        className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                                                    />
                                                </div>
                                            </div>
                                            {milestones.length > 1 && (
                                                <button
                                                    onClick={() => removeMilestone(milestone.id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="text-lg font-semibold">Term Sheet Notes</h3>
                            <textarea
                                value={termSheetNotes}
                                onChange={(e) => setTermSheetNotes(e.target.value)}
                                rows={8}
                                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                                placeholder="Additional terms, conditions, and notes..."
                            />
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="text-lg font-semibold mb-4">Review Proposal</h3>
                            <Card className="p-6 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-muted">Funding Amount</div>
                                        <div className="text-2xl font-bold">${parseFloat(fundingAmount || '0').toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted">Equity Offer</div>
                                        <div className="text-2xl font-bold">{equityOffer}%</div>
                                    </div>
                                </div>

                                <div className="border-t border-card-border pt-4">
                                    <div className="text-sm text-muted mb-2">Milestones ({milestones.filter(m => m.description).length})</div>
                                    <div className="space-y-2">
                                        {milestones.filter(m => m.description).map((m, idx) => (
                                            <div key={m.id} className="text-sm flex justify-between">
                                                <span>{idx + 1}. {m.description}</span>
                                                <span className="text-muted">${m.amount.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {termSheetNotes && (
                                    <div className="border-t border-card-border pt-4">
                                        <div className="text-sm text-muted mb-2">Term Sheet Notes</div>
                                        <div className="text-sm whitespace-pre-wrap">{termSheetNotes}</div>
                                    </div>
                                )}
                            </Card>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex gap-3 pt-6 border-t border-card-border mt-6">
                    {step > 1 && (
                        <Button onClick={() => setStep(step - 1)} variant="secondary">
                            Back
                        </Button>
                    )}
                    <div className="flex-1" />
                    {step < 4 ? (
                        <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                            Next
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Proposal'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
