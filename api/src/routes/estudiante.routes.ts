import { Router } from 'express';
import { estudianteController } from '../controllers/estudiante.controller';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.get('/', authenticate, estudianteController.getAll);
router.get('/:id', authenticate, estudianteController.getById);
router.post('/', authenticate, estudianteController.create);
router.put('/:id', authenticate, estudianteController.update);
router.delete('/:id', authenticate, estudianteController.delete);

export default router;