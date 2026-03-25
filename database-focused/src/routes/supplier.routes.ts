import { Router } from 'express';
import { createSupplier } from '../controllers/supplier.controller';


// @desc Routes for supplier
const router = Router();
router.post('/', createSupplier);

export default router;
