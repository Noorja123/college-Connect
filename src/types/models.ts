export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student {
  id: string;
  userId: string;
  studentId: string;
  department: string;
  course: string;
  semester: number;
  name: string;
  email: string;
}

export interface Teacher {
  id: string;
  userId: string;
  teacherId: string;
  department: string;
  subjects: string[];
  name: string;
  email: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  totalMarks: number;
  teacherName: string;
  isActive: boolean;
  createdAt: string;
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  assignmentId: string;
  assignmentTitle: string;
  submittedAt: string;
  grade: number | null;
  feedback: string;
  status: 'submitted' | 'graded' | 'late';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
  duration: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  courseName: string;
  semester: number;
  credits: number;
}
