import Course from '../models/Course.js';

export const createCourse = async (req, res, next) => {
  try {
    const { name, duration, department } = req.body;
    if (!name || !duration || !department) return res.status(400).json({ success: false, message: "Missing required fields", data: null });
    const course = new Course({ name, duration, department });
    const saved = await course.save();
    res.status(201).json({ success: true, message: "Course created successfully", data: saved });
  } catch (err) { next(err); }
};

export const getCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const courses = await Course.find({ isDeleted: false }).skip(skip).limit(limit);
    res.status(200).json({ success: true, message: "Courses fetched successfully", data: courses });
  } catch (err) { next(err); }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, isDeleted: false });
    if (!course) return res.status(404).json({ success: false, message: "Course not found", data: null });
    res.status(200).json({ success: true, message: "Course fetched successfully", data: course });
  } catch (err) { next(err); }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found", data: null });
    res.status(200).json({ success: true, message: "Course updated successfully", data: course });
  } catch (err) { next(err); }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found", data: null });
    res.status(200).json({ success: true, message: "Course soft-deleted", data: null });
  } catch (err) { next(err); }
};
