import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function CheckoutAddress() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [address, setAddress] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    async function loadAddress() {
      try {
        const response = await api.get(`/api/address/${userId}`);
        if (response.data && response.data.length > 0) {
          setAddress(response.data[0]);
        }
      } catch (error) {
        console.log("Address loading error:", error);
      }
    }

    loadAddress();
  }, [userId, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function editAddress() {
    setForm({
      fullname: address.fullname || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
    });
    setEditMode(true);
  }

  async function saveAddress(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode) {
        await api.put(`/address/${address._id}`, {
          ...form,
          userId,
        });
        alert("Address updated successfully!");
      } else {
        await api.post("/address/add", {
          ...form,
          userId,
        });
        alert("Address saved successfully!");
      }

      // Fixed typo: /chekout -> /checkout
      navigate("/checkout");
    } catch (error) {
      console.log("Address error:", error);
      alert(error.response?.data?.message || "Address save/update failed");
    } finally {
      setLoading(false);
    }
  }

  // Saved Address View Screen
  if (address && !editMode) {
    return (
      <div className="max-w-xl mx-auto p-6 mt-6 bg-white rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Delivery Address 📍</h1>

        <div className="border border-gray-200 p-5 rounded-lg bg-gray-50">
          <h2 className="font-bold text-lg text-gray-800">{address.fullname}</h2>
          <p className="text-gray-600 text-sm mt-1">📞 {address.phone}</p>
          <p className="text-gray-600 text-sm mt-1">{address.address}</p>
          <p className="text-gray-600 text-sm">
            {address.city}, {address.state} - {address.pincode}
          </p>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => navigate("/checkout")}
              className="flex-1 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Deliver to this Address
            </button>
            <button
              onClick={editAddress}
              className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
            >
              ✏️ Edit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Add / Edit Form Screen
  return (
    <div className="max-w-xl mx-auto p-6 mt-6 bg-white rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {editMode ? "Edit Delivery Address ✏️" : "Add Delivery Address 🏠"}
      </h1>

      <form onSubmit={saveAddress} className="space-y-4">
        {Object.keys(form).map((key) => (
          <div key={key}>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              {key}
            </label>
            <input
              name={key}
              value={form[key]}
              placeholder={`Enter ${key}`}
              onChange={handleChange}
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 capitalize"
            />
          </div>
        ))}

        <div className="pt-2 flex gap-3">
          {editMode && (
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="w-1/3 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`flex-1 text-white font-bold py-2.5 rounded-lg transition ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "Saving..."
              : editMode
              ? "Update Address"
              : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
}