import express from 'express';

import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { createStudent, getStudents, getStudentById, updateStudent, deleteStudent } from '../controllers/studentController.js';
import { createTeacher, getTeachers, getTeacherById, updateTeacher, deleteTeacher } from '../controllers/teacherController.js';
import { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { createSubject, getSubjects, getSubjectById, updateSubject, deleteSubject } from '../controllers/subjectController.js';
import { createEnrollment, getEnrollments, getEnrollmentById, deleteEnrollment } from '../controllers/enrollmentController.js';
import { createAssignment, getAssignments, getAssignmentById, updateAssignment, deleteAssignment } from '../controllers/assignmentController.js';
import { createSubmission, getSubmissions, getSubmissionById, updateSubmission, deleteSubmission } from '../controllers/submissionController.js';
import { createAttendance, getAttendanceRecords, getAttendanceById, updateAttendance, deleteAttendance } from '../controllers/attendanceController.js';
import { authUser } from '../controllers/authController.js';
import { protect, adminOnly, teacherOrAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Auth Routes (Public)
router.post('/auth/login', authUser);

// All subsequent routes require valid JWT Auth
router.use(protect);

// User Routes (Admin only)
router.route('/users').post(adminOnly, createUser).get(adminOnly, getUsers);
router.route('/users/:id').get(adminOnly, getUserById).put(adminOnly, updateUser).delete(adminOnly, deleteUser);

// Student Profiles
router.route('/students').post(teacherOrAdmin, createStudent).get(getStudents);
router.route('/students/:id').get(getStudentById).put(teacherOrAdmin, updateStudent).delete(adminOnly, deleteStudent);

// Teacher Profiles
router.route('/teachers').post(adminOnly, createTeacher).get(getTeachers);
router.route('/teachers/:id').get(getTeacherById).put(adminOnly, updateTeacher).delete(adminOnly, deleteTeacher);

// Courses
router.route('/courses').post(adminOnly, createCourse).get(getCourses);
router.route('/courses/:id').get(getCourseById).put(adminOnly, updateCourse).delete(adminOnly, deleteCourse);

// Subjects
router.route('/subjects').post(adminOnly, createSubject).get(getSubjects);
router.route('/subjects/:id').get(getSubjectById).put(adminOnly, updateSubject).delete(adminOnly, deleteSubject);

// Enrollments
router.route('/enrollments').post(adminOnly, createEnrollment).get(getEnrollments);
router.route('/enrollments/:id').get(getEnrollmentById).delete(adminOnly, deleteEnrollment);

// Assignments
router.route('/assignments').post(teacherOrAdmin, createAssignment).get(getAssignments);
router.route('/assignments/:id').get(getAssignmentById).put(teacherOrAdmin, updateAssignment).delete(teacherOrAdmin, deleteAssignment);

// Submissions (Students submit, Teachers grade)
router.route('/submissions').post(createSubmission).get(getSubmissions);
router.route('/submissions/:id').get(getSubmissionById).put(teacherOrAdmin, updateSubmission).delete(teacherOrAdmin, deleteSubmission);

// Attendance
router.route('/attendance').post(teacherOrAdmin, createAttendance).get(getAttendanceRecords);
router.route('/attendance/:id').get(getAttendanceById).put(teacherOrAdmin, updateAttendance).delete(teacherOrAdmin, deleteAttendance);

export default router;
