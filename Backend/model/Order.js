import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: "user" 
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "Product" 
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  addressLine: {
    fullname: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  totalAmount: Number,
  paymentMethod: {
    type: String,
    default: 'COD'
  },
  status: {
    type: String,
    default: "placed"
  }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;