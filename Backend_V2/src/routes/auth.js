import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// Register new user
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    console.log('[AUTH] New user created with ID:', newUser._id);
    
    // Issue JWT token immediately after signup
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) console.warn('[AUTH] Warning: JWT_SECRET is not set in environment variables');
    
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET || 'dev-secret', {
      expiresIn: "1d",
    });
    
    console.log('[AUTH] JWT token issued for new user:', newUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    
    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error('[AUTH] Signup error:', error);
    res.status(400).json({ error: "Email already in use or invalid data" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) console.warn('[AUTH] Warning: JWT_SECRET is not set in environment variables');

    const token = jwt.sign({ id: foundUser._id }, JWT_SECRET || 'dev-secret', {
      expiresIn: "1d",
    });

    console.log('[AUTH] JWT token issued for user login:', foundUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.json({ success: true });
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

export default router;