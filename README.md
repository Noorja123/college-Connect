# 🎓 College Management System

A comprehensive, full-stack web application designed to streamline educational administration. Built with an intuitive, modern UI using React (Vite) and powered by a robust Express.js / MongoDB backend.

![Screenshot](https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop) *(Placeholder image)*

## ✨ Features
- **🔑 Role-Based Access Control:** Secure, customized dashboards for Admins, Teachers, and Students.
- **👨‍🎓 Student Portal:** View grades, submit assignments, and track attendance.
- **👨‍🏫 Teacher Portal:** Manage classes, grade submissions, and log daily attendance.
- **🛠️ Admin Dashboard:** Oversee all users, manage subjects and courses, and view college-wide analytics.
- **☁️ Cloud Database:** Real-time data persistence using MongoDB Atlas.

## 💻 Tech Stack
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI, Recharts
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB Atlas
- **Routing:** React Router DOM

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
Make sure you have Node.js and npm (or Bun) installed. You will also need a MongoDB Atlas cluster.

### 1. Clone & Install Dependencies
Open your terminal and clone the repository (or navigate to your project folder), then install the packages:
```bash
npm install
```

### 2. Environment Variables
You must create a `.env` file in the root directory and add your MongoDB connection string.
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/collegeSystem?appName=CollegeManagementDB
```

### 3. Running the Project
Since this is a full-stack application, you need to run both the frontend and backend servers.

**Terminal 1 (Backend Server):**
```bash
npm run server
```

**Terminal 2 (Frontend React App):**
```bash
npm run dev
```

Your app will be automatically running at `http://localhost:5173`.

---

## 🔐 Default Login Credentials
You can log in to the application using these test accounts (included if you ran the seed script):

| Role       | Email                | Password     |
| ---------- | -------------------- | ------------ |
| **Admin**  | `admin@college.com`  | `admin123`   |
| **Teacher**| `sarah@college.com`  | `teacher123` |
| **Student**| `alice@college.com`  | `student123` |

## 🏗️ Project Structure
```text
├── server/
│   ├── models/        # Mongoose Database Schemas
│   ├── routes/        # Express API Endpoints
│   ├── seed.js        # Script to populate initial Database
├── src/
│   ├── components/    # Reusable React UI Components
│   ├── contexts/      # React Contexts (Auth, Data fetching)
│   ├── lib/           # Utility functions & API hooks
│   ├── pages/         # Dashboard Pages for each Role
│   ├── types/         # TypeScript Interfaces
├── server.js          # Main Backend Entrypoint
└── package.json       # Project Dependencies & Scripts
```

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
# college-Connect
