import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { triggerN8nWebhook } from '../services/openai';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const createProposalSchema = z.object({
    ideaId: z.string().uuid(),
    fundingAmount: z.number().positive(),
    equityOffer: z.number().min(0).max(100),
    milestones: z.array(z.object({
        description: z.string(),
        amount: z.number(),
        deadline: z.string(),
    })),
    termSheetNotes: z.string().optional(),
});

/**
 * POST /api/proposals
 * Create proposal (Investor only, requires access)
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const data = createProposalSchema.parse(req.body);

        if (req.user?.role !== 'INVESTOR') {
            return res.status(403).json({ error: 'Only investors can create proposals' });
        }

        // Check if investor has access
        const accessRequest = await prisma.accessRequest.findFirst({
            where: {
                ideaId: data.ideaId,
                investorId: req.user.id,
                status: 'APPROVED',
            },
            include: { idea: { include: { founder: true } } },
        });

        if (!accessRequest) {
            return res.status(403).json({ error: 'Access not granted to this idea' });
        }

        // Create proposal
        const proposal = await prisma.proposal.create({
            data: {
                ...data,
                investorId: req.user.id,
                founderId: accessRequest.idea.founderId,
                milestones: JSON.stringify(data.milestones),
            },
        });

        // Create notification
        await prisma.notification.create({
            data: {
                userId: accessRequest.idea.founderId,
                type: 'proposal-received',
                title: 'New Proposal',
                message: `${req.user.name} sent a proposal for ${accessRequest.idea.title}`,
                relatedId: proposal.id,
            },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'PROPOSAL_CREATED',
                actor: req.user.name,
                ideaId: data.ideaId,
                userId: req.user.id,
            },
        });

        // Trigger n8n webhook
        await triggerN8nWebhook('NEW_PROPOSAL', {
            proposalId: proposal.id,
            ideaId: data.ideaId,
            ideaTitle: accessRequest.idea.title,
            investorId: req.user.id,
            investorName: req.user.name,
            founderId: accessRequest.idea.founderId,
            founderName: accessRequest.idea.founder.name,
            fundingAmount: data.fundingAmount,
            equityOffer: data.equityOffer,
        });

        res.json(proposal);
    } catch (error: any) {
        console.error('Error creating proposal:', error);
        res.status(400).json({ error: error.message || 'Failed to create proposal' });
    }
});

/**
 * POST /api/proposals/:id/counter
 * Counter-propose (Founder only)
 */
router.post('/:id/counter', authMiddleware, async (req, res) => {
    try {
        const proposal = await prisma.proposal.findUnique({
            where: { id: req.params.id },
            include: { investor: true, idea: true },
        });

        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        if (proposal.founderId !== req.user?.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const { fundingAmount, equityOffer, milestones, termSheetNotes } = req.body;

        const updated = await prisma.proposal.update({
            where: { id: req.params.id },
            data: {
                fundingAmount,
                equityOffer,
                milestones: JSON.stringify(milestones),
                termSheetNotes,
                status: 'COUNTERED',
            },
        });

        // Notification
        await prisma.notification.create({
            data: {
                userId: proposal.investorId,
                type: 'proposal-countered',
                title: 'Counter-Proposal Received',
                message: `Counter-proposal for ${proposal.idea.title}`,
                relatedId: proposal.id,
            },
        });

        // Trigger n8n webhook
        await triggerN8nWebhook('PROPOSAL_COUNTERED', {
            proposalId: updated.id,
            ideaId: proposal.ideaId,
            investorId: proposal.investorId,
            investorName: proposal.investor.name,
            founderId: req.user.id,
            founderName: req.user.name,
            fundingAmount,
            equityOffer,
        });

        res.json(updated);
    } catch (error) {
        console.error('Error countering proposal:', error);
        res.status(500).json({ error: 'Failed to counter proposal' });
    }
});

/**
 * GET /api/proposals
 * List proposals (filtered by role)
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const where = req.user?.role === 'FOUNDER'
            ? { founderId: req.user.id }
            : { investorId: req.user?.id };

        const proposals = await prisma.proposal.findMany({
            where,
            include: {
                idea: { select: { id: true, title: true } },
                investor: { select: { id: true, name: true } },
                founder: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(proposals);
    } catch (error) {
        console.error('Error listing proposals:', error);
        res.status(500).json({ error: 'Failed to list proposals' });
    }
});

export default router;
