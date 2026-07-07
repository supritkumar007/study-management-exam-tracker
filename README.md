# Study Management – Exam Tracker

A full-stack MERN application for students to manage exams, track study hours, and use a study timer.

## Live Demo
- https://studyhunter.vercel.app/

## Features
- **Student Authentication** (Register/Login with JWT)
- **Exam Management** (Add, Update, Auto-status update)
- **Study Timer** (Track actual study time vs planned)
- **Study Extension Logic** (Popup to extend study session)
- **Dashboard** (Upcoming exams, Urgent alerts)
- **Responsive UI** (Clean, modern design)

## Tech Stack
- **Frontend**: React, Vite, CSS Modules
- **Backend**: Node.js, Express, MongoDB
- **Database**: MongoDB Atlas

## Setup & Installation

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# MONGO_URI=mongodb+srv://supritkumarrp:KfTEpvai4eTV3rXj@cluster0.uwoqiwn.mongodb.net/studyTracker?retryWrites=true&w=majority
# PORT=5000
# JWT_SECRET=your_secret_key

npm run dev
```
*Server runs on http://localhost:5000*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Client runs on http://localhost:5173*

## API Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/study/add` - Add Exam
- `GET /api/study/my-records` - Get Dashboard Data
- `PUT /api/study/update/:id` - Update Timer/Status
