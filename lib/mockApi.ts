// Mock API functions with realistic delays

export interface IdeaSubmission {
    title: string;
    description: string;
    category: string;
    problem: string;
    solution: string;
    targetMarket: string;
    businessModel: string;
}

export interface ValidationResult {
    id: string;
    overallScore: number;
    scores: {
        innovation: number;
        market: number;
        feasibility: number;
        team: number;
    };
    risks: string[];
    suggestions: string[];
    summary: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function submitIdea(idea: IdeaSubmission): Promise<{ id: string }> {
    await delay(1500);
    return {
        id: `idea-${Date.now()}`,
    };
}

export async function validateIdea(id: string): Promise<ValidationResult> {
    await delay(2000);

    return {
        id,
        overallScore: 78,
        scores: {
            innovation: 85,
            market: 72,
            feasibility: 75,
            team: 80,
        },
        risks: [
            'Market competition is high in this sector',
            'Technical implementation may require specialized expertise',
            'Customer acquisition cost could be significant',
        ],
        suggestions: [
            'Consider partnering with established players for faster market entry',
            'Develop a minimum viable product to test market response',
            'Build a strong advisory board with industry expertise',
            'Focus on a specific niche before expanding',
        ],
        summary: 'Your idea shows strong innovation potential with a clear value proposition. The market opportunity is significant, though competitive. Focus on execution and building the right team to maximize success chances.',
    };
}

export async function getDashboardMetrics() {
    await delay(800);

    return {
        totalIdeas: 24,
        validatedIdeas: 18,
        publishedIdeas: 12,
        investorInterest: 8,
        avgScore: 76,
    };
}

export async function getRecentIdeas() {
    await delay(600);

    return [
        { id: '1', title: 'AI-Powered Learning Platform', status: 'validated', score: 82, date: '2025-12-05' },
        { id: '2', title: 'Sustainable Food Delivery', status: 'submitted', score: null, date: '2025-12-04' },
        { id: '3', title: 'Remote Team Collaboration Tool', status: 'published', score: 78, date: '2025-12-03' },
        { id: '4', title: 'Health Monitoring Wearable', status: 'validated', score: 85, date: '2025-12-02' },
    ];
}
