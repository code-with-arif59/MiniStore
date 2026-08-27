import Cart from "../model/Cart.js";
import Product from "../model/product.js";

//! Add To Cart

export async function addToCart(req, res) {
  try {
    const { userId, productId } = req.body;

    // 1. Product & Stock Check
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ message: "Item out of stock hai" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity: 1 }] });
    } else {
      const item = cart.items.find((i) => i.productId.toString() === productId);

      if (item) {
        // 2. Quantity vs Stock Check
        if (item.quantity + 1 > product.stock) {
          return res.status(400).json({
            message: `Sirf ${product.stock} pcs available hain. Aur add nahi kar sakte.`,
          });
        }
        item.quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save();
    return res.status(200).json({
      message: "Item Added To Cart",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

//! Remove Cart
export async function removeItem(req, res) {
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart Not Found" });
    }

    cart.items = cart.items.filter((i) => i.productId.toString() != productId);
    await cart.save();
    res.json({
      message: "item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error,
    });
  }
}

//! Update Quantity

export async function updateQuantity(req, res) {
  try {
    const { productId, quantity, userId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart Not Found" });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "item  Not Found in cart" });
    }
    item.quantity = quantity;
    await cart.save();

    res.json({
      message: "update cart successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error,
    });
  }
}

//! Get Cart By UserId

export async function getCart(req, res) {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.json(cart);
  } catch (error) {
    console.log(error, "Got Error From Get Cart");
        res.status(500).json({
      message: "server error",
      error,
    });
  }
}
