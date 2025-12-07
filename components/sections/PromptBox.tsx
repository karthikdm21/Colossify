'use client';

import { ArrowUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { useState } from 'react';

export function PromptBox() {
    const [query, setQuery] = useState('');

    const suggestions = [
        'Search with ChatGPT',
        'Talk with ChatGPT',
        'Research',
        'Sora',
        'More',
    ];

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4 animate-slide-up">
            <h1 className="text-5xl font-semibold text-center mb-8">
                What can I help with?
            </h1>

            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="India stock market today"
                    className="w-full bg-card-bg border border-card-border rounded-3xl px-6 py-4 pr-14 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <ArrowUp className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((suggestion) => (
                    <Button key={suggestion} variant="pill" size="sm">
                        {suggestion}
                    </Button>
                ))}
            </div>
        </div>
    );
}
