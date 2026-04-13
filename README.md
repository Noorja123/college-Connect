# 🎓 College Management System

A complete real-world, full-stack web application designed to streamline educational administration. Built with an intuitive, modern UI using React (Vite) and powered by a robust backend running Express.js and MongoDB.

![Screenshot](https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop) *(Placeholder image)*

---

## ✨ Features
- **🔑 Role-Based Access Control:** Secure, customized dashboards tailored for Admins, Teachers, and Students.
- **👨‍🎓 Student Portal:** Allows students to view grades, submit assignments, and track attendance.
- **👨‍🏫 Teacher Portal:** Manage assigned classes, grade submissions, and log daily attendance.
- **🛠️ Admin Dashboard:** Oversee all users, execute full-stack CRUD capabilities for courses, subjects, and users.
- **⚡ Reactive Data Synchronization:** Frontend is seamlessly coupled with the backend REST API offering real-time component mounting, loading UX states, and validation alerts.
- **☁️ Cloud Database & API:** Safe, scalable real-time database schema mapped perfectly through Mongoose models straight into MongoDB Atlas.

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS, Shadcn UI
- **Routing:** React Router DOM
- **Charts:** Recharts

### Backend
- **Framework:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **CORS & Routing:** Express Router & CORS Proxy Integration

---

## 🚀 Getting Started (Local Development)

Follow these instructions to get a copy of the project perfectly running on your local machine.

### Prerequisites
Make sure you have **Node.js** installed and a **MongoDB Atlas cluster** ready. You will need your MongoDB URI connection string.

### 1. Clone & Install Dependencies
Clone the repository using Git, enter the directory, and install all library components:
```bash
git clone <your-repo-link>
cd college-management-system
npm install
```

### 2. Environment Variables Integration
You must create two distinct Environment strings, one for your backend, and one for local Vite routing:

**Backend (`.env`)**
Create a `.env` file in the root directory:
```env
PORT=5005
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/collegeSystem
```

**Frontend (`.env.local`)**
Create an `.env.local` file in the root directory for Secure Vite Routing:
```env
VITE_API_BASE_URL=http://localhost:5005/api
```

### 3. Database Initial Seed (Mock Data)
You don't need to manually design data to see the application work! You can inject fully functional mock data safely straight into your Cloud MongoDB Database by running the internal `seed.js` script:
```bash
node server/seed.js
```
*(Wait until it says "🎉 Database successfully seeded!")*

### 4. Bootstrapping Both Servers
Because this is a decoupled full-stack React framework, you must host both the backend API and the frontend UI concurrently. Open two terminal instances:

**Terminal 1 (Backend REST Server):**
```bash
npm run server
```

**Terminal 2 (Frontend React App):**
```bash
npm run dev
```

Your web application will automatically jump to life at `http://localhost:5173`.

---

## 🔐 Default Seeded Credentials
When you successfully execute the seed script, you can log in to the system directly using these default accounts:

| Role       | Email                | Password     |
| ---------- | -------------------- | ------------ |
| **Admin**  | `admin@college.com`  | `admin123`   |
| **Teacher**| `sarah@college.com`  | `teacher123` |
| **Student**| `alice@college.com`  | `student123` |

---

## 🚀 Deployment to Production

This architecture is entirely built for scalable production deployment mapping directly to leading Serverless + VPS hubs.

### 1. Backend (Render.com)
1. Fork or push your codebase onto GitHub.
2. Create a new **Web Service** on Render and point it to your repo.
3. Configure settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm run server`
4. Go to **Environment Variables** and insert your actual `MONGODB_URI`.
5. Deploy. You will receive a live generic proxy link *(e.g., https://your-backend.onrender.com).*

### 2. Frontend (Vercel.com)
1. Import the same repository to a new Vercel Project.
2. The framework preset should default cleanly to **Vite**.
3. Go to **Environment Variables** and create:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://your-backend.onrender.com/api` *(Your Render URL)*
4. Deploy the Site!

Because the system possesses an active `vercel.json` router rewriter config, Client-Side routing across dashboards operates precisely mapping to all root REST actions safely.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
