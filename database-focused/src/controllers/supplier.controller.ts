import { Request, Response } from 'express';
import { SupplierService } from '../services/supplier.service';

const supplierService = new SupplierService();

// @desc Create a new supplier

export const createSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, city } = req.body;
    const supplier = await supplierService.createSupplier(name, city);
    res.status(201).json({ message: 'Supplier created successfully', data: supplier });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
