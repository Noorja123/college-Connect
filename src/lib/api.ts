import type { User, Student, Teacher, Course, Subject, Assignment, Submission, AttendanceRecord } from '../types/models';

const API_BASE_URL = 'http://localhost:5005/api';

export const api = {
  // Users
  getUsers: () => fetch(`${API_BASE_URL}/users`).then(res => res.json()) as Promise<User[]>,
  
  // Students
  getStudents: () => fetch(`${API_BASE_URL}/students`).then(res => res.json()) as Promise<Student[]>,
  getStudent: (id: string) => fetch(`${API_BASE_URL}/students/${id}`).then(res => res.json()) as Promise<Student>,
  
  // Teachers
  getTeachers: () => fetch(`${API_BASE_URL}/teachers`).then(res => res.json()) as Promise<Teacher[]>,
  
  // Courses
  getCourses: () => fetch(`${API_BASE_URL}/courses`).then(res => res.json()) as Promise<Course[]>,
  
  // Subjects
  getSubjects: () => fetch(`${API_BASE_URL}/subjects`).then(res => res.json()) as Promise<Subject[]>,
  
  // Assignments
  getAssignments: () => fetch(`${API_BASE_URL}/assignments`).then(res => res.json()) as Promise<Assignment[]>,
  
  // Submissions
  getSubmissions: () => fetch(`${API_BASE_URL}/submissions`).then(res => res.json()) as Promise<Submission[]>,
  
  // Attendance
  getAttendance: () => fetch(`${API_BASE_URL}/attendance`).then(res => res.json()) as Promise<AttendanceRecord[]>,
};
