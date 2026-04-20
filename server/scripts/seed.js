import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Subject from '../models/Subject.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected for seeding...');

    // Create Admin
    const adminUser = new User({ name: 'System Admin', email: 'admin@college.edu', password: 'password123', role: 'admin' });
    await adminUser.save();

    // Create Teacher User
    const teacherUser = new User({ name: 'Dr. Jane Smith', email: 'smith@college.edu', password: 'password123', role: 'teacher' });
    await teacherUser.save();

    // Create Base Course
    const course = new Course({ name: 'Bachelor of Computer Science', duration: '4 Years', department: 'Computer Science' });
    await course.save();

    // Create Teacher Profile
    const teacherProfile = new Teacher({ userId: teacherUser._id, department: 'Computer Science', subjects: [] });
    await teacherProfile.save();
    
    // Create Subject
    const subject = new Subject({ name: 'Intro to Algorithms', courseId: course._id, teacherId: teacherProfile._id });
    await subject.save();
    
    // Push subject reference into teacher model
    teacherProfile.subjects.push(subject._id);
    await teacherProfile.save();

    // Create Student Users
    const s1User = new User({ name: 'John Doe', email: 'john@student.edu', password: 'password123', role: 'student' });
    const s2User = new User({ name: 'Alice Walker', email: 'alice@student.edu', password: 'password123', role: 'student' });
    await s1User.save();
    await s2User.save();

    // Create Student Profiles
    const student1 = new Student({ userId: s1User._id, rollNumber: 'CS1001', courseId: course._id, semester: 1, division: 'A' });
    const student2 = new Student({ userId: s2User._id, rollNumber: 'CS1002', courseId: course._id, semester: 1, division: 'B' });
    await student1.save();
    await student2.save();

    console.log('✅ Seeding Complete! Simulated an Admin, Teacher, Course, and 2 Students.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
