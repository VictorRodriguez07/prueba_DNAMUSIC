import { Request, Response, NextFunction } from 'express';
import { statsService } from '../services/stats.service';

export const statsController = {
    getStats: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const stats = await statsService.getStats();
            res.json(stats);
        } catch (err) {
            next(err);
        }
    },
};
