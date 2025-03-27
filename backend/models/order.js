import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true
  },
  customer_id: {
    type: String,
    required: true
  },
  products: [{
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    farmer_id: String
  }],
  total_amount: {
    type: Number,
    required: true
  },
  delivery_address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  payment_method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'cash_on_delivery'],
    required: true
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  order_status: {
    type: String,
    enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  },
  order_date: {
    type: Date,
    default: Date.now
  },
  delivery_date: {
    type: Date
  }
}, { timestamps: true });

// Create and export the Order model
export const Order = mongoose.model('Order', orderSchema);

// Export the model correctly
export default Order;