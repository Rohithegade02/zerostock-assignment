import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  supplier_id: mongoose.Types.ObjectId;
  product_name: string;
  quantity: number;
  price: number;
}
// schema for inventory
const inventorySchema = new Schema<IInventory>(
  {
    supplier_id: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
      index: true // Optimization: Indexing on supplier_id to speed up aggregation/lookups
    },
    product_name: { type: String, required: true },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative']
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: (v: number) => v > 0,
        message: 'Price must be greater than 0'
      }
    },
  },
  { timestamps: true }
);

export const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema);
