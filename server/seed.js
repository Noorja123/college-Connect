import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Student from './models/Student.js';
import Teacher from './models/Teacher.js';
import Course from './models/Course.js';
import Subject from './models/Subject.js';
import Assignment from './models/Assignment.js';
import Submission from './models/Submission.js';
import AttendanceRecord from './models/AttendanceRecord.js';

dotenv.config();

const users = [
  { _id: new mongoose.Types.ObjectId('65f1a3b9e4a55b6c7d8e9f01'), name: 'Dr. Rajesh Kumar', email: 'admin@college.com', role: 'admin', password: 'admin123' },
  { _id: new mongoose.Types.ObjectId('65f1a3b9e4a55b6c7d8e9f02'), name: 'Dr. Sarah Johnson', email: 'sarah@college.com', role: 'teacher', password: 'teacher123' },
  { _id: new mongoose.Types.ObjectId('65f1a3b9e4a55b6c7d8e9f03'), name: 'Prof. James Wilson', email: 'james@college.com', role: 'teacher', password: 'teacher123' },
  { _id: new mongoose.Types.ObjectId('65f1a3b9e4a55b6c7d8e9f04'), name: 'Alice Smith', email: 'alice@college.com', role: 'student', password: 'student123' },
  { _id: new mongoose.Types.ObjectId('65f1a3b9e4a55b6c7d8e9f05'), name: 'Bob Brown', email: 'bob@college.com', role: 'student', password: 'student123' },
  { _id: new mongoose.Types.ObjectId('65f1a3b9e4a55b6c7d8e9f06'), name: 'Charlie Davis', email: 'charlie@college.com', role: 'student', password: 'student123' },
  { _id: new mongoose.Types.ObjectId('65f1a3b9e4a55b6c7d8e9f07'), name: 'Diana Evans', email: 'diana@college.com', role: 'student', password: 'student123' },
  { _id: new mongoose.Types.ObjectId('65f1a3b9e4a55b6c7d8e9f08'), name: 'Ethan Foster', email: 'ethan@college.com', role: 'student', password: 'student123' },
];

const students = [
  { userId: '65f1a3b9e4a55b6c7d8e9f04', studentId: 'STU-2024-001', department: 'Engineering', course: 'Computer Science', semester: 3, name: 'Alice Smith', email: 'alice@college.com' },
  { userId: '65f1a3b9e4a55b6c7d8e9f05', studentId: 'STU-2024-002', department: 'Engineering', course: 'Computer Science', semester: 3, name: 'Bob Brown', email: 'bob@college.com' },
  { userId: '65f1a3b9e4a55b6c7d8e9f06', studentId: 'STU-2024-003', department: 'Engineering', course: 'Computer Science', semester: 4, name: 'Charlie Davis', email: 'charlie@college.com' },
  { userId: '65f1a3b9e4a55b6c7d8e9f07', studentId: 'STU-2024-004', department: 'Engineering', course: 'Electrical Engineering', semester: 3, name: 'Diana Evans', email: 'diana@college.com' },
  { userId: '65f1a3b9e4a55b6c7d8e9f08', studentId: 'STU-2024-005', department: 'Management', course: 'Business Administration', semester: 2, name: 'Ethan Foster', email: 'ethan@college.com' },
];

const teachers = [
  { userId: '65f1a3b9e4a55b6c7d8e9f02', teacherId: 'TCH-2024-001', department: 'Engineering', subjects: ['Data Structures', 'Algorithms'], name: 'Dr. Sarah Johnson', email: 'sarah@college.com' },
  { userId: '65f1a3b9e4a55b6c7d8e9f03', teacherId: 'TCH-2024-002', department: 'Engineering', subjects: ['Database Systems', 'Circuit Theory'], name: 'Prof. James Wilson', email: 'james@college.com' },
];

const courses = [
  { name: 'Computer Science', code: 'CS-101', department: 'Engineering', duration: 8 },
  { name: 'Electrical Engineering', code: 'EE-101', department: 'Engineering', duration: 8 },
  { name: 'Business Administration', code: 'BA-101', department: 'Management', duration: 6 },
];

const subjects = [
  { name: 'Data Structures', code: 'CS-201', courseName: 'Computer Science', semester: 3, credits: 4 },
  { name: 'Algorithms', code: 'CS-202', courseName: 'Computer Science', semester: 3, credits: 4 },
  { name: 'Database Systems', code: 'CS-301', courseName: 'Computer Science', semester: 4, credits: 3 },
  { name: 'Circuit Theory', code: 'EE-201', courseName: 'Electrical Engineering', semester: 3, credits: 4 },
  { name: 'Marketing', code: 'BA-201', courseName: 'Business Administration', semester: 2, credits: 3 },
];

const assignments = [
  { _id: new mongoose.Types.ObjectId('65f1a3b9e4a55b6c7d8e9f11'), title: 'Binary Search Tree Implementation', description: 'Implement BST with insert, delete, and search operations', subject: 'Data Structures', dueDate: new Date('2026-03-25'), totalMarks: 100, teacherName: 'Dr. Sarah Johnson', isActive: true },
  { _id: new mongoose.Types.ObjectId('65f1a3b9e4a55b6c7d8e9f12'), title: 'Sorting Algorithms Comparison', description: 'Compare time complexity of merge sort, quick sort, and heap sort', subject: 'Algorithms', dueDate: new Date('2026-03-20'), totalMarks: 50, teacherName: 'Dr. Sarah Johnson', isActive: true },
  { _id: new mongoose.Types.ObjectId('65f1a3b9e4a55b6c7d8e9f13'), title: 'ER Diagram Design', description: 'Design ER diagram for an e-commerce system', subject: 'Database Systems', dueDate: new Date('2026-04-01'), totalMarks: 75, teacherName: 'Prof. James Wilson', isActive: true },
  { _id: new mongoose.Types.ObjectId('65f1a3b9e4a55b6c7d8e9f14'), title: 'Circuit Analysis Lab Report', description: 'Analyze RC and RL circuits and submit lab report', subject: 'Circuit Theory', dueDate: new Date('2026-03-18'), totalMarks: 40, teacherName: 'Prof. James Wilson', isActive: true },
];

const submissions = [
  { studentId: '65f1a3b9e4a55b6c7d8e9f04', studentName: 'Alice Smith', assignmentId: '65f1a3b9e4a55b6c7d8e9f11', assignmentTitle: 'Binary Search Tree Implementation', submittedAt: new Date('2026-03-15'), grade: 88, feedback: 'Excellent implementation!', status: 'graded' },
  { studentId: '65f1a3b9e4a55b6c7d8e9f05', studentName: 'Bob Brown', assignmentId: '65f1a3b9e4a55b6c7d8e9f11', assignmentTitle: 'Binary Search Tree Implementation', submittedAt: new Date('2026-03-16'), grade: null, feedback: '', status: 'submitted' },
  { studentId: '65f1a3b9e4a55b6c7d8e9f04', studentName: 'Alice Smith', assignmentId: '65f1a3b9e4a55b6c7d8e9f12', assignmentTitle: 'Sorting Algorithms Comparison', submittedAt: new Date('2026-03-19'), grade: 45, feedback: 'Good analysis, minor errors in complexity calculation.', status: 'graded' },
  { studentId: '65f1a3b9e4a55b6c7d8e9f06', studentName: 'Charlie Davis', assignmentId: '65f1a3b9e4a55b6c7d8e9f13', assignmentTitle: 'ER Diagram Design', submittedAt: new Date('2026-03-26'), grade: null, feedback: '', status: 'late' },
];

const attendance = [
  { studentId: '65f1a3b9e4a55b6c7d8e9f04', studentName: 'Alice Smith', subject: 'Data Structures', date: new Date('2026-03-03'), status: 'present' },
  { studentId: '65f1a3b9e4a55b6c7d8e9f04', studentName: 'Alice Smith', subject: 'Data Structures', date: new Date('2026-03-05'), status: 'present' },
  { studentId: '65f1a3b9e4a55b6c7d8e9f04', studentName: 'Alice Smith', subject: 'Data Structures', date: new Date('2026-03-07'), status: 'absent' },
  { studentId: '65f1a3b9e4a55b6c7d8e9f04', studentName: 'Alice Smith', subject: 'Algorithms', date: new Date('2026-03-04'), status: 'present' },
];

async function seed() {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('<your_username>')) {
    console.error('❌ MONGODB_URI is not set properly. Cannot seed database.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    console.log('Clearing old data...');
    await User.deleteMany();
    await Student.deleteMany();
    await Teacher.deleteMany();
    await Course.deleteMany();
    await Subject.deleteMany();
    await Assignment.deleteMany();
    await Submission.deleteMany();
    await AttendanceRecord.deleteMany();

    // Insert new data
    console.log('Inserting mock data...');
    await User.insertMany(users);
    await Student.insertMany(students);
    await Teacher.insertMany(teachers);
    await Course.insertMany(courses);
    await Subject.insertMany(subjects);
    await Assignment.insertMany(assignments);
    await Submission.insertMany(submissions);
    await AttendanceRecord.insertMany(attendance);

    console.log('🎉 Database successfully seeded!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seed();
