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
      // Pagination & optional filtering support
      const { page = 1, limit = 0 } = req.query; // default to 0 (no limit) to avoid breaking existing clients that assume all data
      
      let query = Model.find(req.query.filter ? JSON.parse(req.query.filter) : {});
      
      if (limit > 0) {
        query = query.skip((page - 1) * limit).limit(parseInt(limit));
      }
      
      const data = await query;
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
    // Backend Validation
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Missing required valid data fields" });
    }
    
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
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "No data provided for update" });
    }

    try {
      const updated = await Model.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Not found' });
      }

      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // DELETE
  router.delete(`/${name}/:id`, async (req, res) => {
    try {
      const deleted = await Model.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Not found' });
      }

      res.json({ success: true, id: req.params.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

export default router;
