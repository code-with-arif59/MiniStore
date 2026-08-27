import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  // Load cart
  async function loadCart() {
    if (!userId) return;

    try {
      const response = await api.get(`/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.log("Cart load error:", error);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  // Remove item
  async function removeItem(productId) {
    await api.post("/cart/remove", {
      userId,
      productId,
    });

    await loadCart();
    window.dispatchEvent(new Event("cartupdated"));
  }

  // Update quantity
  async function updateQTY(productId, quantity, maxStock) {
    if (quantity === 0) {
      await removeItem(productId);
      return;
    }

    if (maxStock !== undefined && quantity > maxStock) {
      alert(`Only ${maxStock} items available in stock!`);
      return;
    }

    await api.post("/cart/update", {
      userId,
      productId,
      quantity,
    });

    await loadCart();
    window.dispatchEvent(new Event("cartupdated"));
  }

  // Loading UI
  if (!cart) {
    return (
      <div className="text-center py-20 font-semibold text-gray-500">
        Loading Cart...
      </div>
    );
  }

  // Filter out null products
  const validItems = cart.items ? cart.items.filter((item) => item.productId !== null) : [];

  // Calculate Total
  const total = validItems.reduce(
    (sum, item) => sum + (item.productId.price || 0) * item.quantity,
    0
  );

  // Stock error check (handling optional stock field gracefully)
  const hasStockError = validItems.some(
    (item) => item.productId.stock !== undefined && (item.quantity > item.productId.stock || item.productId.stock <= 0)
  );

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Shopping Cart 🛒</h1>

        {validItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Your cart is currently empty.</p>

            <button
              onClick={() => navigate("/home")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {validItems.map((item) => {
                const product = item.productId;
                const stock = product.stock ?? 999;
                const isMaxStockReached = item.quantity >= stock;

                return (
                  <div
                    key={product._id}
                    className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4"
                  >
                    {/* Product Details */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-20 h-20 object-contain bg-gray-50 rounded-lg p-1 border"
                      />

                      <div>
                        <h2 className="text-base font-bold text-gray-800 line-clamp-1">
                          {product.title}
                        </h2>

                        <p className="text-gray-600 font-semibold mt-1">
                          ₹{Number(product.price).toFixed(2)}
                        </p>

                        {/* Stock Warning Messages */}
                        {product.stock !== undefined && product.stock <= 0 ? (
                          <p className="text-red-600 font-medium text-xs mt-1">
                            Out of Stock! Please remove this item.
                          </p>
                        ) : product.stock !== undefined && product.stock <= 5 ? (
                          <p className="text-orange-600 text-xs mt-1">
                            Only {product.stock} left in stock!
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                      <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50">
                        <button
                          onClick={() =>
                            updateQTY(product._id, item.quantity - 1, product.stock)
                          }
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition"
                        >
                          -
                        </button>

                        <span className="font-bold px-3 text-sm text-gray-800">
                          {item.quantity}
                        </span>

                        <button
                          disabled={isMaxStockReached}
                          onClick={() =>
                            updateQTY(product._id, item.quantity + 1, product.stock)
                          }
                          className={`px-3 py-1 font-bold transition ${
                            isMaxStockReached
                              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(product._id)}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total & Checkout Section */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xl font-extrabold text-gray-900">
                Total: <span className="text-blue-600">₹{total.toFixed(2)}</span>
              </div>

              <div className="w-full sm:w-auto text-right">
                <button
                  disabled={hasStockError}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl text-white font-bold transition shadow-sm ${
                    hasStockError
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  }`}
                  onClick={() => navigate("/checkout")}
                >
                  Proceed To Checkout 💳
                </button>

                {hasStockError && (
                  <p className="text-red-500 text-xs mt-1">
                    Please fix stock issues before proceeding.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}