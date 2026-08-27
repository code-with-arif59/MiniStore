import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Login() {
  const [form, setform] = useState({
    email: "",
    password: "",
  });

  const [msg, setmsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //! handleChange
  function handleChnage(e) {
    const { name, value } = e.target;
    setform({ ...form, [name]: value });
  }

  //! handleSubmit
  async function handleSubmit(e) {                                                                    
    e.preventDefault();
    setmsg("");
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", form);

      console.log("Login Response Data:", response.data);

      // Safe extraction for user data
      const userData = response.data?.user || response.data;
      const userId = userData?._id || userData?.id;
      const role = userData?.role || "user";
      const token = response.data?.token || response.data?.jwt;

      if (!userId) {
        throw new Error("Invalid User Data received from server");
      }

      //! Save in LocalStorage safely
      if (token) localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);

      setmsg("Login successful");
     toast.success("Login Successfully! ✅");
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin/product");
        } else {
          navigate("/home");
          // toast.success("Login Successfully! ✅");
        }
      }, 1000);
    } catch (error) {
      console.error("Login Detailed Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed! Check backend API route or connection.";

      setmsg(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to your account
        </h2>

        {msg && (
          <div
            className={`p-3 rounded-lg mb-4 text-center text-sm font-semibold ${
              msg === "Login successful"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChnage}
            />
          </div>
                                                                            
          <div>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              type="password"
              name="password"
              required
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChnage}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

             <p className="text-center mt-3">
              If You Have Not Account ! Please  {" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Signup
              </Link>
            </p>
        </form>
      </div>
    </div>
  );
}