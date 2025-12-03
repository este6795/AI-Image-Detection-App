# AI Image Detection Frontend

A React + Vite frontend for the AI Image Detection application. This provides a modern, responsive user interface for uploading images and detecting whether they are AI-generated.

## Features

- **User Authentication**: Sign up, login, and logout functionality
- **Image Upload & Detection**: Upload images for AI-generation analysis with real-time results
- **Detection History**: View past detections with confidence scores
- **Admin Dashboard**: Admins can view all users' detections and delete results
- **User Isolation**: Each user sees only their own detection history
- **Responsive Design**: Modern UI with gradient styling and animations
- **Real-time Feedback**: Loading states and error handling

## Project Structure

```
Frontend-seerat/
├── src/
│   ├── App.jsx                 # Main app component with auth state
│   ├── App.css                 # Main styles
│   ├── main.jsx                # React entry point
│   ├── index.css               # Global styles
│   └── components/
│       ├── LandingPage.jsx      # Landing page with hero section
│       ├── LandingPage.css
│       ├── AuthModal.jsx        # Sign up/login modal
│       ├── AuthModal.css
│       ├── ImageDetector.jsx    # Image upload and detection
│       ├── ImageDetector.css
│       ├── ShowHistory.jsx      # Detection history view
│       ├── ShowHistory.css
│       ├── MissionSection.jsx
│       ├── MissionSection.css
│       ├── IntroSection.jsx
│       ├── IntroSection.css
│       ├── StatsSection.jsx
│       └── StatsSection.css
├── public/                     # Static assets
│   └── videos/                 # Demo videos
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Backend server running on http://localhost:5000
- npm or yarn package manager

### Installation

```bash
cd Frontend-seerat
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Configuration

### Backend Connection

The frontend is configured to connect to the backend at `http://localhost:5000`. This is hardcoded in the API calls but can be easily modified by creating a `.env.local` file:

```
VITE_API_URL=http://localhost:5000
```

Then update all axios calls to use `import.meta.env.VITE_API_URL`.

### CORS and Credentials

All API requests include `withCredentials: true` to ensure HTTP-only cookies are sent with requests. The backend must have CORS configured to accept credentials.

## Components

### App.jsx

Main application component that handles:
- Authentication state management (user email, admin status)
- Landing page vs. main app display
- Logout functionality
- User greeting with admin badge

**State**:
- `isAuthenticated`: Boolean indicating if user is logged in
- `userEmail`: Email of logged-in user
- `isAdmin`: Boolean indicating if user has admin privileges
- `showLanding`: Whether to show landing page
- `showHistory`: Whether to show history or detector

### LandingPage.jsx

Landing page shown to unauthenticated users with:
- Hero section with app title and description
- Navigation links (Features, How It Works, About, Contact)
- Feature cards highlighting key features
- How It Works section with 3 steps
- About section with app description
- Footer with contact info

**Props**:
- `onStart`: Callback function when user clicks "Sign up" button

### AuthModal.jsx

Modal component for user authentication with:
- Toggle between Sign Up and Login modes
- Email and password inputs
- Password confirmation on signup
- Form validation
- Error message display
- Loading state during submission

**Props**:
- `isOpen`: Boolean to show/hide modal
- `onClose`: Callback when modal should close
- `onLoginSuccess`: Callback with (email, isAdmin) when login succeeds

**Features**:
- Real-time form validation
- Minimum password length check (6 characters)
- Password match verification
- Automatic localStorage persistence
- Credentials sent with `withCredentials: true`

### ImageDetector.jsx

Main image detection component with:
- File input for image selection
- Image preview
- Detection button with loading state
- Real-time detection results
- Confidence score display with emoji indicators

**Features**:
- File validation (image types only)
- Real-time preview of selected image
- Clear result display with color-coded status
- Loading spinner during analysis
- Error handling and user feedback

**API Call**:
```
POST /detect
Headers: withCredentials: true
Body: FormData with image file
```

### ShowHistory.jsx

Detection history view with:
- List of past detections (up to 10)
- Image previews with results
- Confidence scores
- Admin-only delete buttons
- User info display (admin view)
- Empty state message

**Props**:
- `isAdmin`: Boolean indicating if user is admin

**Admin Features** (when `isAdmin` is true):
- Shows "ADMIN VIEW - All Users" header
- Displays user email for each detection
- Delete button for each result
- Can view and delete any user's detections

**Regular User Features**:
- Shows only user's own detections
- No delete buttons
- Cannot see other users' data

### MissionSection.jsx

Section describing the app's mission and value proposition.

### StatsSection.jsx

Section displaying statistics about the app.

### IntroSection.jsx

Introductory section with app overview.

## Authentication Flow

1. **Sign Up**: User enters email and password → AuthModal validates → Sent to `/auth/signup`
   - Backend hashes password and creates user
   - JWT token issued and stored in HTTP-only cookie
   - `isAdmin` status retrieved from response
   - User data stored in localStorage

2. **Login**: User enters credentials → Sent to `/auth/login`
   - Backend verifies credentials
   - JWT token issued and stored in HTTP-only cookie
   - `isAdmin` status retrieved from response
   - User data stored in localStorage

3. **Session Persistence**: On app load
   - App checks localStorage for `isAuthenticated` and `userEmail`
   - Restores user session if available
   - Admin status retrieved from localStorage

4. **Logout**: User clicks logout button
   - localStorage cleared
   - POST request to `/auth/logout` with credentials
   - Cookie cleared server-side
   - User returned to landing page

## API Integration

### Endpoints Used

**Authentication** (in AuthModal.jsx):
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Authenticate user

**Logout** (in App.jsx):
- `POST /auth/logout` - Clear session

**Image Detection** (in ImageDetector.jsx):
- `POST /detect` - Upload image and get detection result

**Results** (in ShowHistory.jsx):
- `GET /api/results` - Fetch user's detection history (or all if admin)
- `GET /api/results/image/:id` - Retrieve image by result ID
- `DELETE /api/results/:id` - Delete result (admin only)

### Request/Response Examples

**Sign Up**:
```javascript
// Request
axios.post('http://localhost:5000/auth/signup', {
  email: 'user@example.com',
  password: 'password123'
}, { withCredentials: true })

// Response
{ success: true, message: "User created successfully" }
```

**Login**:
```javascript
// Response
{ success: true, isAdmin: false }
```

**Upload Image**:
```javascript
// Request
const formData = new FormData()
formData.append('image', fileInput)
axios.post('http://localhost:5000/detect', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  withCredentials: true
})

// Response
{
  success: true,
  message: "Detection complete",
  result: { type: { ai_generated: 0.85 } }
}
```

**Get History**:
```javascript
// Response (user view)
[
  {
    _id: "resultid123",
    userId: "userid123",
    filename: "image.jpg",
    result: { type: { ai_generated: 0.15 } },
    createdAt: "2025-12-02T10:30:00Z"
  }
]

// Response (admin view)
[
  {
    _id: "resultid123",
    userId: { _id: "userid123", email: "user@example.com" },
    filename: "image.jpg",
    result: { type: { ai_generated: 0.15 } },
    createdAt: "2025-12-02T10:30:00Z"
  }
]
```

## Styling

The app uses modern CSS with:
- Linear gradients and glowing effects
- Smooth animations and transitions
- Responsive design (works on mobile and desktop)
- Dark theme with cyan and orange accents
- Hover effects for better UX
- Color-coded results (green for real, red for AI)

### Key Colors
- Primary: `#0096ff` (cyan blue)
- Accent: `#00d4ff` (light cyan glow)
- Success: Green for real images
- Alert: Red for AI-generated images
- Danger: `#ff006e` (pink for delete)
- Background: `#0f111b` (dark navy)

## Storage

### LocalStorage Usage

The app stores user authentication state in localStorage for session persistence:

```javascript
localStorage.setItem('isAuthenticated', 'true')
localStorage.setItem('userEmail', 'user@example.com')
localStorage.setItem('isAdmin', 'false')
```

This allows users to remain logged in when refreshing the page.

## Error Handling

The app includes comprehensive error handling:

- **Auth Errors**: Display error messages from server
- **File Upload Errors**: Check file type and size
- **API Errors**: Log details and show user-friendly messages
- **Network Errors**: Graceful handling with error alerts
- **Validation Errors**: Client-side validation before submission

## Admin Features

When a user logs in with admin privileges:

1. **History View Changes**:
   - Header shows "ADMIN VIEW - All Users"
   - Shows all users' detections instead of just own

2. **Admin Indicators**:
   - "👑 (ADMIN)" badge next to user greeting
   - Visual indication throughout the app

3. **Delete Functionality**:
   - Red delete button appears on each result
   - Click to delete any user's detection result
   - Confirmation dialog before deletion
   - History refreshes after deletion

## Troubleshooting

### "Cannot POST /detect" error
- Ensure backend is running on port 5000
- Check that CORS is properly configured on backend
- Verify backend URL in API calls

### Login fails with "Invalid email or password"
- Check that email and password are correct
- Ensure backend is running
- Check browser console for detailed error messages

### Images not loading in history
- Verify backend is running
- Check that image IDs are correct
- Ensure user has permission to access image (admin if another user's image)

### "No token provided" error
- Check that browser allows cookies
- Verify backend is setting cookies properly
- Try clearing localStorage and logging in again

## Dependencies

- **React 19.1.1**: UI framework
- **React DOM 19.1.1**: React rendering
- **Axios 1.13.2**: HTTP client for API calls
- **Vite 7.2.6**: Build tool and dev server
- **ESLint**: Code quality (dev)

## Development Tips

- Use browser DevTools to inspect network requests
- Check console for detailed error messages with prefixes like `[FRONTEND]`, `[HISTORY]`, etc.
- Test authentication by opening two browser windows (different users)
- Use browser DevTools → Application → Cookies to inspect JWT token
- Use browser DevTools → Application → LocalStorage to check user state

## Future Enhancements

Potential features to add:
- Advanced search/filtering in history
- Batch image upload
- Download detection reports as PDF
- User profile management
- Change password functionality
- Admin user management dashboard
- Real-time notifications
- Image analysis details (tampering indicators, metadata)

## Notes

- All API calls use `withCredentials: true` to send HTTP-only cookies
- JWT tokens expire after 1 day (users must login again)
- Detection results include raw API response from Sightengine
- Images are stored on the backend in MongoDB
- The app follows React best practices with hooks and functional components
