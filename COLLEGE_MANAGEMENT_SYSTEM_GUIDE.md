# 🎓 Complete College Management System — Full-Stack Guide

## Tech Stack
- **Frontend:** Angular 17+ with Tailwind CSS & Angular Signals
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Atlas + Compass)
- **Auth:** JWT with Role-Based Access Control
- **File Upload:** Multer
- **Real-Time:** Socket.io
- **Charts:** Chart.js (via ng2-charts)

---

# PART 1: MONGODB SETUP

## 1.1 Create MongoDB Atlas Cluster

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Click **"Build a Database"**
4. Choose **FREE Shared Cluster** (M0)
5. Select your cloud provider (AWS recommended) and region closest to you
6. Click **"Create Cluster"**
7. **Create a Database User:**
   - Go to **Database Access** → **Add New Database User**
   - Choose **Password** authentication
   - Username: `college_admin`
   - Password: (generate a strong password, save it!)
   - Role: **Atlas Admin**
8. **Allow Network Access:**
   - Go to **Network Access** → **Add IP Address**
   - For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - For production: whitelist only your server IP
9. **Get Connection String:**
   - Go to **Database** → **Connect** → **Connect your application**
   - Select **Node.js** driver, version **5.5 or later**
   - Copy the connection string:

```
mongodb+srv://college_admin:<password>@cluster0.xxxxx.mongodb.net/college_management?retryWrites=true&w=majority
```

Replace `<password>` with your actual password.

## 1.2 MongoDB Compass

1. Download from [https://www.mongodb.com/products/compass](https://www.mongodb.com/products/compass)
2. Install and open
3. Paste your connection string into the URI field
4. Click **Connect**
5. You can now visually browse collections, run queries, and inspect data

## 1.3 Indexes & Relationships

MongoDB is document-based (NoSQL), so there are no traditional foreign keys. We use **references** (ObjectId fields) to link documents.

**Key indexes to create:**
- `users.email` — unique index for fast login lookups
- `attendance.studentId + attendance.date` — compound index for attendance queries
- `submissions.studentId + submissions.assignmentId` — compound unique index

---

# PART 2: BACKEND (Node.js + Express)

## 2.1 Project Setup

```bash
mkdir college-management-backend
cd college-management-backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv cors multer socket.io helmet express-rate-limit express-validator
npm install -D nodemon
```

## 2.2 Folder Structure

```
college-management-backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── socket.js          # Socket.io setup
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── role.js            # Role-based access
│   │   ├── upload.js          # Multer config
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   ├── Assignment.js
│   │   ├── Submission.js
│   │   ├── Attendance.js
│   │   ├── Course.js
│   │   ├── Subject.js
│   │   └── Notification.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── teacherController.js
│   │   ├── studentController.js
│   │   ├── attendanceController.js
│   │   ├── assignmentController.js
│   │   └── notificationController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── teacherRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── attendanceRoutes.js
│   │   └── assignmentRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── validators.js
│   └── app.js
├── uploads/                   # Multer file storage
├── .env
├── .gitignore
├── package.json
└── server.js
```

## 2.3 Environment Variables (.env)

```env
PORT=5000
MONGODB_URI=mongodb+srv://college_admin:<password>@cluster0.xxxxx.mongodb.net/college_management?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
JWT_EXPIRES_IN=7d
NODE_ENV=development
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

> ⚠️ **Security:** Never commit `.env` to Git. Add it to `.gitignore`.

## 2.4 .gitignore

```
node_modules/
.env
uploads/
dist/
```

## 2.5 server.js (Entry Point)

```javascript
// server.js — This is the FIRST file that runs. It starts everything.
const http = require('http');
const app = require('./src/app');
const { initSocket } = require('./src/config/socket');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start server
connectDB().then(() => {
  const server = http.createServer(app);
  
  // Initialize Socket.io on the same server
  initSocket(server);
  
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  });
});
```

## 2.6 src/config/db.js

```javascript
// db.js — Connects to MongoDB Atlas. Called once when server starts.
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Stop the server if DB connection fails
  }
};

module.exports = connectDB;
```

## 2.7 src/config/socket.js

```javascript
// socket.js — Sets up real-time notifications using Socket.io
const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:4200', // Angular dev server
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // User joins a room based on their userId (for targeted notifications)
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};

// Call this from controllers to send notifications
const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { initSocket, getIO };
```

## 2.8 src/app.js

```javascript
// app.js — Express application setup with all middleware and routes
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();

// ──── SECURITY MIDDLEWARE ────
app.use(helmet()); // Sets security HTTP headers
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

// Rate limiting: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ──── BODY PARSING ────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ──── STATIC FILES (uploaded files) ────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ──── API ROUTES ────
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);

// ──── HEALTH CHECK ────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ──── ERROR HANDLING (must be last) ────
app.use(errorHandler);

module.exports = app;
```

---

## 2.9 MODELS (Mongoose Schemas)

### src/models/User.js
```javascript
// User.js — Base user model. Every person in the system is a User.
// The 'role' field determines what they can access.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ['admin', 'teacher', 'student'],
      default: 'student',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for fast email lookups during login
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Hash password before saving (runs automatically)
userSchema.pre('save', async function (next) {
  // Only hash if password was modified (not on every save)
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
```

### src/models/Student.js
```javascript
// Student.js — Extra info for users with role 'student'
// Links to User via userId reference
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true, // e.g., "STU-2024-001"
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
      default: 1,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    guardianName: String,
    guardianPhone: String,
    address: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
```

### src/models/Teacher.js
```javascript
// Teacher.js — Extra info for users with role 'teacher'
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    teacherId: {
      type: String,
      required: true,
      unique: true, // e.g., "TCH-2024-001"
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
    department: {
      type: String,
      required: true,
    },
    qualification: String,
    experience: Number, // years
    assignedClasses: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        semester: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherSchema);
```

### src/models/Course.js
```javascript
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true }, // e.g., "CS-101"
    department: { type: String, required: true },
    duration: { type: Number, required: true }, // in semesters
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
```

### src/models/Subject.js
```javascript
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    semester: { type: Number, required: true },
    credits: { type: Number, default: 3 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subject', subjectSchema);
```

### src/models/Assignment.js
```javascript
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    semester: Number,
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    totalMarks: {
      type: Number,
      default: 100,
    },
    file: {
      type: String, // Path to uploaded assignment file (PDF, etc.)
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
```

### src/models/Submission.js
```javascript
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    file: {
      type: String, // Path to submitted PDF
      required: [true, 'Submission file is required'],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: Number,
      default: null, // null means not graded yet
      min: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'late', 'resubmitted'],
      default: 'submitted',
    },
  },
  { timestamps: true }
);

// One student can submit one assignment only once
submissionSchema.index({ studentId: 1, assignmentId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
```

### src/models/Attendance.js
```javascript
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
  },
  { timestamps: true }
);

// One attendance record per student per subject per day
attendanceSchema.index({ studentId: 1, subject: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
```

### src/models/Notification.js
```javascript
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['assignment', 'grade', 'attendance', 'announcement', 'system'],
      default: 'system',
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
```

---

## 2.10 MIDDLEWARE

### src/middleware/auth.js
```javascript
// auth.js — Verifies JWT token from the Authorization header.
// Every protected route uses this middleware.
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header: "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized — no token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and attach to request (exclude password)
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired — please log in again' });
    }
    return res.status(401).json({ error: 'Not authorized — invalid token' });
  }
};

module.exports = { protect };
```

### src/middleware/role.js
```javascript
// role.js — Checks if the logged-in user has the required role.
// Usage: router.get('/admin-only', protect, authorize('admin'), controller)

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = { authorize };
```

### src/middleware/upload.js
```javascript
// upload.js — Configures Multer for file uploads (PDFs, images)
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage: where and how files are saved
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Organize files into subdirectories
    const subDir = req.uploadType || 'general';
    const fullPath = path.join(uploadDir, subDir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    // Unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File filter: only allow certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, PNG, DOC, DOCX are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
});

// Middleware helpers
const uploadAssignment = (req, res, next) => {
  req.uploadType = 'assignments';
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

const uploadSubmission = (req, res, next) => {
  req.uploadType = 'submissions';
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

module.exports = { uploadAssignment, uploadSubmission };
```

### src/middleware/errorHandler.js
```javascript
// errorHandler.js — Catches all errors and sends a clean JSON response.
// This prevents the server from crashing and leaking error details.

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ error: `${field} already exists` });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message,
  });
};

module.exports = { errorHandler };
```

### src/utils/generateToken.js
```javascript
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = { generateToken };
```

---

## 2.11 CONTROLLERS

### src/controllers/authController.js
```javascript
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { generateToken } = require('../utils/generateToken');

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Find user and include password field (normally excluded)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account has been deactivated' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me — Get current user profile
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    let profile = null;

    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id }).populate('course');
    } else if (user.role === 'teacher') {
      profile = await Teacher.findOne({ userId: user._id }).populate('subjects');
    }

    res.json({ user, profile });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe };
```

### src/controllers/adminController.js
```javascript
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');

// ──── USER MANAGEMENT ────

// POST /api/admin/create-student
const createStudent = async (req, res, next) => {
  try {
    const { name, email, password, department, courseId, semester, guardianName, guardianPhone, address } = req.body;

    // Create user account
    const user = await User.create({ name, email, password, role: 'student' });

    // Generate student ID
    const count = await Student.countDocuments();
    const studentId = `STU-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    // Create student profile
    const student = await Student.create({
      userId: user._id,
      studentId,
      department,
      course: courseId,
      semester: semester || 1,
      guardianName,
      guardianPhone,
      address,
    });

    res.status(201).json({ message: 'Student created successfully', user, student });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/create-teacher
const createTeacher = async (req, res, next) => {
  try {
    const { name, email, password, department, subjects, qualification, experience } = req.body;

    const user = await User.create({ name, email, password, role: 'teacher' });

    const count = await Teacher.countDocuments();
    const teacherId = `TCH-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const teacher = await Teacher.create({
      userId: user._id,
      teacherId,
      department,
      subjects: subjects || [],
      qualification,
      experience,
    });

    res.status(201).json({ message: 'Teacher created successfully', user, teacher });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id
const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated', user });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Clean up related records
    if (user.role === 'student') await Student.deleteOne({ userId: user._id });
    if (user.role === 'teacher') await Teacher.deleteOne({ userId: user._id });

    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// ──── COURSE MANAGEMENT ────

const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ name: 1 });
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// ──── SUBJECT MANAGEMENT ────

const createSubject = async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (error) {
    next(error);
  }
};

const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find().populate('course').sort({ name: 1 });
    res.json(subjects);
  } catch (error) {
    next(error);
  }
};

const assignSubjectToTeacher = async (req, res, next) => {
  try {
    const { teacherId, subjectId } = req.body;
    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $addToSet: { subjects: subjectId } },
      { new: true }
    ).populate('subjects');
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json({ message: 'Subject assigned', teacher });
  } catch (error) {
    next(error);
  }
};

// ──── DASHBOARD ────

const getDashboardStats = async (req, res, next) => {
  try {
    const [totalStudents, totalTeachers, totalCourses, totalSubjects] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      Course.countDocuments(),
      Subject.countDocuments(),
    ]);

    // Attendance stats for the current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const attendanceStats = await Attendance.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      totalStudents,
      totalTeachers,
      totalCourses,
      totalSubjects,
      attendanceStats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent, createTeacher, getAllUsers, updateUser, deleteUser,
  createCourse, getCourses, createSubject, getSubjects, assignSubjectToTeacher,
  getDashboardStats,
};
```

### src/controllers/teacherController.js
```javascript
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const { getIO } = require('../config/socket');
const Notification = require('../models/Notification');

// GET /api/teacher/my-classes
const getMyClasses = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id })
      .populate('subjects')
      .populate('assignedClasses.course');
    if (!teacher) return res.status(404).json({ error: 'Teacher profile not found' });
    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

// GET /api/teacher/students?course=xxx&semester=x
const getStudentList = async (req, res, next) => {
  try {
    const { course, semester } = req.query;
    const filter = {};
    if (course) filter.course = course;
    if (semester) filter.semester = parseInt(semester);

    const students = await Student.find(filter).populate('userId', 'name email');
    res.json(students);
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyClasses, getStudentList };
```

### src/controllers/assignmentController.js
```javascript
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');

// POST /api/assignments — Teacher creates assignment
const createAssignment = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) return res.status(404).json({ error: 'Teacher profile not found' });

    const assignmentData = {
      ...req.body,
      teacherId: teacher._id,
    };

    // If a file was uploaded (via Multer)
    if (req.file) {
      assignmentData.file = `/uploads/assignments/${req.file.filename}`;
    }

    const assignment = await Assignment.create(assignmentData);

    // Notify students in this course/semester
    const students = await Student.find({
      course: assignment.course,
      semester: assignment.semester,
    }).populate('userId');

    const notifications = students.map((s) => ({
      userId: s.userId._id,
      title: 'New Assignment',
      message: `New assignment: "${assignment.title}" — Due: ${assignment.dueDate.toLocaleDateString()}`,
      type: 'assignment',
    }));

    await Notification.insertMany(notifications);

    // Real-time notification via Socket.io
    const io = getIO();
    students.forEach((s) => {
      io.to(s.userId._id.toString()).emit('notification', {
        title: 'New Assignment',
        message: `"${assignment.title}" is due ${assignment.dueDate.toLocaleDateString()}`,
      });
    });

    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
};

// GET /api/assignments — List assignments (filtered by role)
const getAssignments = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: req.user._id });
      filter.teacherId = teacher._id;
    } else if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      filter.course = student.course;
      filter.semester = student.semester;
      filter.isActive = true;
    }

    const assignments = await Assignment.find(filter)
      .populate('subject', 'name code')
      .populate('teacherId', 'teacherId')
      .sort({ dueDate: -1 });

    res.json(assignments);
  } catch (error) {
    next(error);
  }
};

// POST /api/assignments/:id/submit — Student submits assignment
const submitAssignment = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    // Check for late submission
    const isLate = new Date() > assignment.dueDate;

    const submission = await Submission.findOneAndUpdate(
      { studentId: student._id, assignmentId: assignment._id },
      {
        file: `/uploads/submissions/${req.file.filename}`,
        submittedAt: new Date(),
        status: isLate ? 'late' : 'submitted',
      },
      { upsert: true, new: true }
    );

    // Notify teacher
    const teacher = await Teacher.findById(assignment.teacherId).populate('userId');
    if (teacher) {
      await Notification.create({
        userId: teacher.userId._id,
        title: 'New Submission',
        message: `${req.user.name} submitted "${assignment.title}"${isLate ? ' (LATE)' : ''}`,
        type: 'assignment',
      });

      const io = getIO();
      io.to(teacher.userId._id.toString()).emit('notification', {
        title: 'New Submission',
        message: `${req.user.name} submitted "${assignment.title}"`,
      });
    }

    res.json({ message: isLate ? 'Submitted (late)' : 'Submitted successfully', submission });
  } catch (error) {
    next(error);
  }
};

// PUT /api/assignments/submissions/:id/grade — Teacher grades submission
const gradeSubmission = async (req, res, next) => {
  try {
    const { grade, feedback } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { grade, feedback, status: 'graded' },
      { new: true }
    ).populate('studentId');

    if (!submission) return res.status(404).json({ error: 'Submission not found' });

    // Notify student
    const student = await Student.findById(submission.studentId).populate('userId');
    if (student) {
      await Notification.create({
        userId: student.userId._id,
        title: 'Assignment Graded',
        message: `You received ${grade} marks. ${feedback || ''}`,
        type: 'grade',
      });

      const io = getIO();
      io.to(student.userId._id.toString()).emit('notification', {
        title: 'Assignment Graded',
        message: `You scored ${grade}`,
      });
    }

    res.json({ message: 'Graded successfully', submission });
  } catch (error) {
    next(error);
  }
};

// GET /api/assignments/:id/submissions — Teacher views submissions
const getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.id })
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

module.exports = { createAssignment, getAssignments, submitAssignment, gradeSubmission, getSubmissions };
```

### src/controllers/attendanceController.js
```javascript
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// POST /api/attendance/mark — Teacher marks attendance for multiple students
const markAttendance = async (req, res, next) => {
  try {
    const { subjectId, date, records } = req.body;
    // records: [{ studentId: "xxx", status: "present" }, ...]

    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) return res.status(404).json({ error: 'Teacher profile not found' });

    const attendanceRecords = records.map((r) => ({
      studentId: r.studentId,
      subject: subjectId,
      date: new Date(date),
      status: r.status,
      markedBy: teacher._id,
    }));

    // Use bulkWrite to upsert (update if exists, insert if new)
    const operations = attendanceRecords.map((record) => ({
      updateOne: {
        filter: {
          studentId: record.studentId,
          subject: record.subject,
          date: record.date,
        },
        update: { $set: record },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(operations);
    res.json({ message: `Attendance marked for ${records.length} students` });
  } catch (error) {
    next(error);
  }
};

// GET /api/attendance/student/:studentId — View attendance for a student
const getStudentAttendance = async (req, res, next) => {
  try {
    const { subjectId, startDate, endDate } = req.query;
    const filter = { studentId: req.params.studentId };

    if (subjectId) filter.subject = subjectId;
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const records = await Attendance.find(filter)
      .populate('subject', 'name code')
      .sort({ date: -1 });

    // Calculate percentage
    const total = records.length;
    const present = records.filter((r) => r.status === 'present').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({ records, total, present, percentage });
  } catch (error) {
    next(error);
  }
};

// GET /api/attendance/my — Student views own attendance
const getMyAttendance = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const { subjectId } = req.query;
    const filter = { studentId: student._id };
    if (subjectId) filter.subject = subjectId;

    const records = await Attendance.find(filter)
      .populate('subject', 'name code')
      .sort({ date: -1 });

    const total = records.length;
    const present = records.filter((r) => r.status === 'present').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({ records, total, present, percentage });
  } catch (error) {
    next(error);
  }
};

module.exports = { markAttendance, getStudentAttendance, getMyAttendance };
```

### src/controllers/studentController.js
```javascript
const Student = require('../models/Student');
const Submission = require('../models/Submission');

// GET /api/student/profile
const getProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate('userId', 'name email avatar')
      .populate('course');
    if (!student) return res.status(404).json({ error: 'Student profile not found' });
    res.json(student);
  } catch (error) {
    next(error);
  }
};

// GET /api/student/grades
const getGrades = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const submissions = await Submission.find({
      studentId: student._id,
      status: 'graded',
    })
      .populate({
        path: 'assignmentId',
        populate: { path: 'subject', select: 'name code' },
      })
      .sort({ updatedAt: -1 });

    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

// GET /api/student/notifications
const getNotifications = async (req, res, next) => {
  try {
    const Notification = require('../models/Notification');
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// PUT /api/student/notifications/:id/read
const markNotificationRead = async (req, res, next) => {
  try {
    const Notification = require('../models/Notification');
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, getGrades, getNotifications, markNotificationRead };
```

### src/controllers/notificationController.js
```javascript
const Notification = require('../models/Notification');

const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });
    res.json({ notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true }
    );
    res.json({ message: 'Marked as read' });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: 'All marked as read' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead };
```

---

## 2.12 ROUTES

### src/routes/authRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
```

### src/routes/adminRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  createStudent, createTeacher, getAllUsers, updateUser, deleteUser,
  createCourse, getCourses, createSubject, getSubjects, assignSubjectToTeacher,
  getDashboardStats,
} = require('../controllers/adminController');

// All admin routes require authentication + admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.post('/students', createStudent);
router.post('/teachers', createTeacher);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/courses', createCourse);
router.get('/courses', getCourses);
router.post('/subjects', createSubject);
router.get('/subjects', getSubjects);
router.post('/assign-subject', assignSubjectToTeacher);

module.exports = router;
```

### src/routes/teacherRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { getMyClasses, getStudentList } = require('../controllers/teacherController');

router.use(protect, authorize('teacher'));

router.get('/my-classes', getMyClasses);
router.get('/students', getStudentList);

module.exports = router;
```

### src/routes/studentRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { getProfile, getGrades, getNotifications, markNotificationRead } = require('../controllers/studentController');

router.use(protect, authorize('student'));

router.get('/profile', getProfile);
router.get('/grades', getGrades);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

module.exports = router;
```

### src/routes/attendanceRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { markAttendance, getStudentAttendance, getMyAttendance } = require('../controllers/attendanceController');

router.post('/mark', protect, authorize('teacher'), markAttendance);
router.get('/student/:studentId', protect, authorize('teacher', 'admin'), getStudentAttendance);
router.get('/my', protect, authorize('student'), getMyAttendance);

module.exports = router;
```

### src/routes/assignmentRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { uploadAssignment, uploadSubmission } = require('../middleware/upload');
const {
  createAssignment, getAssignments, submitAssignment,
  gradeSubmission, getSubmissions,
} = require('../controllers/assignmentController');

router.get('/', protect, getAssignments);
router.post('/', protect, authorize('teacher'), uploadAssignment, createAssignment);
router.post('/:id/submit', protect, authorize('student'), uploadSubmission, submitAssignment);
router.get('/:id/submissions', protect, authorize('teacher'), getSubmissions);
router.put('/submissions/:id/grade', protect, authorize('teacher'), gradeSubmission);

module.exports = router;
```

---

## 2.13 Package.json Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## 2.14 Running the Backend

```bash
cd college-management-backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected: cluster0-shard-00-xx.xxxxx.mongodb.net
```

---

## 2.15 Seed Script (Test Data)

Create `src/seed.js`:

```javascript
// seed.js — Populates the database with test data
// Run: node src/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Course = require('./models/Course');
const Subject = require('./models/Subject');

const seedDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Teacher.deleteMany({}),
    Course.deleteMany({}),
    Subject.deleteMany({}),
  ]);

  // Create Admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@college.com',
    password: 'admin123',
    role: 'admin',
  });
  console.log('✅ Admin created: admin@college.com / admin123');

  // Create Courses
  const courses = await Course.insertMany([
    { name: 'Computer Science', code: 'CS-101', department: 'Engineering', duration: 8 },
    { name: 'Electrical Engineering', code: 'EE-101', department: 'Engineering', duration: 8 },
    { name: 'Business Administration', code: 'BA-101', department: 'Management', duration: 6 },
  ]);

  // Create Subjects
  const subjects = await Subject.insertMany([
    { name: 'Data Structures', code: 'CS-201', course: courses[0]._id, semester: 3, credits: 4 },
    { name: 'Algorithms', code: 'CS-202', course: courses[0]._id, semester: 3, credits: 4 },
    { name: 'Database Systems', code: 'CS-301', course: courses[0]._id, semester: 4, credits: 3 },
    { name: 'Circuit Theory', code: 'EE-201', course: courses[1]._id, semester: 3, credits: 4 },
    { name: 'Marketing', code: 'BA-201', course: courses[2]._id, semester: 2, credits: 3 },
  ]);

  // Create Teachers
  const teacherUsers = await User.insertMany([
    { name: 'Dr. Sarah Johnson', email: 'sarah@college.com', password: 'teacher123', role: 'teacher' },
    { name: 'Prof. James Wilson', email: 'james@college.com', password: 'teacher123', role: 'teacher' },
  ]);

  const teachers = await Teacher.insertMany([
    {
      userId: teacherUsers[0]._id, teacherId: 'TCH-2024-001',
      department: 'Engineering', subjects: [subjects[0]._id, subjects[1]._id],
      qualification: 'PhD Computer Science', experience: 10,
      assignedClasses: [{ course: courses[0]._id, semester: 3 }],
    },
    {
      userId: teacherUsers[1]._id, teacherId: 'TCH-2024-002',
      department: 'Engineering', subjects: [subjects[2]._id, subjects[3]._id],
      qualification: 'PhD Electrical Engineering', experience: 8,
      assignedClasses: [{ course: courses[0]._id, semester: 4 }, { course: courses[1]._id, semester: 3 }],
    },
  ]);

  // Create Students
  const studentUsers = await User.insertMany([
    { name: 'Alice Smith', email: 'alice@college.com', password: 'student123', role: 'student' },
    { name: 'Bob Brown', email: 'bob@college.com', password: 'student123', role: 'student' },
    { name: 'Charlie Davis', email: 'charlie@college.com', password: 'student123', role: 'student' },
    { name: 'Diana Evans', email: 'diana@college.com', password: 'student123', role: 'student' },
    { name: 'Ethan Foster', email: 'ethan@college.com', password: 'student123', role: 'student' },
  ]);

  await Student.insertMany([
    { userId: studentUsers[0]._id, studentId: 'STU-2024-001', department: 'Engineering', course: courses[0]._id, semester: 3 },
    { userId: studentUsers[1]._id, studentId: 'STU-2024-002', department: 'Engineering', course: courses[0]._id, semester: 3 },
    { userId: studentUsers[2]._id, studentId: 'STU-2024-003', department: 'Engineering', course: courses[0]._id, semester: 4 },
    { userId: studentUsers[3]._id, studentId: 'STU-2024-004', department: 'Engineering', course: courses[1]._id, semester: 3 },
    { userId: studentUsers[4]._id, studentId: 'STU-2024-005', department: 'Management', course: courses[2]._id, semester: 2 },
  ]);

  console.log('✅ Seed data created successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('Admin:   admin@college.com / admin123');
  console.log('Teacher: sarah@college.com / teacher123');
  console.log('Teacher: james@college.com / teacher123');
  console.log('Student: alice@college.com / student123');
  console.log('Student: bob@college.com   / student123');

  await mongoose.disconnect();
};

seedDB().catch(console.error);
```

Run: `node src/seed.js`

---

# PART 3: ANGULAR FRONTEND

## 3.1 Project Setup

```bash
# Install Angular CLI globally
npm install -g @angular/cli

# Create new project (standalone components, no SSR)
ng new college-management-frontend --standalone --style=css --routing --ssr=false

cd college-management-frontend

# Add Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# Add chart library
npm install ng2-charts chart.js

# Add Socket.io client
npm install socket.io-client
```

## 3.2 Tailwind Config

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a5f',
        },
      },
    },
  },
  plugins: [],
};
```

**src/styles.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900 font-sans antialiased;
  }
}

@layer components {
  .btn-primary {
    @apply bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 
           transition-colors duration-200 font-medium disabled:opacity-50;
  }
  .btn-secondary {
    @apply bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 
           transition-colors duration-200 font-medium;
  }
  .btn-danger {
    @apply bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 
           transition-colors duration-200 font-medium;
  }
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-100 p-6;
  }
  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg 
           focus:ring-2 focus:ring-brand-500 focus:border-transparent 
           outline-none transition-all duration-200;
  }
  .label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }
  .stat-card {
    @apply card flex items-center gap-4;
  }
  .table-header {
    @apply bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider;
  }
}
```

## 3.3 Folder Structure

```
src/app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── api.service.ts
│   │   ├── notification.service.ts
│   │   └── socket.service.ts
│   └── models/
│       ├── user.model.ts
│       ├── student.model.ts
│       ├── teacher.model.ts
│       ├── assignment.model.ts
│       ├── attendance.model.ts
│       └── notification.model.ts
├── shared/
│   ├── components/
│   │   ├── navbar/
│   │   ├── sidebar/
│   │   ├── loading-spinner/
│   │   └── notification-bell/
│   └── pipes/
│       └── date-format.pipe.ts
├── features/
│   ├── auth/
│   │   └── login/
│   │       └── login.component.ts
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── manage-students/
│   │   ├── manage-teachers/
│   │   ├── manage-courses/
│   │   └── manage-subjects/
│   ├── teacher/
│   │   ├── dashboard/
│   │   ├── attendance/
│   │   ├── assignments/
│   │   └── grade-submissions/
│   └── student/
│       ├── dashboard/
│       ├── attendance/
│       ├── assignments/
│       ├── grades/
│       └── profile/
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

## 3.4 Environment Config

**src/environments/environment.ts:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  socketUrl: 'http://localhost:5000',
};
```

**src/environments/environment.prod.ts:**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api',
  socketUrl: 'https://your-api-domain.com',
};
```

## 3.5 Models

### src/app/core/models/user.model.ts
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  isActive: boolean;
  avatar?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
```

### src/app/core/models/student.model.ts
```typescript
export interface Student {
  _id: string;
  userId: any; // populated User
  studentId: string;
  department: string;
  course: any; // populated Course
  semester: number;
  enrollmentDate: string;
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
}
```

### src/app/core/models/assignment.model.ts
```typescript
export interface Assignment {
  _id: string;
  title: string;
  description: string;
  teacherId: any;
  subject: any;
  course: any;
  semester: number;
  dueDate: string;
  totalMarks: number;
  file?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Submission {
  _id: string;
  studentId: any;
  assignmentId: any;
  file: string;
  submittedAt: string;
  grade: number | null;
  feedback: string;
  status: 'submitted' | 'graded' | 'late' | 'resubmitted';
}
```

### src/app/core/models/attendance.model.ts
```typescript
export interface AttendanceRecord {
  _id: string;
  studentId: any;
  subject: any;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: any;
}

export interface AttendanceResponse {
  records: AttendanceRecord[];
  total: number;
  present: number;
  percentage: number;
}
```

### src/app/core/models/notification.model.ts
```typescript
export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'attendance' | 'announcement' | 'system';
  isRead: boolean;
  createdAt: string;
}
```

## 3.6 Services

### src/app/core/services/auth.service.ts
```typescript
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  // Angular Signals for reactive state
  private currentUser = signal<User | null>(null);
  private token = signal<string | null>(null);

  // Computed signals (derived state)
  user = this.currentUser.asReadonly();
  isLoggedIn = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role || null);
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isTeacher = computed(() => this.currentUser()?.role === 'teacher');
  isStudent = computed(() => this.currentUser()?.role === 'student');

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      this.token.set(storedToken);
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        this.token.set(response.token);
        this.currentUser.set(response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.token();
  }

  getMe() {
    return this.http.get<{ user: User; profile: any }>(`${this.apiUrl}/auth/me`);
  }
}
```

### src/app/core/services/api.service.ts
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ──── ADMIN ────
  getDashboardStats() {
    return this.http.get<any>(`${this.apiUrl}/admin/dashboard`);
  }

  getUsers(role?: string, page = 1) {
    let params = new HttpParams().set('page', page.toString());
    if (role) params = params.set('role', role);
    return this.http.get<any>(`${this.apiUrl}/admin/users`, { params });
  }

  createStudent(data: any) {
    return this.http.post<any>(`${this.apiUrl}/admin/students`, data);
  }

  createTeacher(data: any) {
    return this.http.post<any>(`${this.apiUrl}/admin/teachers`, data);
  }

  updateUser(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl}/admin/users/${id}`, data);
  }

  deleteUser(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/admin/users/${id}`);
  }

  getCourses() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/courses`);
  }

  createCourse(data: any) {
    return this.http.post<any>(`${this.apiUrl}/admin/courses`, data);
  }

  getSubjects() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/subjects`);
  }

  createSubject(data: any) {
    return this.http.post<any>(`${this.apiUrl}/admin/subjects`, data);
  }

  assignSubject(teacherId: string, subjectId: string) {
    return this.http.post<any>(`${this.apiUrl}/admin/assign-subject`, { teacherId, subjectId });
  }

  // ──── TEACHER ────
  getMyClasses() {
    return this.http.get<any>(`${this.apiUrl}/teacher/my-classes`);
  }

  getStudentList(course?: string, semester?: number) {
    let params = new HttpParams();
    if (course) params = params.set('course', course);
    if (semester) params = params.set('semester', semester.toString());
    return this.http.get<any[]>(`${this.apiUrl}/teacher/students`, { params });
  }

  // ──── ASSIGNMENTS ────
  getAssignments() {
    return this.http.get<any[]>(`${this.apiUrl}/assignments`);
  }

  createAssignment(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/assignments`, formData);
  }

  submitAssignment(assignmentId: string, formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/assignments/${assignmentId}/submit`, formData);
  }

  getSubmissions(assignmentId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/assignments/${assignmentId}/submissions`);
  }

  gradeSubmission(submissionId: string, grade: number, feedback: string) {
    return this.http.put<any>(`${this.apiUrl}/assignments/submissions/${submissionId}/grade`, {
      grade,
      feedback,
    });
  }

  // ──── ATTENDANCE ────
  markAttendance(data: { subjectId: string; date: string; records: any[] }) {
    return this.http.post<any>(`${this.apiUrl}/attendance/mark`, data);
  }

  getStudentAttendance(studentId: string, subjectId?: string) {
    let params = new HttpParams();
    if (subjectId) params = params.set('subjectId', subjectId);
    return this.http.get<any>(`${this.apiUrl}/attendance/student/${studentId}`, { params });
  }

  getMyAttendance(subjectId?: string) {
    let params = new HttpParams();
    if (subjectId) params = params.set('subjectId', subjectId);
    return this.http.get<any>(`${this.apiUrl}/attendance/my`, { params });
  }

  // ──── STUDENT ────
  getStudentProfile() {
    return this.http.get<any>(`${this.apiUrl}/student/profile`);
  }

  getMyGrades() {
    return this.http.get<any[]>(`${this.apiUrl}/student/grades`);
  }

  // ──── NOTIFICATIONS ────
  getNotifications() {
    return this.http.get<any>(`${this.apiUrl}/student/notifications`);
  }

  markNotificationRead(id: string) {
    return this.http.put<any>(`${this.apiUrl}/student/notifications/${id}/read`, {});
  }
}
```

### src/app/core/services/socket.service.ts
```typescript
import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Notification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;

  // Signal for real-time notifications
  latestNotification = signal<Notification | null>(null);
  unreadCount = signal(0);

  constructor(private authService: AuthService) {}

  connect(): void {
    const user = this.authService.user();
    if (!user) return;

    this.socket = io(environment.socketUrl);

    this.socket.on('connect', () => {
      console.log('🔌 Connected to Socket.io');
      // Join personal room for targeted notifications
      this.socket?.emit('join', user.id);
    });

    this.socket.on('notification', (notification: Notification) => {
      this.latestNotification.set(notification);
      this.unreadCount.update((count) => count + 1);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.io');
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}
```

## 3.7 Guards

### src/app/core/guards/auth.guard.ts
```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

### src/app/core/guards/role.guard.ts
```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (...allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const role = authService.userRole();
    if (role && allowedRoles.includes(role)) {
      return true;
    }

    router.navigate(['/unauthorized']);
    return false;
  };
};
```

## 3.8 Interceptor

### src/app/core/interceptors/auth.interceptor.ts
```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
```

## 3.9 App Config

### src/app/app.config.ts
```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
```

## 3.10 Routes

### src/app/app.routes.ts
```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  // ──── ADMIN ROUTES ────
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('admin')],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./features/admin/manage-students/manage-students.component').then(
            (m) => m.ManageStudentsComponent
          ),
      },
      {
        path: 'teachers',
        loadComponent: () =>
          import('./features/admin/manage-teachers/manage-teachers.component').then(
            (m) => m.ManageTeachersComponent
          ),
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./features/admin/manage-courses/manage-courses.component').then(
            (m) => m.ManageCoursesComponent
          ),
      },
      {
        path: 'subjects',
        loadComponent: () =>
          import('./features/admin/manage-subjects/manage-subjects.component').then(
            (m) => m.ManageSubjectsComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  // ──── TEACHER ROUTES ────
  {
    path: 'teacher',
    canActivate: [authGuard, roleGuard('teacher')],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/teacher/dashboard/teacher-dashboard.component').then(
            (m) => m.TeacherDashboardComponent
          ),
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./features/teacher/attendance/teacher-attendance.component').then(
            (m) => m.TeacherAttendanceComponent
          ),
      },
      {
        path: 'assignments',
        loadComponent: () =>
          import('./features/teacher/assignments/teacher-assignments.component').then(
            (m) => m.TeacherAssignmentsComponent
          ),
      },
      {
        path: 'assignments/:id/submissions',
        loadComponent: () =>
          import('./features/teacher/grade-submissions/grade-submissions.component').then(
            (m) => m.GradeSubmissionsComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  // ──── STUDENT ROUTES ────
  {
    path: 'student',
    canActivate: [authGuard, roleGuard('student')],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/student/dashboard/student-dashboard.component').then(
            (m) => m.StudentDashboardComponent
          ),
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./features/student/attendance/student-attendance.component').then(
            (m) => m.StudentAttendanceComponent
          ),
      },
      {
        path: 'assignments',
        loadComponent: () =>
          import('./features/student/assignments/student-assignments.component').then(
            (m) => m.StudentAssignmentsComponent
          ),
      },
      {
        path: 'grades',
        loadComponent: () =>
          import('./features/student/grades/student-grades.component').then(
            (m) => m.StudentGradesComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/student/profile/student-profile.component').then(
            (m) => m.StudentProfileComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
```

## 3.11 Key Components

### Login Component
**src/app/features/auth/login/login.component.ts:**
```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-900 to-brand-600">
      <div class="card w-full max-w-md mx-4">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-brand-900">🎓 College CMS</h1>
          <p class="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        @if (error()) {
          <div class="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="onLogin()" class="space-y-4">
          <div>
            <label class="label">Email</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              class="input-field"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label class="label">Password</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              class="input-field"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" class="btn-primary w-full" [disabled]="loading()">
            {{ loading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.loading.set(true);
    this.error.set('');

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.loading.set(false);
        // Redirect based on role
        const role = response.user.role;
        this.router.navigate([`/${role}/dashboard`]);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.error || 'Login failed');
      },
    });
  }
}
```

### Sidebar Component
**src/app/shared/components/sidebar/sidebar.component.ts:**
```typescript
import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 bg-brand-900 text-white min-h-screen p-4 flex flex-col">
      <div class="text-xl font-bold mb-8 px-2">🎓 College CMS</div>
      <nav class="flex-1 space-y-1">
        @for (item of menuItems(); track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-brand-700"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-700/50 transition-colors"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
      <button (click)="authService.logout()" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-600/50 transition-colors mt-4">
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </aside>
  `,
})
export class SidebarComponent {
  constructor(public authService: AuthService) {}

  menuItems = computed(() => {
    const role = this.authService.userRole();
    switch (role) {
      case 'admin':
        return [
          { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
          { path: '/admin/students', icon: '👨‍🎓', label: 'Students' },
          { path: '/admin/teachers', icon: '👨‍🏫', label: 'Teachers' },
          { path: '/admin/courses', icon: '📚', label: 'Courses' },
          { path: '/admin/subjects', icon: '📖', label: 'Subjects' },
        ];
      case 'teacher':
        return [
          { path: '/teacher/dashboard', icon: '📊', label: 'Dashboard' },
          { path: '/teacher/attendance', icon: '📋', label: 'Attendance' },
          { path: '/teacher/assignments', icon: '📝', label: 'Assignments' },
        ];
      case 'student':
        return [
          { path: '/student/dashboard', icon: '📊', label: 'Dashboard' },
          { path: '/student/attendance', icon: '📋', label: 'My Attendance' },
          { path: '/student/assignments', icon: '📝', label: 'Assignments' },
          { path: '/student/grades', icon: '🏆', label: 'Grades' },
          { path: '/student/profile', icon: '👤', label: 'Profile' },
        ];
      default:
        return [];
    }
  });
}
```

### Admin Dashboard
**src/app/features/admin/dashboard/admin-dashboard.component.ts:**
```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { ApiService } from '../../../core/services/api.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, BaseChartDirective],
  template: `
    <div class="flex min-h-screen">
      <app-sidebar />
      <main class="flex-1 p-8">
        <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="stat-card">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">👨‍🎓</div>
            <div>
              <p class="text-sm text-gray-500">Total Students</p>
              <p class="text-2xl font-bold">{{ stats()?.totalStudents || 0 }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">👨‍🏫</div>
            <div>
              <p class="text-sm text-gray-500">Total Teachers</p>
              <p class="text-2xl font-bold">{{ stats()?.totalTeachers || 0 }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">📚</div>
            <div>
              <p class="text-sm text-gray-500">Courses</p>
              <p class="text-2xl font-bold">{{ stats()?.totalCourses || 0 }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">📖</div>
            <div>
              <p class="text-sm text-gray-500">Subjects</p>
              <p class="text-2xl font-bold">{{ stats()?.totalSubjects || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Attendance Chart -->
        <div class="card">
          <h2 class="text-lg font-semibold mb-4">Monthly Attendance Overview</h2>
          @if (chartData) {
            <canvas baseChart
              [data]="chartData"
              [options]="chartOptions"
              type="doughnut"
              style="max-height: 300px;">
            </canvas>
          }
        </div>
      </main>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<any>(null);

  chartData: ChartConfiguration<'doughnut'>['data'] | null = null;
  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        // Build chart from attendance stats
        const present = data.attendanceStats?.find((s: any) => s._id === 'present')?.count || 0;
        const absent = data.attendanceStats?.find((s: any) => s._id === 'absent')?.count || 0;
        const late = data.attendanceStats?.find((s: any) => s._id === 'late')?.count || 0;

        this.chartData = {
          labels: ['Present', 'Absent', 'Late'],
          datasets: [
            {
              data: [present, absent, late],
              backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'],
            },
          ],
        };
      },
    });
  }
}
```

### Teacher Attendance Component
**src/app/features/teacher/attendance/teacher-attendance.component.ts:**
```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="flex min-h-screen">
      <app-sidebar />
      <main class="flex-1 p-8">
        <h1 class="text-2xl font-bold mb-6">Mark Attendance</h1>

        <!-- Subject & Date Selection -->
        <div class="card mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="label">Subject</label>
              <select [(ngModel)]="selectedSubject" (ngModelChange)="loadStudents()" class="input-field">
                <option value="">Select Subject</option>
                @for (sub of subjects(); track sub._id) {
                  <option [value]="sub._id">{{ sub.name }}</option>
                }
              </select>
            </div>
            <div>
              <label class="label">Date</label>
              <input type="date" [(ngModel)]="selectedDate" class="input-field" />
            </div>
            <div class="flex items-end">
              <button (click)="submitAttendance()" class="btn-primary" [disabled]="!selectedSubject || !selectedDate">
                Save Attendance
              </button>
            </div>
          </div>
        </div>

        <!-- Student List -->
        @if (students().length > 0) {
          <div class="card">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="table-header p-3">Student ID</th>
                  <th class="table-header p-3">Name</th>
                  <th class="table-header p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                @for (student of students(); track student._id) {
                  <tr class="border-b hover:bg-gray-50">
                    <td class="p-3">{{ student.studentId }}</td>
                    <td class="p-3">{{ student.userId?.name }}</td>
                    <td class="p-3">
                      <select [(ngModel)]="student.attendanceStatus" class="input-field w-auto">
                        <option value="present">✅ Present</option>
                        <option value="absent">❌ Absent</option>
                        <option value="late">⏰ Late</option>
                      </select>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        @if (message()) {
          <div class="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">{{ message() }}</div>
        }
      </main>
    </div>
  `,
})
export class TeacherAttendanceComponent implements OnInit {
  subjects = signal<any[]>([]);
  students = signal<any[]>([]);
  selectedSubject = '';
  selectedDate = new Date().toISOString().split('T')[0];
  message = signal('');

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getMyClasses().subscribe({
      next: (teacher) => this.subjects.set(teacher.subjects || []),
    });
  }

  loadStudents(): void {
    // Load students for the selected subject's course/semester
    this.api.getStudentList().subscribe({
      next: (students) => {
        this.students.set(
          students.map((s: any) => ({ ...s, attendanceStatus: 'present' }))
        );
      },
    });
  }

  submitAttendance(): void {
    const records = this.students().map((s) => ({
      studentId: s._id,
      status: s.attendanceStatus,
    }));

    this.api
      .markAttendance({
        subjectId: this.selectedSubject,
        date: this.selectedDate,
        records,
      })
      .subscribe({
        next: (res) => this.message.set(res.message),
        error: (err) => this.message.set(err.error?.error || 'Error marking attendance'),
      });
  }
}
```

### Student Assignments Component
**src/app/features/student/assignments/student-assignments.component.ts:**
```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-student-assignments',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <div class="flex min-h-screen">
      <app-sidebar />
      <main class="flex-1 p-8">
        <h1 class="text-2xl font-bold mb-6">My Assignments</h1>

        <div class="space-y-4">
          @for (assignment of assignments(); track assignment._id) {
            <div class="card">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-semibold">{{ assignment.title }}</h3>
                  <p class="text-gray-500 text-sm mt-1">{{ assignment.description }}</p>
                  <p class="text-sm mt-2">
                    <span class="font-medium">Subject:</span> {{ assignment.subject?.name }}
                    &nbsp;|&nbsp;
                    <span class="font-medium">Due:</span> {{ assignment.dueDate | date:'mediumDate' }}
                    &nbsp;|&nbsp;
                    <span class="font-medium">Marks:</span> {{ assignment.totalMarks }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  @if (assignment.file) {
                    <a [href]="'http://localhost:5000' + assignment.file" target="_blank" class="btn-secondary text-sm">
                      📥 Download
                    </a>
                  }
                  <label class="btn-primary text-sm cursor-pointer">
                    📤 Submit
                    <input type="file" accept=".pdf" class="hidden"
                      (change)="onFileSelected($event, assignment._id)" />
                  </label>
                </div>
              </div>

              @if (uploadStatus()[assignment._id]) {
                <div class="mt-3 text-sm"
                  [class]="uploadStatus()[assignment._id]?.success ? 'text-green-600' : 'text-red-600'">
                  {{ uploadStatus()[assignment._id]?.message }}
                </div>
              }
            </div>
          }

          @if (assignments().length === 0) {
            <div class="card text-center text-gray-500 py-12">
              No assignments available yet.
            </div>
          }
        </div>
      </main>
    </div>
  `,
})
export class StudentAssignmentsComponent implements OnInit {
  assignments = signal<any[]>([]);
  uploadStatus = signal<Record<string, { success: boolean; message: string }>>({});

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAssignments().subscribe({
      next: (data) => this.assignments.set(data),
    });
  }

  onFileSelected(event: Event, assignmentId: string): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.api.submitAssignment(assignmentId, formData).subscribe({
      next: (res) => {
        this.uploadStatus.update((s) => ({
          ...s,
          [assignmentId]: { success: true, message: res.message },
        }));
      },
      error: (err) => {
        this.uploadStatus.update((s) => ({
          ...s,
          [assignmentId]: { success: false, message: err.error?.error || 'Upload failed' },
        }));
      },
    });
  }
}
```

### Student Attendance Component
**src/app/features/student/attendance/student-attendance.component.ts:**
```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { ApiService } from '../../../core/services/api.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [CommonModule, SidebarComponent, BaseChartDirective],
  template: `
    <div class="flex min-h-screen">
      <app-sidebar />
      <main class="flex-1 p-8">
        <h1 class="text-2xl font-bold mb-6">My Attendance</h1>

        <!-- Attendance Percentage -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="stat-card">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">✅</div>
            <div>
              <p class="text-sm text-gray-500">Present</p>
              <p class="text-2xl font-bold">{{ attendance()?.present || 0 }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">❌</div>
            <div>
              <p class="text-sm text-gray-500">Total Classes</p>
              <p class="text-2xl font-bold">{{ attendance()?.total || 0 }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              [class]="(attendance()?.percentage || 0) >= 75 ? 'bg-green-100' : 'bg-red-100'">
              📊
            </div>
            <div>
              <p class="text-sm text-gray-500">Percentage</p>
              <p class="text-2xl font-bold"
                [class]="(attendance()?.percentage || 0) >= 75 ? 'text-green-600' : 'text-red-600'">
                {{ attendance()?.percentage || 0 }}%
              </p>
            </div>
          </div>
        </div>

        <!-- Chart -->
        @if (chartData) {
          <div class="card mb-8">
            <h2 class="text-lg font-semibold mb-4">Attendance Distribution</h2>
            <canvas baseChart [data]="chartData" [options]="chartOptions" type="pie" style="max-height: 300px;"></canvas>
          </div>
        }

        <!-- Records Table -->
        <div class="card">
          <h2 class="text-lg font-semibold mb-4">Attendance Records</h2>
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="table-header p-3">Date</th>
                <th class="table-header p-3">Subject</th>
                <th class="table-header p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (record of attendance()?.records || []; track record._id) {
                <tr class="border-b hover:bg-gray-50">
                  <td class="p-3">{{ record.date | date:'mediumDate' }}</td>
                  <td class="p-3">{{ record.subject?.name }}</td>
                  <td class="p-3">
                    <span class="px-2 py-1 rounded-full text-xs font-medium"
                      [class]="{
                        'bg-green-100 text-green-700': record.status === 'present',
                        'bg-red-100 text-red-700': record.status === 'absent',
                        'bg-yellow-100 text-yellow-700': record.status === 'late'
                      }">
                      {{ record.status | titlecase }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `,
})
export class StudentAttendanceComponent implements OnInit {
  attendance = signal<any>(null);
  chartData: ChartConfiguration<'pie'>['data'] | null = null;
  chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getMyAttendance().subscribe({
      next: (data) => {
        this.attendance.set(data);
        const present = data.present || 0;
        const absent = (data.total || 0) - present;
        this.chartData = {
          labels: ['Present', 'Absent'],
          datasets: [{ data: [present, absent], backgroundColor: ['#22c55e', '#ef4444'] }],
        };
      },
    });
  }
}
```

### Student Grades Component
**src/app/features/student/grades/student-grades.component.ts:**
```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-student-grades',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <div class="flex min-h-screen">
      <app-sidebar />
      <main class="flex-1 p-8">
        <h1 class="text-2xl font-bold mb-6">My Grades</h1>
        <div class="card">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="table-header p-3">Assignment</th>
                <th class="table-header p-3">Subject</th>
                <th class="table-header p-3">Grade</th>
                <th class="table-header p-3">Feedback</th>
              </tr>
            </thead>
            <tbody>
              @for (sub of grades(); track sub._id) {
                <tr class="border-b hover:bg-gray-50">
                  <td class="p-3 font-medium">{{ sub.assignmentId?.title }}</td>
                  <td class="p-3">{{ sub.assignmentId?.subject?.name }}</td>
                  <td class="p-3">
                    <span class="text-lg font-bold"
                      [class]="sub.grade >= 50 ? 'text-green-600' : 'text-red-600'">
                      {{ sub.grade }}/{{ sub.assignmentId?.totalMarks }}
                    </span>
                  </td>
                  <td class="p-3 text-gray-600">{{ sub.feedback || '—' }}</td>
                </tr>
              }
            </tbody>
          </table>
          @if (grades().length === 0) {
            <p class="text-center text-gray-500 py-8">No graded assignments yet.</p>
          }
        </div>
      </main>
    </div>
  `,
})
export class StudentGradesComponent implements OnInit {
  grades = signal<any[]>([]);
  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.api.getMyGrades().subscribe({
      next: (data) => this.grades.set(data),
    });
  }
}
```

I'll add the remaining components and deployment section now:

### Manage Students (Admin)
**src/app/features/admin/manage-students/manage-students.component.ts:**
```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="flex min-h-screen">
      <app-sidebar />
      <main class="flex-1 p-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Manage Students</h1>
          <button (click)="showForm.set(!showForm())" class="btn-primary">
            {{ showForm() ? 'Cancel' : '+ Add Student' }}
          </button>
        </div>

        <!-- Create Form -->
        @if (showForm()) {
          <div class="card mb-6">
            <h2 class="text-lg font-semibold mb-4">Create Student</h2>
            <form (ngSubmit)="createStudent()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="label">Name</label>
                <input [(ngModel)]="form.name" name="name" class="input-field" required />
              </div>
              <div>
                <label class="label">Email</label>
                <input [(ngModel)]="form.email" name="email" type="email" class="input-field" required />
              </div>
              <div>
                <label class="label">Password</label>
                <input [(ngModel)]="form.password" name="password" type="password" class="input-field" required />
              </div>
              <div>
                <label class="label">Department</label>
                <input [(ngModel)]="form.department" name="department" class="input-field" required />
              </div>
              <div>
                <label class="label">Course</label>
                <select [(ngModel)]="form.courseId" name="courseId" class="input-field">
                  <option value="">Select Course</option>
                  @for (course of courses(); track course._id) {
                    <option [value]="course._id">{{ course.name }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="label">Semester</label>
                <input [(ngModel)]="form.semester" name="semester" type="number" min="1" max="8" class="input-field" />
              </div>
              <div class="md:col-span-2">
                <button type="submit" class="btn-primary">Create Student</button>
              </div>
            </form>
            @if (message()) {
              <p class="mt-3 text-sm text-green-600">{{ message() }}</p>
            }
          </div>
        }

        <!-- Students Table -->
        <div class="card">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="table-header p-3">Name</th>
                <th class="table-header p-3">Email</th>
                <th class="table-header p-3">Status</th>
                <th class="table-header p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of students(); track user._id) {
                <tr class="border-b hover:bg-gray-50">
                  <td class="p-3">{{ user.name }}</td>
                  <td class="p-3">{{ user.email }}</td>
                  <td class="p-3">
                    <span class="px-2 py-1 rounded-full text-xs"
                      [class]="user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="p-3">
                    <button (click)="deleteUser(user._id)" class="text-red-600 hover:text-red-800 text-sm">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `,
})
export class ManageStudentsComponent implements OnInit {
  students = signal<any[]>([]);
  courses = signal<any[]>([]);
  showForm = signal(false);
  message = signal('');
  form = { name: '', email: '', password: '', department: '', courseId: '', semester: 1 };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadStudents();
    this.api.getCourses().subscribe({ next: (c) => this.courses.set(c) });
  }

  loadStudents(): void {
    this.api.getUsers('student').subscribe({ next: (res) => this.students.set(res.users) });
  }

  createStudent(): void {
    this.api.createStudent(this.form).subscribe({
      next: () => {
        this.message.set('Student created!');
        this.loadStudents();
        this.form = { name: '', email: '', password: '', department: '', courseId: '', semester: 1 };
      },
      error: (err) => this.message.set(err.error?.error || 'Error'),
    });
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure?')) {
      this.api.deleteUser(id).subscribe({ next: () => this.loadStudents() });
    }
  }
}
```

---

## 3.12 Running the Frontend

```bash
cd college-management-frontend
ng serve
```

Open `http://localhost:4200`. The Angular dev server will proxy API calls to port 5000.

---

# PART 4: HOW TO RUN THE COMPLETE SYSTEM

## Step-by-Step:

1. **Start MongoDB Atlas** — already running in the cloud

2. **Start Backend:**
   ```bash
   cd college-management-backend
   npm run dev
   # ✅ Server running on port 5000
   # ✅ MongoDB Connected
   ```

3. **Seed test data:**
   ```bash
   node src/seed.js
   ```

4. **Start Frontend:**
   ```bash
   cd college-management-frontend
   ng serve
   # Open http://localhost:4200
   ```

5. **Login with test accounts:**
   - Admin: `admin@college.com` / `admin123`
   - Teacher: `sarah@college.com` / `teacher123`
   - Student: `alice@college.com` / `student123`

---

# PART 5: SECURITY BEST PRACTICES

1. **Never store JWT_SECRET in code** — use `.env` files
2. **Helmet.js** — sets secure HTTP headers automatically
3. **Rate limiting** — prevents brute-force attacks on login
4. **Password hashing** — bcrypt with 12 salt rounds
5. **Input validation** — Mongoose validators + express-validator
6. **CORS** — restrict to your frontend domain only
7. **File upload validation** — check MIME types, limit file size
8. **Passwords excluded from queries** — `select: false` on password field
9. **Role checks on server** — never trust the client; always verify role in middleware
10. **Use HTTPS in production** — encrypt all traffic

---

# PART 6: DEPLOYMENT SUGGESTIONS

## Backend:
- **Railway** or **Render** — free tier Node.js hosting
- **DigitalOcean App Platform** — affordable production hosting
- Set all `.env` variables in the hosting platform's dashboard

## Frontend:
- **Vercel** or **Netlify** — free Angular hosting
- Build: `ng build --configuration production`
- Deploy the `dist/` folder

## Database:
- **MongoDB Atlas** (already cloud-hosted)
- Upgrade to M10+ cluster for production traffic

## File Storage (Production):
- Replace Multer local storage with **AWS S3** or **Cloudinary**

---

# SUMMARY

This guide covers:
- ✅ MongoDB Atlas setup + Compass
- ✅ Full Express.js backend with 9 Mongoose models
- ✅ JWT authentication + role-based middleware
- ✅ File upload with Multer (PDF submissions)
- ✅ Real-time notifications with Socket.io
- ✅ Angular 17+ frontend with Tailwind CSS
- ✅ Angular Signals for state management
- ✅ Dashboard charts with ng2-charts
- ✅ Attendance percentage calculation
- ✅ Seed script with test data
- ✅ Security best practices
- ✅ Deployment guidance

**Remaining components to create** (follow the same patterns above):
- `ManageTeachersComponent` — similar to ManageStudents
- `ManageCoursesComponent` — CRUD for courses
- `ManageSubjectsComponent` — CRUD for subjects  
- `TeacherDashboardComponent` — teacher's overview
- `TeacherAssignmentsComponent` — create assignments with file upload
- `GradeSubmissionsComponent` — view & grade student submissions
- `StudentDashboardComponent` — student overview with stats
- `StudentProfileComponent` — view profile info
- `NotificationBellComponent` — real-time notification dropdown
- `NavbarComponent` — top navigation bar
- `LoadingSpinnerComponent` — reusable loading indicator

Each follows the exact same pattern: inject `ApiService`, use signals for state, Tailwind classes for styling.
