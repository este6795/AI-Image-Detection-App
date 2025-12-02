import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import authMiddleware from '../middleware/auth.js';

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

    res.json({ success: true, isAdmin: foundUser.isAdmin });
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

// Get current user info
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ 
      id: user._id, 
      email: user.email, 
      isAdmin: user.isAdmin 
    });
  } catch (error) {
    console.error('[AUTH] Error fetching user:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin route to make a user an admin (requires admin status)
router.post("/set-admin", authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser || !currentUser.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const targetUser = await User.findOne({ email });
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    targetUser.isAdmin = true;
    await targetUser.save();
    console.log('[AUTH] User', email, 'promoted to admin by', currentUser.email);

    res.json({ success: true, message: `${email} is now an admin` });
  } catch (error) {
    console.error('[AUTH] Error setting admin:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;