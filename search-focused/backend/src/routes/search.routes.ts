import { Router, Request, Response } from 'express';
import { searchProducts } from '../controllers/search.controller';

const router = Router();

// GET /api/search?q=<query>&page=<page>&limit=<limit>
router.get('/', searchProducts);

export default router;
