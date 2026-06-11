import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { verifyToken, requireRole, requireBranch } from '../middleware/auth.js';

const router = Router();

router.get('/:branchId', async (req: Request, res: Response) => {
  const branchId = parseInt(req.params['branchId'] ?? '0');
  const items = await prisma.menuItem.findMany({
    where: { branchId, isAvailable: true },
    orderBy: { category: 'asc' },
  });
  res.json(items);
});

router.post(
  '/',
  verifyToken,
  requireRole(['BRANCH_MANAGER', 'ADMIN']),
  async (req: Request, res: Response) => {
    const { name, description, price, category, branchId: requestBranchId } = req.body as {
      name: string; description?: string; price: number; category: string; branchId?: number;
    };

    if (!name || !price || !category) {
      res.status(400).json({ error: 'name, price and category are required.' });
      return;
    }

    const branchId = req.user!.role === 'ADMIN'
      ? requestBranchId
      : req.user!.branchId;

    if (!branchId) {
      res.status(400).json({ error: 'branchId is required for ADMIN or missing on your account.' });
      return;
    }

    const item = await prisma.menuItem.create({
      data: { name, description, price, category, branchId },
    });
    res.status(201).json(item);
  }
);

router.patch(
  '/:id',
  verifyToken,
  requireRole(['BRANCH_MANAGER', 'ADMIN']),
  async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] ?? '0');
    const item = await prisma.menuItem.findUnique({ where: { id } });

    if (!item) {
      res.status(404).json({ error: 'Item not found.' });
      return;
    }

    if (req.user!.role !== 'ADMIN' && item.branchId !== req.user!.branchId) {
      res.status(403).json({ error: 'Item not found in your branch.' });
      return;
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data:  req.body,
    });
    res.json(updated);
  }
);

export default router;
