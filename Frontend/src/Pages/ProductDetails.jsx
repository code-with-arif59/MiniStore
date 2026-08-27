import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
export default function ProductDetails() {
  const { id } = useParams();
  const [product, setproduct] = useState(null);

async function loadproduct() {
  try {
    // 👉 yahan
    const response = await api.get("/api/product");

    // 👉 API ke turant neeche
    const productt = response.data.products.find(
      (item) => String(item._id) === String(id)
    );

    // 👉 uske neeche
    setproduct(productt);

  } catch (error) {
    console.log("Error loading product:", error);
  }
}

useEffect(() => {
  loadproduct();
}, [id]);

  // Add To Cart
  async function addToCart() {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Please login to add items to your cart");
        return;
      }

      await api.post("/cart/add", {
        userId,
        productId: product._id,
      });

      alert("Item added to cart");

      window.dispatchEvent(new Event("cartupdated"));
    } catch (error) {
      console.log("Add to cart error:", error);
      alert("Failed to add item to cart");
    }
  }

  if (!product) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8">

      {/* Product Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border rounded-lg p-8 shadow">

        {/* Product Image */}
        <div className="flex justify-center items-center bg-gray-50 rounded-lg p-6">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-96 object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">

          <h1 className="text-3xl font-bold mb-3">
            {product.title}
          </h1>

          <p className="text-gray-500 text-lg mb-4">
            Category: {product.category}
          </p>

          <p className="text-gray-600 leading-7 mb-6">
            {product.description}
          </p>

          <p className="text-3xl font-bold text-gray-800 mb-6">
            ₹{product.price}
          </p>

          {/* 👉 Add To Cart */}
          <button
            onClick={addToCart}
            className="w-fit bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Add To Cart 🛒
          </button>

        </div>
      </div>
    </div>
  );
}
