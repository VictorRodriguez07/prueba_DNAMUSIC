import { Router } from 'express';
import { statsController } from '../controllers/stats.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.get('/', authenticate, authorize('ADMIN'), statsController.getStats);

export default router;
