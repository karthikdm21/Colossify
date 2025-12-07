'use client';

import { Card } from '../ui/Card';
import Image from 'next/image';

const products = [
    { name: 'Suitcase', color: 'from-cyan-400 to-blue-300' },
    { name: 'Headphones', color: 'from-pink-300 to-purple-200' },
    { name: 'TV', color: 'from-blue-400 to-purple-300' },
    { name: 'Laptop', color: 'from-yellow-300 to-orange-200' },
];

export function HeroSection() {
    return (
        <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />

            {/* Product Cards */}
            <div className="relative flex gap-6 overflow-x-auto pb-8 px-4 snap-x snap-mandatory scrollbar-hide">
                {products.map((product, idx) => (
                    <div
                        key={idx}
                        className="flex-shrink-0 w-64 h-64 snap-center animate-fade-in"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                        <Card className="w-full h-full flex items-center justify-center hover:scale-105 hover:rotate-1 transition-transform duration-300">
                            <div className={`w-32 h-32 bg-gradient-to-br ${product.color} rounded-2xl`} />
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
