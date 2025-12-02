import './loadEnv.js';

console.log('[CHECK] MONGO_URI present:', !!process.env.MONGO_URI);
console.log('[CHECK] JWT_SECRET present:', !!process.env.JWT_SECRET);
console.log('[CHECK] API_USER present:', !!process.env.API_USER);
console.log('[CHECK] API_SECRET present:', !!process.env.API_SECRET);
