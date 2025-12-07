import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { validateIdea, triggerN8nWebhook } from '../services/openai';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Validation schema
const createIdeaSchema = z.object({
    title: z.string().min(3).max(200),
    category: z.string(),
    description: z.string().min(10),
    problemStatement: z.string().min(10),
    solution: z.string().min(10),
    targetMarket: z.string().min(5),
    businessModel: z.string().min(5),
    requestedFunding: z.number().positive(),
    equityOffered: z.number().min(0).max(100),
    traction: z.string().optional(),
});

/**
 * POST /api/ideas/validate
 * Submit and validate a new idea (Founder only)
 */
router.post('/validate', authMiddleware, async (req, res) => {
    try {
        // Validate request body
        const data = createIdeaSchema.parse(req.body);

        // Check if user is a founder
        if (req.user?.role !== 'FOUNDER') {
            return res.status(403).json({ error: 'Only founders can submit ideas' });
        }

        // Call OpenAI for validation (server-side only!)
        const aiValidation = await validateIdea(data);

        // Save idea to database
        const idea = await prisma.idea.create({
            data: {
                ...data,
                founderId: req.user.id,
                aiScore: aiValidation.score,
                aiSummary: aiValidation.summary,
                originalityScore: aiValidation.originalityScore,
                embedding: JSON.stringify(aiValidation.embedding),
            },
        });

        // Create audit log
        await prisma.auditLog.create({
            data: {
                action: 'IDEA_CREATED',
                actor: req.user.name,
                ideaId: idea.id,
                userId: req.user.id,
                details: JSON.stringify({ title: idea.title }),
            },
        });

        // Trigger n8n webhook for real-time sync
        await triggerN8nWebhook('NEW_IDEA_VALIDATED', {
            ideaId: idea.id,
            founderId: req.user.id,
            founderName: req.user.name,
            title: idea.title,
            score: aiValidation.score,
        });

        res.json({
            id: idea.id,
            ...data,
            aiScore: aiValidation.score,
            aiSummary: aiValidation.summary,
            originalityScore: aiValidation.originalityScore,
        });
    } catch (error: any) {
        console.error('Error validating idea:', error);
        res.status(400).json({ error: error.message || 'Failed to validate idea' });
    }
});

/**
 * GET /api/ideas/:id
 * Get idea details with visibility control
 */
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const idea = await prisma.idea.findUnique({
            where: { id: req.params.id },
            include: {
                founder: {
                    select: { id: true, name: true, email: true },
                },
                accessRequests: {
                    where: { investorId: req.user?.id, status: 'APPROVED' },
                },
            },
        });

        if (!idea) {
            return res.status(404).json({ error: 'Idea not found' });
        }

        // Check access permissions
        const isFounder = idea.founderId === req.user?.id;
        const hasAccess = idea.accessRequests.length > 0;

        if (!isFounder && !hasAccess && !idea.published) {
            // Return summary only
            return res.json({
                id: idea.id,
                title: idea.title,
                category: idea.category,
                description: idea.description.substring(0, 100) + '...',
                requestedFunding: idea.requestedFunding,
                equityOffered: idea.equityOffered,
                traction: idea.traction,
                visibility: 'summary',
            });
        }

        // Return full details
        res.json({
            ...idea,
            visibility: 'full',
        });
    } catch (error) {
        console.error('Error fetching idea:', error);
        res.status(500).json({ error: 'Failed to fetch idea' });
    }
});

/**
 * GET /api/ideas
 * List all ideas (with visibility filtering)
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const ideas = await prisma.idea.findMany({
            where: req.user?.role === 'FOUNDER'
                ? { founderId: req.user.id }
                : { published: true },
            include: {
                founder: {
                    select: { id: true, name: true },
                },
                accessRequests: {
                    where: { investorId: req.user?.id },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Map to include access status
        const ideasWithAccess = ideas.map(idea => ({
            id: idea.id,
            title: idea.title,
            category: idea.category,
            description: idea.description.substring(0, 150),
            requestedFunding: idea.requestedFunding,
            equityOffered: idea.equityOffered,
            traction: idea.traction,
            founderName: idea.founder.name,
            founderId: idea.founder.id,
            accessStatus: idea.accessRequests[0]?.status || 'none',
            hasAccess: idea.accessRequests.some(r => r.status === 'APPROVED'),
        }));

        res.json(ideasWithAccess);
    } catch (error) {
        console.error('Error listing ideas:', error);
        res.status(500).json({ error: 'Failed to list ideas' });
    }
});

/**
 * POST /api/ideas/:id/publish
 * Publish an idea to showcase (Founder only)
 */
router.post('/:id/publish', authMiddleware, async (req, res) => {
    try {
        const idea = await prisma.idea.findUnique({
            where: { id: req.params.id },
        });

        if (!idea) {
            return res.status(404).json({ error: 'Idea not found' });
        }

        if (idea.founderId !== req.user?.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const updated = await prisma.idea.update({
            where: { id: req.params.id },
            data: { published: true },
        });

        // Trigger n8n webhook
        await triggerN8nWebhook('SHOWCASE_PUBLISHED', {
            ideaId: updated.id,
            title: updated.title,
            founderId: req.user.id,
        });

        res.json(updated);
    } catch (error) {
        console.error('Error publishing idea:', error);
        res.status(500).json({ error: 'Failed to publish idea' });
    }
});

export default router;
