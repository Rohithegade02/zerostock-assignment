import { Router } from 'express';
import { createInventory, getInventory } from '../controllers/inventory.controller';

const router = Router();
router.post('/', createInventory);
router.get('/', getInventory);

export default router;
