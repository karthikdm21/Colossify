'use client';

import { LeftNav } from '@/components/ui/LeftNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

const stories = [
    {
        id: 1,
        title: 'How AI-Powered Learning Platform Raised $2M',
        category: 'EdTech',
        image: 'from-blue-500 to-cyan-400',
        description: 'From idea validation to Series A funding in 18 months',
    },
    {
        id: 2,
        title: 'Sustainable Food Delivery Success Story',
        category: 'GreenTech',
        image: 'from-green-500 to-emerald-400',
        description: 'Building a profitable business while saving the planet',
    },
    {
        id: 3,
        title: 'Remote Collaboration Tool Acquired by Tech Giant',
        category: 'SaaS',
        image: 'from-purple-500 to-pink-400',
        description: 'The journey from MVP to acquisition',
    },
];

export default function ShowcasePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen">
            <LeftNav />

            <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-sm border-b border-card-border">
                <div className="text-xl font-bold">Colossify</div>
                <Button variant="secondary" size="sm" onClick={() => router.push('/')}>
                    Back to Home
                </Button>
            </header>

            <main className="pt-24 pb-16 px-8 lg:pl-32 max-w-7xl mx-auto">
                <div className="mb-12 animate-slide-up">
                    <h1 className="text-4xl font-bold mb-3">Success Stories</h1>
                    <p className="text-muted text-lg">
                        Discover startups that began their journey on our platform
                    </p>
                </div>

                {/* Featured Story */}
                <div className="mb-12 animate-fade-in">
                    <Card className="overflow-hidden">
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className={`h-64 lg:h-full bg-gradient-to-br ${stories[0].image} rounded-xl`} />
                            <div className="py-4">
                                <span className="text-sm text-accent font-medium">{stories[0].category}</span>
                                <h2 className="text-3xl font-bold mt-2 mb-4">{stories[0].title}</h2>
                                <p className="text-muted text-lg mb-6">{stories[0].description}</p>
                                <Button variant="secondary">Read Full Story</Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* More Stories */}
                <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
                    {stories.slice(1).map((story) => (
                        <Card key={story.id}>
                            <div className={`h-48 bg-gradient-to-br ${story.image} rounded-xl mb-4`} />
                            <span className="text-sm text-accent font-medium">{story.category}</span>
                            <h3 className="text-xl font-bold mt-2 mb-3">{story.title}</h3>
                            <p className="text-muted mb-4">{story.description}</p>
                            <Button variant="secondary" size="sm">Read More</Button>
                        </Card>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 text-center animate-fade-in">
                    <h2 className="text-3xl font-bold mb-4">Ready to write your success story?</h2>
                    <Button size="lg" onClick={() => router.push('/submit')}>
                        Submit Your Idea
                    </Button>
                </div>
            </main>
        </div>
    );
}
