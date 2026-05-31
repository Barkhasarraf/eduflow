# 🎓 EduFlow – AI Powered School Management System

<div align="center">

# Smart • Secure • Real-Time • AI Powered

EduFlow is a modern **AI-powered School Management System** designed to digitize and automate school operations using **React, TypeScript, Firebase, and modern web technologies**.

</div>

---

# 📖 Overview

EduFlow is a complete digital platform for schools and educational institutions.

It helps manage:

- Students
- Teachers
- Attendance
- Exams
- Fees
- Assignments
- Timetable
- Communication
- AI Insights
- School Administration

EduFlow provides:

✅ Secure Authentication  
✅ Cloud Database  
✅ Real-Time Updates  
✅ File Storage  
✅ Role-Based Access  
✅ Fast & Scalable Infrastructure

---

# ✨ Core Features

# 👨‍💼 Admin Dashboard

Full school management access.

### Features
- Dashboard Analytics
- School Overview
- Student Management
- Teacher Management
- Staff Management
- Class & Section Management
- Subject Management
- Timetable Creation
- Attendance Reports
- Fee Management
- Exam Scheduling
- Result Publishing
- Notice Management
- User Role Control
- System Settings

---

# 👩‍🏫 Teacher Dashboard

Academic management tools.

### Features
- Teacher Profile
- Attendance Marking
- Assignment Upload
- Homework Management
- Student Progress Tracking
- Exam Marks Entry
- Timetable Access
- Notice Board
- Messaging

---

# 👨‍🎓 Student Dashboard

Learning and academic access.

### Features
- Student Profile
- Attendance Tracking
- Assignment Submission
- Homework View
- Exam Results
- Timetable
- Notifications
- Fee Status
- Learning Materials

---

# 👨‍👩‍👧 Parent Dashboard

Monitor student activities.

### Features
- Student Progress Reports
- Attendance Monitoring
- Fee Tracking
- Exam Results
- Notices
- Communication with Teachers

---

# 🤖 AI Features

EduFlow integrates AI for smarter education management.

### AI Modules
- AI Academic Assistant
- Student Performance Analytics
- Learning Recommendations
- Smart Reports
- Attendance Insights
- Risk Student Detection
- AI Generated Feedback

---

# ⚡ Real-Time Features

Powered by Firebase.

- Live Attendance Updates
- Instant Notifications
- Real-Time Dashboard
- Live Messaging
- Dynamic Notice Board

---

# 🔐 Authentication & Security

Secure access using Firebase Authentication.

### Auth Features
- Email/Password Login
- Registration
- Password Reset
- Session Handling
- Role-Based Access
- Protected Routes
- Secure API Calls

Supported Roles:

- Admin
- Teacher
- Student
- Parent

---

# 🔥 Firebase Integration

EduFlow uses **Firebase** as Backend-as-a-Service.

---

# Firebase Services Used

## 🔑 Firebase Authentication
Secure authentication and user sessions.

Supports:

- Email Login
- Signup
- Password Reset
- Session Persistence

---

## 🗄 Cloud Firestore

NoSQL cloud database.

Used for:

- Students
- Teachers
- Attendance
- Assignments
- Notices
- Results
- Messages

---

## 📡 Firebase Realtime Features

Provides instant updates.

Used for:

- Messaging
- Attendance Updates
- Notifications
- Dashboard Sync

---

## 📁 Firebase Storage

Cloud file storage.

Used for:

- Assignment Files
- Student Documents
- Profile Images
- Certificates
- School Media

---

## 🔒 Firebase Security Rules

Protects application data.

Example:

```javascript
Users can only access authorized data.
Admins have full access.
Students can access only their own records.
```

---

# 🛠 Tech Stack

## Frontend

- React.js
- TypeScript
- Vite
- Tailwind CSS
- React Router
- ShadCN UI

## Backend / BaaS

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Hosting

## State Management

- Context API
- React Query

## AI Integration

- OpenAI API (Optional)
- Gemini API (Optional)

## Deployment

- Firebase Hosting
- Vercel
- Netlify

---

# 🏗 System Architecture

```text
React + Vite Frontend
        ↓
Firebase Authentication
        ↓
Cloud Firestore Database
        ↓
Storage + Realtime Updates
        ↓
AI + Dashboard Analytics
```

---

# 📂 Project Structure

```bash
EduFlow/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── dashboard/
│   │   ├── forms/
│   │   └── chat/
│   │
│   ├── pages/
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── teacher/
│   │   ├── student/
│   │   └── parent/
│   │
│   ├── hooks/
│   ├── context/
│   ├── services/
│   │   ├── firebase/
│   │   ├── auth/
│   │   └── api/
│   │
│   ├── routes/
│   ├── utils/
│   ├── types/
│   └── main.tsx
│
├── firebase/
│   ├── config.ts
│   ├── firestore.rules
│   └── storage.rules
│
├── .env
├── firebase.json
├── package.json
└── README.md
```

---

# 🚀 Installation

## 1 Clone Repository

```bash
git clone https://github.com/yourusername/eduflow.git
```

---

## 2 Navigate to Project

```bash
cd eduflow
```

---

## 3 Install Dependencies

```bash
npm install
```

---

# 🔥 Firebase Setup

## Step 1 Create Firebase Project

Go to:

https://console.firebase.google.com

Create:

- New Project
- Enable Firebase Services

---

## Step 2 Enable Services

Enable:

- Authentication
- Firestore Database
- Storage
- Hosting (optional)

---

## Step 3 Get Firebase Config

Open:

Project Settings → General

Copy Firebase configuration.

---

## Step 4 Configure Environment Variables

Create:

```bash
.env
```

Add:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---





# 🗄 Database Collections

Core Firestore Collections:

```text
users
students
teachers
parents
classes
subjects
attendance
assignments
fees
results
notices
messages
```

---

# ▶️ Running the Project

Development:

```bash
npm run dev
```

Open:

```bash
http://localhost:5173
```

Production Build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

---

# 🌐 Deployment

Deploy using Firebase Hosting.

Install Firebase CLI:

```bash
npm install -g firebase-tools
```

Login:

```bash
firebase login
```

Initialize:

```bash
firebase init
```

Deploy:

```bash
firebase deploy
```

---

# 👥 User Roles

| Role | Access |
|------|--------|
| Admin | Full School Control |
| Teacher | Academic Operations |
| Student | Learning Access |
| Parent | Monitoring Access |

---

# 🔮 Future Enhancements

- Mobile Application
- AI Attendance Prediction
- Online Examination System
- Video Learning Platform
- Multi-School Management
- AI Powered Recommendations
- Smart Timetable Generator

---

# 🤝 Contributing

Contributions are welcome.

Steps:

1. Fork Repository
2. Create Feature Branch
3. Commit Changes
4. Push Branch
5. Open Pull Request

---

# 📄 License

Licensed under the MIT License.

---

# ⭐ Support

If you like EduFlow:

⭐ Star the repository  
🍴 Fork the project  
🚀 Build and improve EduFlow



### EduFlow – Transforming School Management with AI & Firebase

</div>
