# Backend (Backend_V2)

This folder contains the Node/Express backend for the AI Image Detection project.

Quick setup:

1. Copy `.env.example` to `.env` and set environment variables
1. Copy `.env.example` to `.env` (place it under `Backend_V2/.env`) and set environment variables
2. Install dependencies:

```cmd
npm install
```

3. Start the server in development mode (run commands from `Backend_V2` folder):

```cmd
npm run dev
# or run `npm start` for production (in `Backend_V2` folder)
```

The server file is `src/server.js`. It uses ES modules and expects `type: module` in the package.json.

## Environment Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - A secret for signing JWT tokens (set to a secure value in production)
- `API_USER` / `API_SECRET` - SightEngine API credentials
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `PORT` - Optional server port (default 5000)

## Project Structure

```
src/
├── server.js              # Main Express server setup
├── db.js                  # MongoDB connection
├── loadEnv.js             # Environment variables loader
├── checkEnv.js            # Environment validation
├── middleware/
│   ├── auth.js            # JWT authentication middleware
│   └── upload.js          # File upload middleware
├── models/
│   ├── user.js            # User model with admin support
│   ├── ImageResults.js    # Image detection results model
│   └── cleanup.js         # Cleanup utilities
└── routes/
    ├── auth.js            # Authentication routes
    ├── detect.js          # Image detection routes
    └── results.js         # Results retrieval and deletion routes
```

## Authentication System

### User Account Creation

**Endpoint**: `POST /auth/signup`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User created successfully"
}
```

**Details**:
- Passwords are hashed using bcryptjs (10 salt rounds)
- JWT token is issued immediately upon signup
- Token is stored in an HTTP-only, secure cookie with 1-day expiration
- Email must be unique in the database
- Minimum password length recommended: 6 characters

### User Login

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "isAdmin": false
}
```

**Details**:
- Returns user's admin status
- JWT token stored in HTTP-only cookie (credentials: true required on frontend)
- Token expires in 1 day

### User Logout

**Endpoint**: `POST /auth/logout`

**Response**:
```json
{
  "success": true
}
```

**Details**:
- Clears the authentication token cookie
- Frontend should clear localStorage as well

### Get Current User Info

**Endpoint**: `GET /auth/me`

**Headers**: Requires valid JWT token in cookie

**Response** (200 OK):
```json
{
  "id": "userid123",
  "email": "user@example.com",
  "isAdmin": false
}
```

## Admin System

### Admin Features
- View all users' detection history
- Delete any detection result
- Promote other users to admin status

### Create First Admin Account

**Option 1: MongoDB CLI**
```bash
# Connect to MongoDB
mongosh

# Find your user
db.users.findOne({ email: "admin@example.com" })

# Update to admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

**Option 2: Using the Set Admin Endpoint** (requires existing admin)

**Endpoint**: `POST /auth/set-admin`

**Headers**: Requires valid JWT token in cookie (must be admin)

**Request Body**:
```json
{
  "email": "newadmin@example.com"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "newadmin@example.com is now an admin"
}
```

**Error Responses**:
- `403 Unauthorized` - Only admins can promote other users
- `404 Not Found` - User with that email doesn't exist

### Admin Endpoints

#### View All Users' Detection History (Admin Only)

**Endpoint**: `GET /api/results`

**Headers**: Requires valid JWT token in cookie (must be admin)

**Response** (200 OK):
```json
[
  {
    "_id": "resultid123",
    "userId": {
      "_id": "userid123",
      "email": "user@example.com"
    },
    "filename": "image.jpg",
    "result": {
      "type": {
        "ai_generated": 0.85
      }
    },
    "createdAt": "2025-12-02T10:30:00.000Z"
  }
]
```

#### Delete Detection Result (Admin Only)

**Endpoint**: `DELETE /api/results/:id`

**Headers**: Requires valid JWT token in cookie (must be admin)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Result deleted successfully"
}
```

**Error Responses**:
- `403 Forbidden` - Only admins can delete results
- `404 Not Found` - Result doesn't exist

## Regular User Endpoints

### Upload and Detect Image

**Endpoint**: `POST /detect`

**Headers**: Requires valid JWT token in cookie

**Request**: Form data with image file
```
Content-Type: multipart/form-data
image: <binary image file>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Detection complete",
  "result": {
    "type": {
      "ai_generated": 0.15
    }
  }
}
```

**Details**:
- Image is analyzed using Sightengine API
- Result is stored in database linked to the uploading user
- Only authenticated users can upload

### Get User's Own Detection History

**Endpoint**: `GET /api/results`

**Headers**: Requires valid JWT token in cookie

**Response** (200 OK):
```json
[
  {
    "_id": "resultid123",
    "userId": "userid123",
    "filename": "image.jpg",
    "result": {
      "type": {
        "ai_generated": 0.85
      }
    },
    "createdAt": "2025-12-02T10:30:00.000Z"
  }
]
```

**Details**:
- Returns only the authenticated user's detections
- Sorted by creation date (newest first)

### Get Image from Detection Result

**Endpoint**: `GET /api/results/image/:id`

**Headers**: Requires valid JWT token in cookie

**Response** (200 OK): Binary image data

**Details**:
- Users can only access their own images
- Admins can access any image
- Returns appropriate image MIME type

## Authentication Flow

1. User signs up → Password hashed → JWT token issued → Stored in HTTP-only cookie
2. User logs in → Password verified → JWT token issued → Stored in HTTP-only cookie
3. User makes authenticated request → Middleware verifies JWT from cookie
4. User logs out → Cookie cleared → Token invalidated

## Security Features

- **Password Hashing**: bcryptjs with 10 salt rounds
- **JWT Tokens**: 1-day expiration, signed with SECRET
- **HTTP-Only Cookies**: Cannot be accessed via JavaScript (XSS protection)
- **CORS**: Restricted to configured frontend URL with credentials support
- **Authorization Checks**: Admin-only endpoints verify user status
- **User Isolation**: Regular users can only see their own data

## Database Models

### User Schema
```javascript
{
  email: String (unique, required),
  password: String (required, hashed),
  isAdmin: Boolean (default: false)
}
```

### ImageResult Schema
```javascript
{
  userId: ObjectId (ref: User, required),
  filename: String,
  result: Object,
  image: {
    data: Buffer,
    contentType: String
  },
  createdAt: Date (default: now)
}
```

## Troubleshooting

### "No token provided" error
- Ensure frontend sends requests with `withCredentials: true`
- Check that JWT_SECRET matches between auth.js and auth middleware
- Verify cookies are being sent in requests

### "Invalid or expired token" error
- Token may have expired (1 day)
- User needs to log in again
- Check JWT_SECRET is consistent

### User can't upload images
- Ensure user is authenticated (has valid token)
- Check that token is in cookies (check browser DevTools)
- Verify authMiddleware is applied to `/detect` route

### Admin features not working
- Verify user has `isAdmin: true` in database
- Check that admin is properly authenticated
- Ensure API requests include `withCredentials: true`
