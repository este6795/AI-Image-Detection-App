import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import user from '../models/user.js';

const router = express.Router();

// Register new user
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new user({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ error: "Email already in use" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await user.FindOne({ email });
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
  const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  res.json({ success: true });
});

// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

export default router;