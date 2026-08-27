import Cart from "../model/Cart.js";
import Product from "../model/product.js";
import Order from "../model/Order.js";

export async function placeOrder(req, res) {
  try {
    const { userId, addressLine } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart Is Empty" });
    }

    // Deleted products ko filter out karein
    const validItems = cart.items.filter((item) => item.productId !== null);

    if (validItems.length === 0) {
      await Cart.findOneAndUpdate({ userId }, { items: [] });
      return res.status(400).json({ message: "Cart me koi valid item nahi hai. Fresh item add karein!" });
    }

    // 1. Stock Validation Check
    for (let item of validItems) {
      if (item.productId.stock <= 0) {
        return res.status(400).json({
          message: `"${item.productId.title}" out of stock ho chuka hai.`
        });
      }

      if (item.productId.stock < item.quantity) {
        return res.status(400).json({
          message: `"${item.productId.title}" ke sirf ${item.productId.stock} pcs bache hain.`
        });
      }
    }

    // 2. Prepare Order Items
    const orderItems = validItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // 3. Deduct Stock
    for (let item of validItems) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // 4. Create Order
    const order = await Order.create({
      userId,
      items: orderItems,
      addressLine,
      totalAmount,
      paymentMethod: "COD",
    });

    // 5. Clear Cart
    await Cart.findOneAndUpdate({ userId }, { items: [] });
    return res.status(200).json({ message: "Order Placed Successfully", orderId: order._id });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}

export async function getUserOrders(req, res) {
  try {
    const { userId } = req.params;

    // Database se user ke sare orders fetch karein aur products populate karein
    const orders = await Order.find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.log("Get User Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
}