import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Send OTP
  async function sendOtp(e) {
    e.preventDefault();

    if (!email) {
      toast.error("Please Enter Your Email");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/auth/forgot-password",{email:email});

      toast.success(response.data.message);
      setOtpSent(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Otp Did Not Send"
      );
    } finally {
      setLoading(false);
    }
  }

  // Reset Password
  async function resetPassword(e) {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords match nahi kar rahe");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword,
        confirmPassword,
      });

      toast.success(response.data.message);

      // Login page par bhej do
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm">

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Forgot Password
        </h2>

        {/* Email */}
        {!otpSent ? (
          <form onSubmit={sendOtp} className="space-y-4">

            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

          </form>
        ) : (
          /* OTP + New Password */
          <form onSubmit={resetPassword} className="space-y-4">

            <p className="text-sm text-gray-500 text-center">
              OTP sent to <b>{email}</b>
            </p>

            <input
              type="text"
              placeholder="Enter OTP"   
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>

          </form>
        )}

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-blue-600 hover:underline text-sm"
        >
          ← Back to Login
        </button>

      </div>
    </div>
  );
}