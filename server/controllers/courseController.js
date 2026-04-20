import Course from '../models/Course.js';

export const createCourse = async (req, res, next) => {
  try {
    const { name, duration, department } = req.body;
    if (!name || !duration || !department) {
      return res.status(400).json({ message: "Missing required fields: name, duration, department" });
    }
    const course = new Course({ name, duration, department });
    const saved = await course.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ isDeleted: false });
    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, isDeleted: false });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Course successfully soft-deleted", id: course._id });
  } catch (err) {
    next(err);
  }
};
