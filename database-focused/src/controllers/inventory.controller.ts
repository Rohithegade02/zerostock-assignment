import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';

const inventoryService = new InventoryService();

// @desc Create a new inventory item

export const createInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const inventory = await inventoryService.createInventory(req.body);
    res.status(201).json({ message: 'Inventory created successfully', data: inventory });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(err.message.includes('Supplier not found') ? 404 : 500).json({ error: err.message });
    }
  }
};

// @desc Get all inventory items grouped by supplier

export const getInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const groupedInventory = await inventoryService.getGroupedInventory();
    res.status(200).json({ data: groupedInventory });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
