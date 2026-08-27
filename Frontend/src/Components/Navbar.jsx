import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";

export default function Navbar() {
  const [cartCount, setcartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // Login / Signup page check
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    async function loadCart() {

      // Login/signup page par cart load mat karo

      if (!userId || isAuthPage || role === "admin") {
        setcartCount(0);
        return;
      }

      try {
        const response = await api.get(`/cart/${userId}`);
        const items = response.data?.items || [];

        const total = items.reduce(
          (sum, item) => sum + (item?.quantity || 0),
          0
        );

        setcartCount(total);
      } catch (error) {
        console.log("Cart loading error:", error);
        setcartCount(0);
      }
    }

    loadCart();

    window.addEventListener("cartupdated", loadCart);

    return () => {
      window.removeEventListener("cartupdated", loadCart);
    };
  }, [userId, isAuthPage, role]);

  function logout() {
    localStorage.clear();
    setcartCount(0);
    navigate("/login");
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3.5 shadow-sm sticky top-0 z-50 flex justify-between items-center">

      {/* Logo */}
      <Link
        to={userId ? "/home" : "/login"}
        className="font-extrabold text-2xl text-blue-600 tracking-tight flex items-center gap-1"
      >
        <span>MiniStore</span>
        <span className="text-blue-500 text-sm">.</span>
      </Link>

      <div className="flex gap-5 items-center">

        {/* Admin Panel - Only Admin */}
        {userId && !isAuthPage && role === "admin" && (
          <Link
            to="/admin/product"
            className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition"
          >
            Admin Panel
          </Link>
        )}

        {/* My Orders - Only Normal User */}
        {userId && !isAuthPage && role !== "admin" && (
          <Link
            to="/my-orders"
            className="text-gray-700 hover:text-blue-600 font-semibold text-sm transition flex items-center gap-1"
          >
            📦 <span>My Orders</span>
          </Link>
        )}

        {/* Cart - Only Normal User */}
        {userId && !isAuthPage && role !== "admin" && (
          <Link
            to="/cart"
            className="relative p-2 text-gray-700 hover:text-blue-600 transition flex items-center"
          >
            <span className="text-2xl">🛒</span>

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {/* Login / Signup / Logout */}
        {!userId ? (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 px-3 py-1.5 font-medium transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-medium shadow-sm transition"
            >
              Signup
            </Link>
          </div>
        ) : (
          <button
            onClick={logout}
            className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-1.5 rounded-lg text-sm transition cursor-pointer"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}