'use client';

import { LeftNav } from '@/components/ui/LeftNav';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, FileText, BarChart3 } from 'lucide-react';

export default function HomeInvestorPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen">
            <LeftNav />

            <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-sm border-b border-card-border">
                <div className="text-xl font-bold">Colossify - Investor</div>
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
                            Discover your next investment
                        </h1>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for startup ideas to fund..."
                                className="w-full bg-card-bg border border-card-border rounded-3xl px-6 py-4 pr-14 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                                onFocus={() => router.push('/investor')}
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center">
                            <Link href="/investor">
                                <Button variant="pill" size="sm">Browse Ideas</Button>
                            </Link>
                            <Link href="/my-requests">
                                <Button variant="pill" size="sm">My Requests</Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="pill" size="sm">Dashboard</Button>
                            </Link>
                            <Link href="/showcase">
                                <Button variant="pill" size="sm">Success Stories</Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features for Investors */}
                <section className="py-16 px-8 lg:pl-32 max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">Investment Tools</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                        <Card className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
                                <Search className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Browse Ideas</h3>
                            <p className="text-muted text-sm mb-4">
                                Discover promising startup ideas across various industries
                            </p>
                            <Link href="/investor">
                                <Button variant="secondary" size="sm">Explore Now</Button>
                            </Link>
                        </Card>

                        <Card className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center">
                                <FileText className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">My Requests</h3>
                            <p className="text-muted text-sm mb-4">
                                Track all your access requests and proposal status
                            </p>
                            <Link href="/my-requests">
                                <Button variant="secondary" size="sm">View Requests</Button>
                            </Link>
                        </Card>

                        <Card className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center">
                                <TrendingUp className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Proposals</h3>
                            <p className="text-muted text-sm mb-4">
                                Create and manage investment proposals for startups
                            </p>
                            <Link href="/investor">
                                <Button variant="secondary" size="sm">Make Proposal</Button>
                            </Link>
                        </Card>

                        <Card className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                                <BarChart3 className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Portfolio</h3>
                            <p className="text-muted text-sm mb-4">
                                Monitor your investment portfolio and track performance
                            </p>
                            <Link href="/dashboard">
                                <Button variant="secondary" size="sm">View Portfolio</Button>
                            </Link>
                        </Card>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 px-8 text-center">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h2 className="text-4xl font-bold">Find your next big investment</h2>
                        <p className="text-xl text-muted">
                            Connect with innovative founders and invest in the future
                        </p>
                        <Link href="/investor">
                            <Button size="lg">Start Exploring Ideas</Button>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
