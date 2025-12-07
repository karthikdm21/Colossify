'use client';

import { LeftNav } from '@/components/ui/LeftNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { validateIdea, ValidationResult } from '@/lib/mockApi';
import { CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params); // Unwrap the async params
    const [report, setReport] = useState<ValidationResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadReport() {
            const data = await validateIdea(id);
            setReport(data);
            setLoading(false);
        }
        loadReport();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-muted">Generating report...</div>
            </div>
        );
    }

    if (!report) return null;

    return (
        <div className="min-h-screen">
            <LeftNav />

            <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-sm border-b border-card-border">
                <div className="text-xl font-bold">Colossify</div>
                <Button variant="secondary" size="sm" onClick={() => router.push('/dashboard')}>
                    Back to Dashboard
                </Button>
            </header>

            <main className="pt-24 pb-16 px-8 lg:pl-32 max-w-6xl mx-auto">
                <div className="mb-8 animate-slide-up">
                    <h1 className="text-4xl font-bold mb-3">Idea Validation Report</h1>
                    <p className="text-muted text-lg">
                        Comprehensive analysis of your startup idea
                    </p>
                </div>

                {/* Overall Score */}
                <Card className="mb-8 animate-fade-in">
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-accent to-accent-hover mb-4">
                            <span className="text-5xl font-bold text-white">{report.overallScore}</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Overall Score</h2>
                        <p className="text-muted">
                            {report.overallScore >= 80 ? 'Excellent potential!' :
                                report.overallScore >= 60 ? 'Good foundation with room for improvement' :
                                    'Needs significant refinement'}
                        </p>
                    </div>
                </Card>

                {/* Category Scores */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
                    {Object.entries(report.scores).map(([key, value]) => (
                        <Card key={key}>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">{value}</div>
                                <div className="text-sm text-muted capitalize">{key}</div>
                                <div className="mt-3 h-2 bg-card-border rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-accent transition-all duration-500"
                                        style={{ width: `${value}%` }}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Summary */}
                <Card className="mb-8 animate-fade-in">
                    <div className="flex items-start gap-4">
                        <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-xl font-bold mb-3">Summary</h3>
                            <p className="text-muted leading-relaxed">{report.summary}</p>
                        </div>
                    </div>
                </Card>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Risks */}
                    <Card className="animate-slide-up">
                        <div className="flex items-start gap-4 mb-6">
                            <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                            <h3 className="text-xl font-bold">Potential Risks</h3>
                        </div>
                        <ul className="space-y-3">
                            {report.risks.map((risk, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="text-yellow-500 mt-1">•</span>
                                    <span className="text-muted">{risk}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Suggestions */}
                    <Card className="animate-slide-up">
                        <div className="flex items-start gap-4 mb-6">
                            <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                            <h3 className="text-xl font-bold">Suggestions</h3>
                        </div>
                        <ul className="space-y-3">
                            {report.suggestions.map((suggestion, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="text-accent mt-1">•</span>
                                    <span className="text-muted">{suggestion}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>

                {/* Actions */}
                <div className="mt-12 flex gap-4 justify-center">
                    <Button onClick={() => router.push('/submit')}>
                        Submit Another Idea
                    </Button>
                    <Button variant="secondary" onClick={() => router.push('/dashboard')}>
                        View All Ideas
                    </Button>
                </div>
            </main>
        </div>
    );
}
