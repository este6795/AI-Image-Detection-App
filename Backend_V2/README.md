# Backend (Backend_V2)

This folder contains the Node/Express backend for the AI Image Detection project.

Quick setup:

1. Copy `.env.example` to `.env` and set environment variables
1. Copy `.env.example` to `.env` (place it under `Backend_V2/.env`) and set environment variables
2. Install dependencies:

```cmd
npm install
```

3. Start the server in development mode:
3. Start the server in development mode (run commands from `Backend_V2` folder):

```cmd
npm run dev
# or run `npm start` for production (in `Backend_V2` folder)
```

The server file is `src/server.js`. It uses ES modules and expects `type: module` in the package.json.

Environment variables:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - A secret for signing JWT tokens (set to a secure value in production)
- `API_USER` / `API_SECRET` - SightEngine API credentials
- `PORT` - Optional server port (default 5000)
