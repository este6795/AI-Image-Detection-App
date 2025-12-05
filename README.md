# AI-Image-Detection-App

An Project for BACS 350

## Description

Our project, AI Image Detector, is a web-based application designed to determine
whether an uploaded image is AI-generated or authentic. Using a React frontend and a
Node.js backend, the system allows users to upload an image, which is then analyzed
through an AI detection API or pretrained model. The backend processes the image and
returns a probability score indicating the likelihood of the image being synthetic. The
goal is to provide a simple and intuitive tool that helps users verify image authenticity,
raise awareness about AI-generated media, and demonstrate how modern full-stack
systems can integrate AI-based decision-making.

## Project Structure

```
AI-Image-Detection-App/
├── Backend_V2/              # Node/Express backend
│   ├── src/
│   │   ├── server.js        # Main Express server
│   │   ├── db.js            # MongoDB connection
│   │   ├── middleware/      # Auth and upload middleware
│   │   ├── models/          # User and ImageResult schemas
│   │   └── routes/          # API endpoints
│   ├── README.md            # Backend documentation
│   └── package.json
├── Frontend-seerat/         # React Vite frontend
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── components/      # React components
│   │   └── assets/          # Images and videos
│   ├── README.md            # Frontend documentation
│   └── package.json
└── repobackups/             # Old versions (archived)
```

## Key Features

### User Authentication System

- **User Signup**: Create account with email and password
- **User Login**: Secure login with JWT tokens stored in HTTP-only cookies
- **Password Security**: Passwords hashed with bcryptjs (10 salt rounds)
- **Session Management**: 1-day JWT token expiration
- **User Isolation**: Each user's detection history is private and separate

### Image Detection

- Upload images for AI-generation analysis
- Real-time detection using Sightengine API
- Confidence scores for authenticity assessment
- Detection history tracking per user

### Admin Dashboard

- View all users' detection history
- See which user submitted each image
- Delete detection results from the system
- Promote other users to admin status

## Recent Updates (December 2025)

### Backend Improvements

- **Modularized Server Architecture**: Separated concerns into middleware, models, and routes
- **User Account System**: Complete signup/login/logout flow with JWT authentication
- **Admin System**: Role-based access control with admin-only endpoints
- **Database Integration**: MongoDB models for users and detection results
- **Authentication Middleware**: Protected routes requiring valid JWT tokens
- **Authorization Checks**: Admin-only endpoints with proper permission validation

### Frontend Enhancements

- **Authentication Modal**: Sign up and login interface
- **User State Management**: Tracks authenticated user and admin status
- **History Filtering**: Regular users see only their detections, admins see all
- **Admin Features**: Delete buttons visible only to admins
- **User Greeting**: Displays logged-in user email with admin badge
- **Logout Functionality**: Properly clears server-side tokens and client state

### Code Quality

- Removed old code from `repobackups/` archive folder
- Improved error logging with prefixes (e.g., `[AUTH]`, `[DETECT]`, `[RESULTS]`)
- Consistent naming conventions across middleware and routes
- Better separation of concerns in route files
- Enhanced validation and error handling

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas connection string)
- Sightengine API credentials

### Backend Setup

See [Backend_V2/README.md](Backend_V2/README.md) for detailed setup instructions.

```cmd
cd Backend_V2
npm install
npm run dev
```

### Frontend Setup

```cmd
cd Frontend-seerat
npm install
npm run dev
```

## Environment Setup

### Backend (.env file in Backend_V2/)

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-super-secret-key-here
API_USER=your-sightengine-username
API_SECRET=your-sightengine-api-key
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### Frontend (runs on http://localhost:5173 by default)

- Automatically configured to connect to backend at `http://localhost:5000`
- Uses axios for API calls with credential support

## User Account Features

### For Regular Users

1. **Sign Up**: Create account with email and password
2. **Login**: Access account with stored credentials
3. **Upload Images**: Submit images for AI detection
4. **View History**: See all past detections (own only)
5. **Logout**: Securely clear session

### For Admins

1. All regular user features +
2. **View All History**: See every user's detections
3. **Delete Results**: Remove any detection from system
4. **Manage Admins**: Promote users to admin status
5. **Admin Badge**: Visual indicator in interface

## API Documentation

Complete API documentation with examples is available in [Backend_V2/README.md](Backend_V2/README.md).

Key endpoints:
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user info
- `POST /auth/set-admin` - Promote user to admin (admin only)
- `POST /detect` - Upload and detect image (authenticated)
- `GET /api/results` - Get detection history (filtered or all if admin)
- `DELETE /api/results/:id` - Delete result (admin only)

## Database Structure

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  isAdmin: Boolean (default: false)
}
```

### ImageResult Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  filename: String,
  result: Object,
  image: {
    data: Buffer,
    contentType: String
  },
  createdAt: Date
}
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **File Upload**: Multer
- **External API**: Sightengine for AI detection

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: CSS with gradients and animations

## Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT tokens with 1-day expiration
- HTTP-only secure cookies (XSS protection)
- CORS configuration with credentials support
- Role-based access control (admin system)
- User data isolation (each user sees only their own data)
- Input validation on all endpoints
- Authorization checks on protected routes

## Project Artifacts
- Showcase presentation: [Showcase Presentation](https://bearsunco-my.sharepoint.com/:p:/g/personal/sand4927_bears_unco_edu/ET0jwIOIj9dAhOn4ZzZeaxgBcfIegghQBMzLw-EOu8_yHg?e=5aH8z8)
- Project code explanation presentation: [Code Slides](https://bearsunco-my.sharepoint.com/:p:/g/personal/este6795_bears_unco_edu/EUMs4sUpYN5Du8SYJtQjy4gB4bP-enkhvNbAyQW6KLP0cw?e=9FxZNw)
- Kanban Whiteboard: [Kanban Board](https://www.canva.com/design/DAG33HIYG_4/hgzuwn6yQNpGs0tHIa4EmA/view?utm_content=DAG33HIYG_[4&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h39ce4a4fcc)
- Basic Wireframes: [Wire Frame](https://lucid.app/lucidchart/de453758-ea13-458b-bfc3-ddf3424c146d/edit?viewport_loc=-1583%2C-954%2C7060%2C3490%2CuP1BopAARZY8&invitationId=inv_6bc9c881-b513-4f19-9130-36bba7f567b9)

## Showcase/Live Demo
You can view a live demo of the working version of this web application in the files or using this link: [Live Demo](Live%20Demo/DectectAI_Showcase.mp4)  
Other link to video: [Backup Link](https://vimeo.com/1143960306?share=copy&fl=sv&fe=ci)

## Notes

- Sightengine API credit: [Sightengine Website](https://sightengine.com/)
- Backend requires MongoDB connection (local or cloud)
- Frontend and backend must run on different ports for CORS
- JWT tokens expire after 1 day; users must login again
- Admin accounts must be created manually (first user via MongoDB, subsequent via API)

## Project Timeline

- **10/22/25**: Repo created with placeholder product list
- **10/29/25**: Sightengine API integration added
- **11/14/25**: Basic AI detection working, output processing implemented
- **12/02/25**: User authentication system, admin features, and modularized architecture

## Comments & Considerations

- MongoDB is essential for storing user accounts, detection results, and images
- User management system (signup, signin, admin controls) is fully implemented
- Multi-user support with data isolation ensures privacy
- Admin features provide content moderation and system management
- Architecture is modular and extensible for future features
