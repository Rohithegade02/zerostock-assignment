import { Supplier, ISupplier } from '../models/Supplier';

export class SupplierService {
  async createSupplier(name: string, city: string): Promise<ISupplier> {
    if (!name || !city) {
      throw new Error('Name and city are required');
    }
    const supplier = new Supplier({ name, city });
    return await supplier.save();
  }
}
