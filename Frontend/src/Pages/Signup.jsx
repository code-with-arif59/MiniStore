import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [msg, setmsg] = useState("");
  const navigate = useNavigate();

  function handleChnage(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    toast.success("Signup Successfully")

    try {
      const response = await api.post("/api/auth/signup", form);
      setmsg(response.data.message);
      navigate("/login");
    } catch (error) {
      setmsg(error.response?.data?.message || "An Error Occured");
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Account
          </h2>

          {msg && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChnage}
            />

            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChnage}
            />

            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChnage}
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Signup
            </button>
            <p className="text-center mt-3">
              Already Have An Account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
