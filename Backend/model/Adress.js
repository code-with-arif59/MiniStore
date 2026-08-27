import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    fullname: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  { timestamps: true }
);

// 👉 CHANGE THIS
const Address = mongoose.model("Address", addressSchema);

export default Address;