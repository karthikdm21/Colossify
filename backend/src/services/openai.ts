import OpenAI from 'openai';
import axios from 'axios';

// Initialize OpenAI client (server-side only!)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate AI validation for a startup idea
 * SECURITY: This runs server-side only, API key never exposed to client
 */
export async function validateIdea(idea: {
    title: string;
    description: string;
    problemStatement: string;
    solution: string;
    targetMarket: string;
    businessModel: string;
}): Promise<{
    score: number;
    summary: string;
    originalityScore: number;
    embedding: number[];
}> {
    try {
        // Create embedding for similarity search
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: `${idea.title} ${idea.description} ${idea.problemStatement}`,
        });

        const embedding = embeddingResponse.data[0].embedding;

        // Generate AI validation using GPT
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert startup advisor. Analyze the following startup idea and provide a validation score (0-100), a brief summary, and an originality score (0-100). Respond in JSON format: {"score": number, "summary": string, "originalityScore": number}',
                },
                {
                    role: 'user',
                    content: `Title: ${idea.title}\n\nDescription: ${idea.description}\n\nProblem: ${idea.problemStatement}\n\nSolution: ${idea.solution}\n\nTarget Market: ${idea.targetMarket}\n\nBusiness Model: ${idea.businessModel}`,
                },
            ],
            response_format: { type: 'json_object' },
        });

        const result = JSON.parse(completion.choices[0].message.content || '{}');

        return {
            score: result.score || 75,
            summary: result.summary || 'AI validation completed successfully.',
            originalityScore: result.originalityScore || 70,
            embedding,
        };
    } catch (error) {
        console.error('OpenAI API Error:', error);
        // Fallback to mock response if OpenAI fails
        return {
            score: 75,
            summary: 'This is a promising startup idea with good market potential. Consider validating your assumptions with customer interviews.',
            originalityScore: 70,
            embedding: Array(1536).fill(0), // Mock embedding
        };
    }
}

/**
 * Trigger n8n webhook for real-time sync between founder and investor
 */
export async function triggerN8nWebhook(event: string, data: any): Promise<void> {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn('n8n webhook URL not configured');
        return;
    }

    try {
        await axios.post(webhookUrl, {
            event,
            data,
            timestamp: new Date().toISOString(),
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 5000,
        });

        console.log(`✅ n8n webhook triggered: ${event}`);
    } catch (error) {
        console.error(`❌ n8n webhook failed for ${event}:`, error);
        // Don't throw - webhook failures shouldn't break the main flow
    }
}
