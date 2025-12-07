import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { triggerN8nWebhook } from '../services/openai';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const createAccessRequestSchema = z.object({
    ideaId: z.string().uuid(),
    message: z.string().min(10),
    ndaRequired: z.boolean().optional(),
});

/**
 * POST /api/access-requests
 * Create access request (Investor only)
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const data = createAccessRequestSchema.parse(req.body);

        if (req.user?.role !== 'INVESTOR') {
            return res.status(403).json({ error: 'Only investors can request access' });
        }

        // Check if idea exists
        const idea = await prisma.idea.findUnique({
            where: { id: data.ideaId },
            include: { founder: true },
        });

        if (!idea) {
            return res.status(404).json({ error: 'Idea not found' });
        }

        // Create access request
        const accessRequest = await prisma.accessRequest.create({
            data: {
                ...data,
                investorId: req.user.id,
            },
        });

        // Create notification for founder
        await prisma.notification.create({
            data: {
                userId: idea.founderId,
                type: 'access-request',
                title: 'New Access Request',
                message: `${req.user.name} requested access to ${idea.title}`,
                relatedId: accessRequest.id,
            },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'ACCESS_REQUEST_CREATED',
                actor: req.user.name,
                ideaId: idea.id,
                userId: req.user.id,
            },
        });

        // Trigger n8n webhook for real-time sync
        await triggerN8nWebhook('ACCESS_REQUEST_CREATED', {
            requestId: accessRequest.id,
            ideaId: idea.id,
            ideaTitle: idea.title,
            investorId: req.user.id,
            investorName: req.user.name,
            founderId: idea.founderId,
            founderName: idea.founder.name,
            message: data.message,
            ndaRequired: data.ndaRequired,
        });

        res.json(accessRequest);
    } catch (error: any) {
        console.error('Error creating access request:', error);
        res.status(400).json({ error: error.message || 'Failed to create access request' });
    }
});

/**
 * POST /api/access-requests/:id/respond
 * Respond to access request (Founder only)
 */
router.post('/:id/respond', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body; // 'APPROVED' | 'REJECTED' | 'MORE_INFO'

        const accessRequest = await prisma.accessRequest.findUnique({
            where: { id: req.params.id },
            include: { idea: true, investor: true },
        });

        if (!accessRequest) {
            return res.status(404).json({ error: 'Access request not found' });
        }

        if (accessRequest.idea.founderId !== req.user?.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Update access request
        const updated = await prisma.accessRequest.update({
            where: { id: req.params.id },
            data: { status },
        });

        // Create notification for investor
        await prisma.notification.create({
            data: {
                userId: accessRequest.investorId,
                type: status === 'APPROVED' ? 'access-approved' : 'access-rejected',
                title: status === 'APPROVED' ? 'Access Granted' : 'Access Denied',
                message: `Your access request for ${accessRequest.idea.title} was ${status.toLowerCase()}`,
                relatedId: accessRequest.id,
            },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'ACCESS_REQUEST_RESPONDED',
                actor: req.user.name,
                ideaId: accessRequest.ideaId,
                userId: req.user.id,
                details: JSON.stringify({ status }),
            },
        });

        // Trigger n8n webhook for real-time sync
        await triggerN8nWebhook('ACCESS_REQUEST_RESPONDED', {
            requestId: updated.id,
            ideaId: accessRequest.ideaId,
            ideaTitle: accessRequest.idea.title,
            investorId: accessRequest.investorId,
            investorName: accessRequest.investor.name,
            founderId: req.user.id,
            founderName: req.user.name,
            status,
        });

        res.json(updated);
    } catch (error) {
        console.error('Error responding to access request:', error);
        res.status(500).json({ error: 'Failed to respond to access request' });
    }
});

/**
 * GET /api/access-requests
 * List access requests (filtered by role)
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const where = req.user?.role === 'FOUNDER'
            ? { idea: { founderId: req.user.id } }
            : { investorId: req.user?.id };

        const requests = await prisma.accessRequest.findMany({
            where,
            include: {
                idea: { select: { id: true, title: true } },
                investor: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(requests);
    } catch (error) {
        console.error('Error listing access requests:', error);
        res.status(500).json({ error: 'Failed to list access requests' });
    }
});

export default router;
