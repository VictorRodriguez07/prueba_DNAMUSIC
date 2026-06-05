import { Router } from 'express';
import { sedeController } from '../controllers/sede.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.get('/', authenticate, sedeController.getAll);
router.get('/:id', authenticate, sedeController.getById);
router.post('/', authenticate, authorize('ADMIN'), sedeController.create);
router.put('/:id', authenticate, authorize('ADMIN'), sedeController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), sedeController.delete);

export default router;