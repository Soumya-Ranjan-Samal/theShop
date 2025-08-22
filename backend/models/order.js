import { model, Schema } from "mongoose";

const orderSchema = new Schema({
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  quantity: Number,
  totalAmount: Number, 
  deliveryDate: Date,
  status: {
    type: String,
    enum: ['Placed', 'Packed', 'Shipped', 'Delivered'],
    default: 'Placed'
  },
  Otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isCancelled: {
    type: Boolean,
    default: false
  },
  cancelledAt: {
    type: Date
  },
  cancelReason: {
    type: String
  }
});

const Order = model("Order", orderSchema);

export default Order;