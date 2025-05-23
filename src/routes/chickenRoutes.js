import { Router } from 'express';
import * as chickenController from '../controllers/chickenController';

const router = Router();

router.get('/', chickenController.getAllChickens);
router.get('/:chickenCode', chickenController.getChickenByCode);
router.post('/', chickenController.createChicken);
router.put('/:chickenCode', chickenController.updateChicken);
router.delete('/:chickenCode', chickenController.deleteChicken);

export default router;
