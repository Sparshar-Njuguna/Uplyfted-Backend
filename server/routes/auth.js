import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, role } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered ❌" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await user.save();

    // create token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // return user + token (exclude password)
    const { password: _, ...userData } = user._doc;

    res.status(201).json({
      token,
      user: userData,
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

// LOGIN (you probably already have this but I’m leaving it here so you’re in sync)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: _, ...userData } = user._doc;

    res.status(200).json({
      token,
      user: userData,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

export default router;




