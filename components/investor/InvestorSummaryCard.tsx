'use client';

import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Project } from '@/lib/mockInvestorApi';
import { DollarSign, TrendingUp, Tag } from 'lucide-react';

interface InvestorSummaryCardProps {
    project: Project;
    onRequestAccess: (projectId: string) => void;
    onMakeProposal: (projectId: string) => void;
}

export function InvestorSummaryCard({ project, onRequestAccess, onMakeProposal }: InvestorSummaryCardProps) {
    const canMakeProposal = project.accessStatus === 'approved' || project.hasAccess;
    const hasRequested = project.accessStatus === 'requested';

    return (
        <Card className="overflow-hidden">
            {/* Thumbnail */}
            <div className={`h-32 bg-gradient-to-br ${project.thumbnail} rounded-xl mb-4`} />

            {/* Content */}
            <div className="space-y-3">
                <div>
                    <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                    <p className="text-sm text-muted line-clamp-2">{project.pitch}</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-card-border">
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-accent" />
                        <div>
                            <div className="text-xs text-muted">Funding</div>
                            <div className="text-sm font-semibold">${(project.requestedFunding / 1000).toFixed(0)}K</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        <div>
                            <div className="text-xs text-muted">Equity</div>
                            <div className="text-sm font-semibold">{project.equityOffered}%</div>
                        </div>
                    </div>
                </div>

                {/* Traction */}
                <div>
                    <div className="text-xs text-muted mb-1">Traction</div>
                    <div className="text-sm">{project.traction}</div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-card-border rounded-full text-xs"
                        >
                            <Tag className="w-3 h-3" />
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="pt-2">
                    {!hasRequested && !canMakeProposal && (
                        <Button
                            onClick={() => onRequestAccess(project.id)}
                            className="w-full"
                            size="sm"
                        >
                            Request Access
                        </Button>
                    )}

                    {hasRequested && (
                        <Button
                            disabled
                            variant="secondary"
                            className="w-full"
                            size="sm"
                        >
                            Access Requested
                        </Button>
                    )}

                    {canMakeProposal && (
                        <Button
                            onClick={() => onMakeProposal(project.id)}
                            className="w-full"
                            size="sm"
                        >
                            Make Proposal
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
