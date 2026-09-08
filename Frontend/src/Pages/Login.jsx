import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setform] = useState({
    email: "",
    password: "",
  });

  const [msg, setmsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  function handleChnage(e) {
    const { name, value } = e.target;

    setform({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setmsg("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", form);

      console.log("Login Response Data:", response.data);

      const userData = response.data?.user || response.data;

      const userId = userData?._id || userData?.id;

      const role = userData?.role || "user";

      const token =
        response.data?.token || response.data?.jwt;

      if (!userId) {
        throw new Error("Invalid User Data received from server");
      }

      if (token) {
        localStorage.setItem("token", token);
      }

      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);

      setmsg("Login successful");

      toast.success("Login Successfully! ✅");

      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin/product", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      }, 1000);

    } catch (error) {
      console.error("Login Detailed Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed!";

      setmsg(errorMessage);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChnage}
          placeholder="Enter Email"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChnage}
          placeholder="Enter Password"
        />

        {msg && (
          <div
            className={
              msg === "Login successful"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }
          >
            {msg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <Link to="/forgot-password">
          Forgot Password?
        </Link>

        <Link to="/signup">
          Create Account
        </Link>

      </form>
    </div>
  );
}