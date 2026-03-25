import { Inventory, IInventory } from '../models/Inventory';
import { Supplier } from '../models/Supplier';

export class InventoryService {
  async createInventory(payload: any): Promise<IInventory> {
    const { supplier_id, product_name, quantity, price } = payload;
    
    const supplierExists = await Supplier.findById(supplier_id);
    if (!supplierExists) {
      throw new Error('Valid supplier is required. Supplier not found.');
    }

    const inventory = new Inventory({
      supplier_id,
      product_name,
      quantity,
      price
    });
    return await inventory.save();
  }

  async getGroupedInventory(): Promise<any> {
    return await Inventory.aggregate([
      {
        $group: {
          _id: '$supplier_id',
          totalInventoryValue: { $sum: { $multiply: ['$quantity', '$price'] } },
          inventoryItems: {
            $push: {
              _id: '$_id',
              product_name: '$product_name',
              quantity: '$quantity',
              price: '$price',
              value: { $multiply: ['$quantity', '$price'] }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: '_id',
          foreignField: '_id',
          as: 'supplier'
        }
      },
      { $unwind: '$supplier' },
      { $sort: { totalInventoryValue: -1 } },
      {
        $project: {
          _id: 0,
          supplier: {
            id: '$supplier._id',
            name: '$supplier.name',
            city: '$supplier.city'
          },
          totalInventoryValue: 1,
          inventoryItems: 1
        }
      }
    ]);
  }
}
