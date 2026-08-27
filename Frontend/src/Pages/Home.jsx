import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Home() {
  const [product, setproduct] = useState([]);
  const [search, setsearch] = useState("");
  const [category, setcategory] = useState("");
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadProduct() {
    try {
      const response = await api.get(
        `/api/product?search=${search}&category=${category}&page=${page}&limit=20`
      );

      const products = response.data.products || [];
      setproduct(products);
      setTotalPages(response.data.totalPages || 1);

      if (products.length > 0) {
        const uniqueCategories = [
          ...new Set(products.map((item) => item.category)),
        ];
        setCategories((prev) =>
          prev.length === 0 ? uniqueCategories : prev
        );
      }
    } catch (error) {
      console.log("Error loading products", error);
    }
  }

  useEffect(() => {
    loadProduct();
  }, [search, category, page]);

  async function addToCart(productId) {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId) {
      toast.error("Pehle Login karein!");
      navigate("/login");
      return;
    }

    try {
      await api.post(
        "/api/cart/add",
        { userId, productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Product Cart me add ho gaya! 🛒");
      window.dispatchEvent(new Event("cartupdated"));
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to add to cart!";
      toast.error(errorMsg);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 px-6 text-center shadow-md mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          Upgrade Your Shopping Experience
        </h1>
        <p className="text-sm md:text-base opacity-90">
          Explore top deals on Electronics, Fashion, and daily essentials.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm mb-8">
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setsearch(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-1/2 border border-gray-300 px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={category}
            onChange={(e) => {
              setcategory(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-auto border border-gray-300 px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-gray-700"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {product.length > 0 ? (
            product.map((item) => {
              const isOutOfStock =
                item.stock !== undefined
                  ? item.stock <= 0
                  : item.countInStock <= 0;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all p-4 flex flex-col justify-between"
                >
                  <Link to={`/product/${item._id}`}>
                    <div className="w-full h-48 rounded-lg bg-gray-50 flex items-center justify-center p-2 mb-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <h2 className="font-bold text-gray-800 text-base line-clamp-1 mb-1">
                      {item.title}
                    </h2>

                    <div className="mb-2">
                      {isOutOfStock ? (
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                          Out of Stock ❌
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                          In Stock ({item.stock ?? item.countInStock}) ✅
                        </span>
                      )}
                    </div>

                    <p className="text-xl font-extrabold text-gray-900 mb-3">
                      ₹{item.price}
                    </p>
                  </Link>

                  <button
                    onClick={() => addToCart(item._id)}
                    disabled={isOutOfStock}
                    className={`w-full font-semibold py-2 rounded-lg transition ${
                      isOutOfStock
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isOutOfStock ? "Out of Stock" : "Add to Cart 🛒"}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 text-lg">No products found!</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm font-semibold text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}