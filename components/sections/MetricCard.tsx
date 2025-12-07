'use client';

import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: number | string;
    trend?: number;
    suffix?: string;
}

export function MetricCard({ title, value, trend, suffix = '' }: MetricCardProps) {
    const isPositive = trend && trend > 0;

    return (
        <Card>
            <div className="space-y-2">
                <p className="text-sm text-muted">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-bold">{value}{suffix}</h3>
                    {trend !== undefined && (
                        <span className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {Math.abs(trend)}%
                        </span>
                    )}
                </div>
            </div>
        </Card>
    );
}
