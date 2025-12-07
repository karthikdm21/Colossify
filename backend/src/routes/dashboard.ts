import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/dashboard/:role
 * Get dashboard metrics
 */
router.get('/:role', authMiddleware, async (req, res) => {
    try {
        if (req.params.role === 'founder') {
            const [totalIdeas, validatedIdeas, publishedIdeas, investorInterest] = await Promise.all([
                prisma.idea.count({ where: { founderId: req.user?.id } }),
                prisma.idea.count({ where: { founderId: req.user?.id, aiScore: { not: null } } }),
                prisma.idea.count({ where: { founderId: req.user?.id, published: true } }),
                prisma.accessRequest.count({
                    where: {
                        idea: { founderId: req.user?.id },
                        status: 'APPROVED',
                    },
                }),
            ]);

            res.json({
                totalIdeas,
                validatedIdeas,
                publishedIdeas,
                investorInterest,
            });
        } else {
            const [requestsSent, requestsApproved, proposalsSent, proposalsAccepted] = await Promise.all([
                prisma.accessRequest.count({ where: { investorId: req.user?.id } }),
                prisma.accessRequest.count({ where: { investorId: req.user?.id, status: 'APPROVED' } }),
                prisma.proposal.count({ where: { investorId: req.user?.id } }),
                prisma.proposal.count({ where: { investorId: req.user?.id, status: 'ACCEPTED' } }),
            ]);

            res.json({
                requestsSent,
                requestsApproved,
                proposalsSent,
                proposalsAccepted,
            });
        }
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard' });
    }
});

export default router;
