import express from 'express';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Course from '../models/Course.js';
import Subject from '../models/Subject.js';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import AttendanceRecord from '../models/AttendanceRecord.js';

const router = express.Router();

const models = {
  users: User,
  students: Student,
  teachers: Teacher,
  courses: Course,
  subjects: Subject,
  assignments: Assignment,
  submissions: Submission,
  attendance: AttendanceRecord
};

Object.entries(models).forEach(([name, Model]) => {
  // GET all
  router.get(`/${name}`, async (req, res) => {
    try {
      const data = await Model.find();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET by id
  router.get(`/${name}/:id`, async (req, res) => {
    try {
      const data = await Model.findById(req.params.id);
      if (!data) return res.status(404).json({ error: 'Not found' });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST create
  router.post(`/${name}`, async (req, res) => {
    try {
      const data = new Model(req.body);
      const saved = await data.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // PUT update
  router.put(`/${name}/:id`, async (req, res) => {
    try {
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // DELETE
  router.delete(`/${name}/:id`, async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.json({ success: true, id: req.params.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

export default router;
