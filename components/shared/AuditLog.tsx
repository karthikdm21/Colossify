'use client';

import { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { getAuditLog } from '@/lib/mockInvestorApi';
import { Clock, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';

interface AuditLogProps {
    projectId: string;
}

export function AuditLog({ projectId }: AuditLogProps) {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLogs();
    }, [projectId]);

    const loadLogs = async () => {
        const data = await getAuditLog(projectId);
        setLogs(data);
        setLoading(false);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'access-request':
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'access-response':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'proposal':
                return <FileText className="w-4 h-4 text-blue-500" />;
            case 'counter-proposal':
                return <FileText className="w-4 h-4 text-purple-500" />;
            default:
                return <Clock className="w-4 h-4 text-muted" />;
        }
    };

    if (loading) {
        return (
            <Card className="p-6">
                <p className="text-sm text-muted">Loading audit log...</p>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Activity Log</h3>
            {logs.length === 0 ? (
                <p className="text-sm text-muted">No activity yet</p>
            ) : (
                <div className="space-y-3">
                    {logs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 p-3 bg-background rounded-lg">
                            <div className="mt-1">{getIcon(log.type)}</div>
                            <div className="flex-1">
                                <div className="text-sm">
                                    <span className="font-medium">{log.actor}</span> {log.action}
                                </div>
                                <div className="text-xs text-muted mt-1 flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    {new Date(log.timestamp).toLocaleDateString()} at{' '}
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                            {log.status && (
                                <span className={`px-2 py-1 rounded-full text-xs ${log.status === 'approved' || log.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                        log.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                            log.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                    }`}>
                                    {log.status}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
