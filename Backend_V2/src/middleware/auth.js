import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      console.error('[AUTH MIDDLEWARE] No token found in cookies');
      console.log('[AUTH MIDDLEWARE] Available cookies:', Object.keys(req.cookies));
      return res.status(401).json({ error: "No token provided" });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
    const decoded = jwt.verify(token, JWT_SECRET);
    
    console.log('[AUTH MIDDLEWARE] Token verified for user:', decoded.id);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('[AUTH MIDDLEWARE] Error:', error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;
