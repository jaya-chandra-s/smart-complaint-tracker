# Smart Complaint Tracking System

A full-stack web application for citizens to report public issues and for administrators to manage and resolve complaints.

## Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- React Router v6
- Recharts (Analytics)
- Lucide React (Icons)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (Image Uploads)

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# Install dependencies
npm install

# Start MongoDB (if using local)
mongod

# Run both frontend and backend
npm run dev
```

The application will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/smart-complaints

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173

# API URL (for frontend)
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Complaints (User)
- `GET /api/complaints` - Get user's complaints
- `GET /api/complaints/:id` - Get single complaint
- `POST /api/complaints` - Create complaint (with image)
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint

### Admin
- `GET /api/admin/complaints` - Get all complaints
- `PUT /api/admin/complaints/:id/status` - Update status
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/analytics` - Analytics data

## Features

### User Features
- Register/Login with email
- Submit complaints with photos
- 5 categories: Road Damage, Water Leakage, Garbage Issue, Electricity Problem, Drainage Problem
- Track complaint status
- Filter and search complaints

### Admin Features
- View all complaints
- Update complaint status (Pending → In Progress → Resolved)
- Delete complaints
- Dashboard with statistics
- Analytics with charts

### Design
- Dark mode support
- Responsive design
- Glassmorphism UI
- Toast notifications

## Scripts

```bash
npm run dev       # Run both frontend & backend
npm run server    # Run backend only
npm run client    # Run frontend only
npm run build     # Build frontend
npm run start     # Production server
npm run seed      # Create default admin user
```

## Project Structure

```
├── server/              # Backend
│   ├── config/          # Database config
│   ├── controllers/     # API controllers
│   ├── middleware/      # Auth, multer
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── index.ts         # Server entry
├── src/                 # Frontend
│   ├── components/      # React components
│   ├── context/         # Auth, Theme context
│   ├── pages/           # Page components
│   ├── lib/             # API utilities
│   └── types/           # TypeScript types
├── uploads/             # Image uploads
└── dist/                # Build output
```

## Creating Admin User

Run the seed script to create a default admin account:

```bash
npm run seed
```

**Default Admin Credentials:**
- Email: admin@gmail.com
- Password: admin123
- Role: admin

Or manually update in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Deployment

### Backend Deployment
1. Set environment variables
2. Use MongoDB Atlas for cloud database
3. Deploy to Render, Railway, or Heroku

### Frontend Deployment
1. Update `VITE_API_URL` in `.env`
2. Build: `npm run build`
3. Deploy `dist/` folder to Vercel, Netlify, or serve statically

### Full Stack Deployment
Use platforms like Render or Railway that support both Node.js and static files.

## License

MIT
