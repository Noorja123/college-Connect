import express from 'express';

import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { createStudent, getStudents, getStudentById, updateStudent, deleteStudent } from '../controllers/studentController.js';
import { createTeacher, getTeachers, getTeacherById, updateTeacher, deleteTeacher } from '../controllers/teacherController.js';
import { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { createSubject, getSubjects, getSubjectById, updateSubject, deleteSubject } from '../controllers/subjectController.js';
import { createAssignment, getAssignments, getAssignmentById, updateAssignment, deleteAssignment } from '../controllers/assignmentController.js';
import { createSubmission, getSubmissions, getSubmissionById, updateSubmission, deleteSubmission } from '../controllers/submissionController.js';
import { createAttendance, getAttendanceRecords, getAttendanceById, updateAttendance, deleteAttendance } from '../controllers/attendanceController.js';
import { authUser } from '../controllers/authController.js';

const router = express.Router();

// Auth Routes
router.post('/auth/login', authUser);

// User Routes
router.route('/users').post(createUser).get(getUsers);
router.route('/users/:id').get(getUserById).put(updateUser).delete(deleteUser);

// Student Routes
router.route('/students').post(createStudent).get(getStudents);
router.route('/students/:id').get(getStudentById).put(updateStudent).delete(deleteStudent);

// Teacher Routes
router.route('/teachers').post(createTeacher).get(getTeachers);
router.route('/teachers/:id').get(getTeacherById).put(updateTeacher).delete(deleteTeacher);

// Course Routes
router.route('/courses').post(createCourse).get(getCourses);
router.route('/courses/:id').get(getCourseById).put(updateCourse).delete(deleteCourse);

// Subject Routes
router.route('/subjects').post(createSubject).get(getSubjects);
router.route('/subjects/:id').get(getSubjectById).put(updateSubject).delete(deleteSubject);

// Assignment Routes
router.route('/assignments').post(createAssignment).get(getAssignments);
router.route('/assignments/:id').get(getAssignmentById).put(updateAssignment).delete(deleteAssignment);

// Submission Routes
router.route('/submissions').post(createSubmission).get(getSubmissions);
router.route('/submissions/:id').get(getSubmissionById).put(updateSubmission).delete(deleteSubmission);

// Attendance Routes
router.route('/attendance').post(createAttendance).get(getAttendanceRecords);
router.route('/attendance/:id').get(getAttendanceById).put(updateAttendance).delete(deleteAttendance);

export default router;
