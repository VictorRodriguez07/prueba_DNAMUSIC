import { Request, Response, NextFunction } from 'express';
import { statsService } from '../services/stats.service';
import { JwtPayload } from '../types';

export const statsController = {
    getStats: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stats = await statsService.getStats(req.user as JwtPayload);
            res.json(stats);
        } catch (err) {
            next(err);
        }
    },
};
