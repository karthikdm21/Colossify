'use client';

import { LeftNav } from '@/components/ui/LeftNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitIdea, validateIdea } from '@/lib/mockApi';
import { addProject } from '@/lib/mockInvestorApi';
import { useInvestorStore } from '@/lib/investorStore';

export default function SubmitPage() {
    const router = useRouter();
    const { currentUser, addProject: addProjectToStore } = useInvestorStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        problem: '',
        solution: '',
        targetMarket: '',
        businessModel: '',
        requestedFunding: '',
        equityOffered: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { id } = await submitIdea(formData);
            await validateIdea(id);

            // Add to projects list for investors to see
            const newProject = await addProject({
                title: formData.title,
                description: formData.description,
                category: formData.category,
                requestedFunding: parseInt(formData.requestedFunding) || 0,
                equityOffered: parseFloat(formData.equityOffered) || 0,
                founderId: currentUser.id,
                founderName: currentUser.name,
            });

            // Update the store so it appears immediately
            addProjectToStore(newProject);

            router.push(`/report/${id}`);
        } catch (error) {
            console.error('Error submitting idea:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen">
            <LeftNav />

            <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-sm border-b border-card-border">
                <div className="text-xl font-bold">Colossify</div>
                <Button variant="secondary" size="sm" onClick={() => router.push('/')}>
                    Back to Home
                </Button>
            </header>

            <main className="pt-24 pb-16 px-8 lg:pl-32 max-w-4xl mx-auto">
                <div className="mb-8 animate-slide-up">
                    <h1 className="text-4xl font-bold mb-3">Submit Your Startup Idea</h1>
                    <p className="text-muted text-lg">
                        Fill in the details below and get instant AI-powered validation.
                    </p>
                </div>

                <Card className="animate-fade-in">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Idea Title *</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50"
                                placeholder="e.g., AI-Powered Learning Platform"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Category *</label>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50"
                            >
                                <option value="">Select a category</option>
                                <option value="AI/ML">AI/ML</option>
                                <option value="FinTech">FinTech</option>
                                <option value="HealthTech">HealthTech</option>
                                <option value="EdTech">EdTech</option>
                                <option value="E-commerce">E-commerce</option>
                                <option value="SaaS">SaaS</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Description *</label>
                            <textarea
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                                placeholder="Brief overview of your idea"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Problem Statement *</label>
                            <textarea
                                name="problem"
                                required
                                value={formData.problem}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                                placeholder="What problem does your idea solve?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Solution *</label>
                            <textarea
                                name="solution"
                                required
                                value={formData.solution}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                                placeholder="How does your idea solve the problem?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Target Market *</label>
                            <input
                                type="text"
                                name="targetMarket"
                                required
                                value={formData.targetMarket}
                                onChange={handleChange}
                                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50"
                                placeholder="e.g., Students, Small businesses, Healthcare providers"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Business Model *</label>
                            <textarea
                                name="businessModel"
                                required
                                value={formData.businessModel}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                                placeholder="How will you make money?"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Requested Funding ($) *</label>
                                <input
                                    type="number"
                                    name="requestedFunding"
                                    required
                                    value={formData.requestedFunding}
                                    onChange={handleChange}
                                    min="0"
                                    step="1000"
                                    className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50"
                                    placeholder="e.g., 500000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Equity Offered (%) *</label>
                                <input
                                    type="number"
                                    name="equityOffered"
                                    required
                                    value={formData.equityOffered}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50"
                                    placeholder="e.g., 10"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                size="lg"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? 'Validating...' : 'Submit & Validate Idea'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>
        </div>
    );
}
