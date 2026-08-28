import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [address, setAddress] = useState(null);
  const [cart, setCart] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    // Fetch Cart
    api
      .get(`/api/cart/${userId}`)
      .then((res) => {
        setCart(res.data);
      })
      .catch((err) => console.log("Cart fetch error:", err));

    // Fetch Address
    api
      .get(`/api/address/${userId}`)
      .then((res) => {
        setAddress(res.data[0] || null);
      })
      .catch((err) => console.log("Address fetch error:", err));
  }, [userId, navigate]);

  // Handle Quantity Change (+ / -)
  async function handleQuantityChange(productId, newQty) {
    if (newQty < 1) return;

    try {
      await api.post(
        "/api/cart/add",
        { userId, productId, quantity: newQty - getQty(productId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh local state
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.productId?._id === productId
            ? { ...item, quantity: newQty }
            : item
        ),
      }));

      window.dispatchEvent(new Event("cartupdated"));
    } catch (error) {
      console.log("Quantity update error:", error);
    }
  }

  function getQty(productId) {
    const found = cart?.items?.find((item) => item.productId?._id === productId);
    return found ? found.quantity : 1;
  }

  if (!cart) {
    return (
      <div className="text-center py-20 font-semibold text-gray-500">
        Loading Checkout details...
      </div>
    );
  }

  // Filter out invalid/deleted products
  const validItems = cart.items ? cart.items.filter((item) => item.productId !== null) : [];

  // Calculate Total
  const total = validItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  async function placeOrder() {
    if (!address) {
      setErrorMsg("⚠️ Please add a delivery address before placing the order!");
      return;
    }

    if (validItems.length === 0) {
      setErrorMsg("⚠️ Your cart is empty!");
      return;
    }

    try {
      setErrorMsg("");
      setIsPlacingOrder(true);

      const res = await api.post("/api/order/place", {
        userId,
        addressLine: address,
      });

      // 1. Dispatch event to update navbar badge
      window.dispatchEvent(new Event("cartupdated"));

      // 2. Redirect to Order Success Page
      navigate(`/order-success/${res.data.orderId}`);
    } catch (error) {
      console.log("ERROR:", error.response?.data);
      setErrorMsg(error.response?.data?.message || "Failed to place order. Try again!");
    } finally {
      setIsPlacingOrder(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Checkout 💳</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Delivery Address & Cart Items */}
          <div className="md:col-span-2 space-y-6">
            {/* Delivery Address Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">1. Delivery Address</h2>
                {address && (
                  <button
                    onClick={() => navigate("/checkout-address")}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                  >
                    Change
                  </button>
                )}
              </div>

              {address ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="font-bold text-gray-800">{address.fullname}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {address.address}, {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-sm font-medium text-gray-700 mt-1">📞 {address.phone}</p>
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed rounded-xl">
                  <p className="text-gray-500 text-sm mb-3">No delivery address saved!</p>
                  <button
                    onClick={() => navigate("/checkout-address")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
                  >
                    + Add New Address
                  </button>
                </div>
              )}
            </div>

            {/* Order Items Preview with Quantity Controls */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-bold text-gray-800 mb-4">2. Items Preview</h2>
              <div className="divide-y divide-gray-100">
                {validItems.map((item) => (
                  <div key={item.productId._id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productId.image}
                        alt={item.productId.title}
                        className="w-12 h-12 object-contain bg-gray-50 rounded border p-1"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {item.productId.title}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                            className="w-6 h-6 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center active:scale-95 transition"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-gray-800 min-w-[30px] text-center">
                            Qty: {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                            className="w-6 h-6 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center active:scale-95 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      ₹{(item.productId.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Summary & Place Order */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm text-gray-600 border-b pb-4">
                <div className="flex justify-between">
                  <span>Items Total ({validItems.length})</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-semibold text-gray-700">Cash on Delivery</span>
                </div>
              </div>

              <div className="flex justify-between items-center my-4">
                <span className="text-base font-bold text-gray-800">Total Payable:</span>
                <span className="text-xl font-extrabold text-blue-600">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              {errorMsg && (
                <div className="mb-4 text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <button
                onClick={placeOrder}
                disabled={isPlacingOrder}
                className={`w-full py-3 rounded-xl text-white font-bold transition shadow-sm ${
                  isPlacingOrder
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 cursor-pointer"
                }`}
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order (COD) 🚚"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}