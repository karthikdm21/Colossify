'use client';

import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AccessRequest } from '@/lib/mockInvestorApi';
import { Shield, Mail, Clock } from 'lucide-react';

interface AccessRequestListProps {
    requests: AccessRequest[];
    onApprove: (requestId: string) => void;
    onReject: (requestId: string) => void;
    onRequestMoreInfo: (requestId: string) => void;
}

export function AccessRequestList({ requests, onApprove, onReject, onRequestMoreInfo }: AccessRequestListProps) {
    if (requests.length === 0) {
        return (
            <Card className="p-8 text-center">
                <p className="text-muted">No access requests yet</p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {requests.map((request) => (
                <Card key={request.id} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                                <div>
                                    <h3 className="font-semibold">{request.investorName}</h3>
                                    <p className="text-sm text-muted">{request.investorEmail}</p>
                                </div>
                                {request.ndaRequired && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent rounded-full text-xs">
                                        <Shield className="w-3 h-3" />
                                        NDA Required
                                    </div>
                                )}
                            </div>

                            <div className="flex items-start gap-2">
                                <Mail className="w-4 h-4 text-muted mt-1 flex-shrink-0" />
                                <p className="text-sm">{request.message}</p>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted">
                                <Clock className="w-3 h-3" />
                                {new Date(request.createdAt).toLocaleDateString()} at{' '}
                                {new Date(request.createdAt).toLocaleTimeString()}
                            </div>
                        </div>

                        {request.status === 'pending' && (
                            <div className="flex flex-col gap-2">
                                <Button onClick={() => onApprove(request.id)} size="sm">
                                    Accept
                                </Button>
                                <Button onClick={() => onReject(request.id)} variant="secondary" size="sm">
                                    Reject
                                </Button>
                                <Button onClick={() => onRequestMoreInfo(request.id)} variant="secondary" size="sm">
                                    More Info
                                </Button>
                            </div>
                        )}

                        {request.status !== 'pending' && (
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                    request.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {request.status}
                            </div>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
}
