import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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