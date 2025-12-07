'use client';

import { useUIStore } from '@/lib/store';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export function Modal() {
    const { isModalOpen, modalContent, closeModal } = useUIStore();

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={closeModal}
            />
            <div className="relative bg-card-bg border border-card-border rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/20 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                {modalContent}
            </div>
        </div>
    );
}
