'use client';

import { LeftNav } from '@/components/ui/LeftNav';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { PromptBox } from '@/components/sections/PromptBox';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lightbulb, FileText, BarChart3, Users } from 'lucide-react';

export default function HomeFounderPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen">
            <LeftNav />

            <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-sm border-b border-card-border">
                <div className="text-xl font-bold">Colossify - Founder</div>
                <div className="flex items-center gap-4">
                    <NotificationBell />
                    <Button variant="secondary" size="sm" onClick={() => router.push('/')}>
                        Switch Role
                    </Button>
                </div>
            </header>

            <main className="pt-20 lg:pl-24">
                {/* Hero Section with Prompt */}
                <section className="py-20 px-4 min-h-[60vh] flex items-center justify-center">
                    <div className="w-full max-w-3xl mx-auto space-y-6 animate-slide-up">
                        <h1 className="text-5xl font-semibold text-center mb-8">
                            Ready to submit your startup idea?
                        </h1>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Describe your startup idea..."
                                className="w-full bg-card-bg border border-card-border rounded-3xl px-6 py-4 pr-14 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                                onFocus={() => router.push('/submit')}
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center">
                            <Link href="/submit">
                                <Button variant="pill" size="sm">Submit New Idea</Button>
                            </Link>
                            <Link href="/my-projects">
                                <Button variant="pill" size="sm">My Projects</Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="pill" size="sm">View Dashboard</Button>
                            </Link>
                            <Link href="/showcase">
                                <Button variant="pill" size="sm">Success Stories</Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features for Founders */}
                <section className="py-16 px-8 lg:pl-32 max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">Founder Tools</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                        <Card className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
                                <Lightbulb className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Submit Ideas</h3>
                            <p className="text-muted text-sm mb-4">
                                Submit your startup ideas and get AI-powered validation instantly
                            </p>
                            <Link href="/submit">
                                <Button variant="secondary" size="sm">Submit Now</Button>
                            </Link>
                        </Card>

                        <Card className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center">
                                <FileText className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">My Projects</h3>
                            <p className="text-muted text-sm mb-4">
                                Manage all your submitted ideas and track their progress
                            </p>
                            <Link href="/my-projects">
                                <Button variant="secondary" size="sm">View Projects</Button>
                            </Link>
                        </Card>

                        <Card className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center">
                                <Users className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Investor Requests</h3>
                            <p className="text-muted text-sm mb-4">
                                Review and manage access requests from interested investors
                            </p>
                            <Link href="/founder">
                                <Button variant="secondary" size="sm">View Requests</Button>
                            </Link>
                        </Card>

                        <Card className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                                <BarChart3 className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Analytics</h3>
                            <p className="text-muted text-sm mb-4">
                                Track your startup metrics and investor interest over time
                            </p>
                            <Link href="/dashboard">
                                <Button variant="secondary" size="sm">View Analytics</Button>
                            </Link>
                        </Card>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 px-8 text-center">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h2 className="text-4xl font-bold">Turn your idea into reality</h2>
                        <p className="text-xl text-muted">
                            Get validation, connect with investors, and launch your startup
                        </p>
                        <Link href="/submit">
                            <Button size="lg">Submit Your First Idea</Button>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
