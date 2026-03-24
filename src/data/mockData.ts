import type { User, Student, Teacher, Assignment, Submission, AttendanceRecord, Course, Subject } from '@/types/models';

export const MOCK_USERS: (User & { password: string })[] = [
  { id: '1', name: 'Dr. Rajesh Kumar', email: 'admin@college.com', role: 'admin', password: 'admin123' },
  { id: '2', name: 'Dr. Sarah Johnson', email: 'sarah@college.com', role: 'teacher', password: 'teacher123' },
  { id: '3', name: 'Prof. James Wilson', email: 'james@college.com', role: 'teacher', password: 'teacher123' },
  { id: '4', name: 'Alice Smith', email: 'alice@college.com', role: 'student', password: 'student123' },
  { id: '5', name: 'Bob Brown', email: 'bob@college.com', role: 'student', password: 'student123' },
  { id: '6', name: 'Charlie Davis', email: 'charlie@college.com', role: 'student', password: 'student123' },
  { id: '7', name: 'Diana Evans', email: 'diana@college.com', role: 'student', password: 'student123' },
  { id: '8', name: 'Ethan Foster', email: 'ethan@college.com', role: 'student', password: 'student123' },
];

export const MOCK_COURSES: Course[] = [
  { id: 'c1', name: 'Computer Science', code: 'CS-101', department: 'Engineering', duration: 8 },
  { id: 'c2', name: 'Electrical Engineering', code: 'EE-101', department: 'Engineering', duration: 8 },
  { id: 'c3', name: 'Business Administration', code: 'BA-101', department: 'Management', duration: 6 },
];

export const MOCK_SUBJECTS: Subject[] = [
  { id: 's1', name: 'Data Structures', code: 'CS-201', courseName: 'Computer Science', semester: 3, credits: 4 },
  { id: 's2', name: 'Algorithms', code: 'CS-202', courseName: 'Computer Science', semester: 3, credits: 4 },
  { id: 's3', name: 'Database Systems', code: 'CS-301', courseName: 'Computer Science', semester: 4, credits: 3 },
  { id: 's4', name: 'Circuit Theory', code: 'EE-201', courseName: 'Electrical Engineering', semester: 3, credits: 4 },
  { id: 's5', name: 'Marketing', code: 'BA-201', courseName: 'Business Administration', semester: 2, credits: 3 },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 'st1', userId: '4', studentId: 'STU-2024-001', department: 'Engineering', course: 'Computer Science', semester: 3, name: 'Alice Smith', email: 'alice@college.com' },
  { id: 'st2', userId: '5', studentId: 'STU-2024-002', department: 'Engineering', course: 'Computer Science', semester: 3, name: 'Bob Brown', email: 'bob@college.com' },
  { id: 'st3', userId: '6', studentId: 'STU-2024-003', department: 'Engineering', course: 'Computer Science', semester: 4, name: 'Charlie Davis', email: 'charlie@college.com' },
  { id: 'st4', userId: '7', studentId: 'STU-2024-004', department: 'Engineering', course: 'Electrical Engineering', semester: 3, name: 'Diana Evans', email: 'diana@college.com' },
  { id: 'st5', userId: '8', studentId: 'STU-2024-005', department: 'Management', course: 'Business Administration', semester: 2, name: 'Ethan Foster', email: 'ethan@college.com' },
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: 't1', userId: '2', teacherId: 'TCH-2024-001', department: 'Engineering', subjects: ['Data Structures', 'Algorithms'], name: 'Dr. Sarah Johnson', email: 'sarah@college.com' },
  { id: 't2', userId: '3', teacherId: 'TCH-2024-002', department: 'Engineering', subjects: ['Database Systems', 'Circuit Theory'], name: 'Prof. James Wilson', email: 'james@college.com' },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', title: 'Binary Search Tree Implementation', description: 'Implement BST with insert, delete, and search operations', subject: 'Data Structures', dueDate: '2026-03-25', totalMarks: 100, teacherName: 'Dr. Sarah Johnson', isActive: true, createdAt: '2026-03-01' },
  { id: 'a2', title: 'Sorting Algorithms Comparison', description: 'Compare time complexity of merge sort, quick sort, and heap sort', subject: 'Algorithms', dueDate: '2026-03-20', totalMarks: 50, teacherName: 'Dr. Sarah Johnson', isActive: true, createdAt: '2026-03-05' },
  { id: 'a3', title: 'ER Diagram Design', description: 'Design ER diagram for an e-commerce system', subject: 'Database Systems', dueDate: '2026-04-01', totalMarks: 75, teacherName: 'Prof. James Wilson', isActive: true, createdAt: '2026-03-08' },
  { id: 'a4', title: 'Circuit Analysis Lab Report', description: 'Analyze RC and RL circuits and submit lab report', subject: 'Circuit Theory', dueDate: '2026-03-18', totalMarks: 40, teacherName: 'Prof. James Wilson', isActive: true, createdAt: '2026-03-02' },
];

export const MOCK_SUBMISSIONS: Submission[] = [
  { id: 'sub1', studentId: 'st1', studentName: 'Alice Smith', assignmentId: 'a1', assignmentTitle: 'Binary Search Tree Implementation', submittedAt: '2026-03-15', grade: 88, feedback: 'Excellent implementation!', status: 'graded' },
  { id: 'sub2', studentId: 'st2', studentName: 'Bob Brown', assignmentId: 'a1', assignmentTitle: 'Binary Search Tree Implementation', submittedAt: '2026-03-16', grade: null, feedback: '', status: 'submitted' },
  { id: 'sub3', studentId: 'st1', studentName: 'Alice Smith', assignmentId: 'a2', assignmentTitle: 'Sorting Algorithms Comparison', submittedAt: '2026-03-19', grade: 45, feedback: 'Good analysis, minor errors in complexity calculation.', status: 'graded' },
  { id: 'sub4', studentId: 'st3', studentName: 'Charlie Davis', assignmentId: 'a3', assignmentTitle: 'ER Diagram Design', submittedAt: '2026-03-26', grade: null, feedback: '', status: 'late' },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  // Alice - Data Structures
  { id: 'att1', studentId: 'st1', studentName: 'Alice Smith', subject: 'Data Structures', date: '2026-03-03', status: 'present' },
  { id: 'att2', studentId: 'st1', studentName: 'Alice Smith', subject: 'Data Structures', date: '2026-03-05', status: 'present' },
  { id: 'att3', studentId: 'st1', studentName: 'Alice Smith', subject: 'Data Structures', date: '2026-03-07', status: 'absent' },
  { id: 'att4', studentId: 'st1', studentName: 'Alice Smith', subject: 'Data Structures', date: '2026-03-10', status: 'present' },
  { id: 'att5', studentId: 'st1', studentName: 'Alice Smith', subject: 'Algorithms', date: '2026-03-04', status: 'present' },
  { id: 'att6', studentId: 'st1', studentName: 'Alice Smith', subject: 'Algorithms', date: '2026-03-06', status: 'late' },
  { id: 'att7', studentId: 'st1', studentName: 'Alice Smith', subject: 'Algorithms', date: '2026-03-08', status: 'present' },
  // Bob
  { id: 'att8', studentId: 'st2', studentName: 'Bob Brown', subject: 'Data Structures', date: '2026-03-03', status: 'present' },
  { id: 'att9', studentId: 'st2', studentName: 'Bob Brown', subject: 'Data Structures', date: '2026-03-05', status: 'absent' },
  { id: 'att10', studentId: 'st2', studentName: 'Bob Brown', subject: 'Data Structures', date: '2026-03-07', status: 'absent' },
  { id: 'att11', studentId: 'st2', studentName: 'Bob Brown', subject: 'Algorithms', date: '2026-03-04', status: 'present' },
  { id: 'att12', studentId: 'st2', studentName: 'Bob Brown', subject: 'Algorithms', date: '2026-03-06', status: 'present' },
  // Charlie
  { id: 'att13', studentId: 'st3', studentName: 'Charlie Davis', subject: 'Database Systems', date: '2026-03-03', status: 'present' },
  { id: 'att14', studentId: 'st3', studentName: 'Charlie Davis', subject: 'Database Systems', date: '2026-03-05', status: 'present' },
  { id: 'att15', studentId: 'st3', studentName: 'Charlie Davis', subject: 'Database Systems', date: '2026-03-07', status: 'late' },
  // Diana
  { id: 'att16', studentId: 'st4', studentName: 'Diana Evans', subject: 'Circuit Theory', date: '2026-03-03', status: 'present' },
  { id: 'att17', studentId: 'st4', studentName: 'Diana Evans', subject: 'Circuit Theory', date: '2026-03-05', status: 'present' },
  { id: 'att18', studentId: 'st4', studentName: 'Diana Evans', subject: 'Circuit Theory', date: '2026-03-07', status: 'present' },
];
