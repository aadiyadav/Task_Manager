
# Task Management Project

A comprehensive task management system with role-based access control, allowing Admins to manage teams/tasks and Users to track their assignments.

## 🚀 Features

- **Role-Based Access**:
  - **Admin**: Create/Edit/Delete tasks, Manage users, Dashboard analytics.
  - **User**: View assigned tasks, Update task status (Pending -> In Progress -> Completed).
- **Authentication**: JWT-based auth with secure login/signup.
- **Real-time Updates**: React Query & Optimistic updates.
- **Responsive UI**: Built with Tailwind CSS for mobile-first design.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State/Form**: React Hook Form, Yup
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Firestore (Firebase Admin SDK)
- **Authentication**: JWT & Bcrypt
- **Deployment**: Render

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- Firebase Project Service Account Key

### 1. Clone the repository
```bash
git clone <repository-url>
cd task-management-project
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

Run the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
# For production, set this to your Render backend URL
```

Run the frontend:
```bash
npm run dev
```

## 🌍 API Documentation

### Auth
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/role` - Update user role (Admin/User)

### Tasks
- `GET /api/tasks` - Get all tasks (Admin only)
- `GET /api/tasks/my-tasks` - Get assigned tasks (User)
- `POST /api/tasks` - Create a new task (Admin only)
- `PUT /api/tasks/:id` - Update task status/details
- `DELETE /api/tasks/:id` - Delete a task (Admin only)

## 🚀 Deployment

### Backend (Render)
1. Create a **Web Service** on Render connected to this repo.
2. Set **Root Directory** to `backend`.
3. Set **Build Command**: `npm install`.
4. Set **Start Command**: `npm start`.
5. Add Environment Variables from your `.env`.

### Frontend (Vercel)
1. Import project into Vercel.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Add Environment Variable: `VITE_API_URL` pointing to your Render backend URL.
