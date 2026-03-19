import mongoose, { Document, Model, Schema } from 'mongoose';

export type OrderStatus = 'pending' | 'paid' | 'rejected';

export interface IOrder extends Document {
  orderId: string;
  amount: number;
  utr?: string;
  status: OrderStatus;
  createdAt: Date;
  user: mongoose.Types.ObjectId;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    amount: { type: Number, required: true },
    utr: { type: String, trim: true, unique: true, sparse: true },
    status: { type: String, enum: ['pending', 'paid', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: false }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
