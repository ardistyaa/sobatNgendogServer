import { Router } from 'express';
import chickenRoutes from './chickenRoutes.js';

const router = Router();

router.use('/chickens', chickenRoutes);

export default router;
