import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function ProductList() {
  const [product, setproduct] = useState([]);

  async function loadproduct() {
    try {
      const response = await api.get("/product");
      setproduct(response.data.products || []);
    } catch (error) {
      console.log("Error loading products:", error);
      toast.error("Failed to load products");
    }
  }

  async function deletedProduct(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/product/delete/${id}`);
      toast.success("Product deleted successfully!");
      loadproduct();
    } catch (error) {
      console.log("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  }

  useEffect(() => {
    loadproduct();
  }, []);

  return (
    <div className="max-w-6xl mx-auto my-10  px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
          <p className="text-gray-500 text-sm">Manage, edit or delete your store products</p>
        </div>
        <Link
          to="/admin/product/add"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow transition"
        >
          + Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-sm">
            {product.length > 0 ? (
              product.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-contain rounded bg-gray-50 p-1 border"
                    />
                    <span className="font-semibold text-gray-800 line-clamp-1">{item.title}</span>
                  </td>

                  <td className="py-3 px-4 text-gray-600">{item.category || "N/A"}</td>
                  <td className="py-3 px-4 font-bold text-gray-900">₹{item.price}</td>
                  <td className="py-3 px-4 text-gray-600">{item.stock ?? 10}</td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex gap-3 justify-center items-center">
                      <Link
                        to={`/admin/products/update/${item._id}`}
                        className="bg-gray-100 hover:bg-gray-200 text-blue-600 font-medium px-3 py-1 rounded transition"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deletedProduct(item._id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1 rounded transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No products available in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}