import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    async function fetchOrders() {
      try {
        const response = await api.get(`/order/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userId, navigate, token]);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "pending";
    if (s === "delivered") {
      return "bg-green-100 text-green-700 border-green-200";
    }
    if (s === "shipped") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }
    if (s === "cancelled") {
      return "bg-red-100 text-red-700 border-red-200";
    }
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  if (loading) {
    return (
      <div className="text-center py-20 font-semibold text-gray-500">
        Loading your orders... 📦
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">My Orders 📦</h1>
          <button
            onClick={() => navigate("/home")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            ← Back to Shop
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm font-semibold">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-10 text-center">
            <div className="text-5xl mb-4">🛍️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Orders Found</h2>
            <p className="text-gray-500 text-sm mb-6">
              Looks like you haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-sm"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderTotal = order.items
                ? order.items.reduce(
                    (sum, item) =>
                      sum + (item.productId?.price || item.price || 0) * item.quantity,
                    0
                  )
                : order.totalAmount || 0;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border overflow-hidden"
                >
                  <div className="bg-gray-50 p-4 border-b flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                        Order ID
                      </p>
                      <p className="font-mono font-bold text-gray-800 text-sm">
                        #{order._id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                        Date
                      </p>
                      <p className="text-xs font-medium text-gray-700">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border uppercase ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 divide-y divide-gray-100">
                    {order.items &&
                      order.items.map((item, idx) => (
                        <div
                          key={item.productId?._id || idx}
                          className="py-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            {item.productId?.image && (
                              <img
                                src={item.productId.image}
                                alt={item.productId.title || "Product"}
                                className="w-14 h-14 object-contain bg-gray-50 rounded-lg border p-1"
                              />
                            )}
                            <div>
                              <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                                {item.productId?.title || "Product Details N/A"}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Qty: {item.quantity} × ₹
                                {item.productId?.price || item.price}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-gray-800">
                            ₹
                            {(
                              (item.productId?.price || item.price || 0) * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      ))}
                  </div>

                  <div className="bg-gray-50/50 p-4 border-t flex flex-wrap justify-between items-center gap-4">
                    {order.addressLine && (
                      <div className="text-xs text-gray-600">
                        <span className="font-bold text-gray-700 block">
                          Delivering To:
                        </span>
                        <p>
                          {order.addressLine.fullname} - {order.addressLine.phone}
                        </p>
                        <p className="line-clamp-1">
                          {order.addressLine.address}, {order.addressLine.city}
                        </p>
                      </div>
                    )}

                    <div className="text-right ml-auto">
                      <span className="text-xs text-gray-500 block">Total Amount</span>
                      <span className="text-lg font-extrabold text-blue-600">
                        ₹{Number(orderTotal).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}