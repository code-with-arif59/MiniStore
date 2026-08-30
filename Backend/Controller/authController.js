import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

//! Signup User
export async function signup(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if(!name || !email || !password){
          return res.status(400).json({
        message: "all field required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //! Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Default 'user' rahega
    });

    res.status(201).json({
      message: "Signup successful",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//! Login User
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

const user = await User.findOne({ email })

    //! User not found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    //! Compare password
    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    //! Generate JWT Token with Role
    const token = jwt.sign(
      { id: user._id, role: user.role || "user" }, 
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

res.status(200).json({
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  },
});

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//! Forgot Password - Send OTP
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Email not registered"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "MiniStore Password Reset OTP",
      html: `<h1>Your password reset OTP is ${otp}. It is valid for 5 minutes</h1>`
    });

    res.json({
      message: "OTP sent to your email"
    });

  } catch (error) {
  console.log("FORGOT PASSWORD ERROR:", error);
  res.status(500).json({
    message: error.message
  });
}
}


//! Reset Password
export async function resetPassword(req, res) {
  try {
    const {
      email,
      otp,
      newPassword,
      confirmPassword
    } = req.body;

    // Check all fields
    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match"
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Check OTP
    if (
      user.resetOtp !== otp ||
      !user.resetOtpExpiry ||
      user.resetOtpExpiry < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;

    // Remove OTP after successful reset
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

