import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';
import { SearchFilters } from '../types';

const searchService = new SearchService();

export const searchProducts = (req: Request, res: Response): void => {
  const { q, category, minPrice, maxPrice } = req.query;

  const parsedMin = minPrice !== undefined ? parseFloat(minPrice as string) : undefined;
  const parsedMax = maxPrice !== undefined ? parseFloat(maxPrice as string) : undefined;

  if (parsedMin !== undefined && isNaN(parsedMin)) {
    res.status(400).json({ error: 'minPrice must be a valid number' });
    return;
  }
  if (parsedMax !== undefined && isNaN(parsedMax)) {
    res.status(400).json({ error: 'maxPrice must be a valid number' });
    return;
  }

  const filters: SearchFilters = {
    q: q as string | undefined,
    category: category as string | undefined,
    minPrice: parsedMin,
    maxPrice: parsedMax,
  };

  const result = searchService.search(filters);
  res.json(result);
};
