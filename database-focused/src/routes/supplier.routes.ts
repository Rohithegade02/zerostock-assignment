import { Router } from 'express';
import { createSupplier } from '../controllers/supplier.controller';

const router = Router();
router.post('/', createSupplier);

export default router;
