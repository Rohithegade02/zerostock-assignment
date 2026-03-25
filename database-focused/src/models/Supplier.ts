import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  city: string;
}
// schema for supplier
const supplierSchema = new Schema<ISupplier>(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
  },
  { timestamps: true }
);

export const Supplier = mongoose.model<ISupplier>('Supplier', supplierSchema);
