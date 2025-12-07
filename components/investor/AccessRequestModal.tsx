'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface AccessRequestModalProps {
    projectTitle: string;
    onSubmit: (message: string, ndaRequired: boolean) => void;
    onClose: () => void;
}

export function AccessRequestModal({ projectTitle, onSubmit, onClose }: AccessRequestModalProps) {
    const [message, setMessage] = useState('');
    const [ndaRequired, setNdaRequired] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!message.trim()) return;

        setLoading(true);
        await onSubmit(message, ndaRequired);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            <div className="relative bg-card-bg border border-card-border rounded-3xl p-8 max-w-2xl w-full animate-scale-in shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/20 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-2">Request Access</h2>
                <p className="text-muted mb-6">
                    Request access to view full details of <span className="text-foreground font-semibold">{projectTitle}</span>
                </p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Message to Founder *
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                            placeholder="Introduce yourself and explain why you're interested in this project..."
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="nda"
                            checked={ndaRequired}
                            onChange={(e) => setNdaRequired(e.target.checked)}
                            className="w-4 h-4 rounded border-card-border bg-background focus:ring-2 focus:ring-accent/50"
                        />
                        <label htmlFor="nda" className="text-sm">
                            Require NDA before sharing details
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={handleSubmit}
                            disabled={!message.trim() || loading}
                            className="flex-1"
                        >
                            {loading ? 'Sending...' : 'Send Request'}
                        </Button>
                        <Button
                            onClick={onClose}
                            variant="secondary"
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
