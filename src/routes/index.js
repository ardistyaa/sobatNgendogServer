import { Router } from 'express';
import chickenRoutes from './chickenRoutess';

const router = Router();

router.use('/chickens', chickenRoutes);

export default router;
