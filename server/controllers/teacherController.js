import Teacher from '../models/Teacher.js';

export const createTeacher = async (req, res, next) => {
  try {
    const { userId, department, subjects } = req.body;
    if (!userId || !department) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const teacher = new Teacher({ userId, department, subjects });
    const saved = await teacher.save();
    
    const populated = await saved.populate(['userId', 'subjects']);
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

export const getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find({ isDeleted: false })
      .populate('userId', 'name email role')
      .populate('subjects');
    res.status(200).json(teachers);
  } catch (err) {
    next(err);
  }
};

export const getTeacherById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ _id: req.params.id, isDeleted: false })
      .populate('userId', 'name email role')
      .populate('subjects');
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json(teacher);
  } catch (err) {
    next(err);
  }
};

export const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email role').populate('subjects');
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json(teacher);
  } catch (err) {
    next(err);
  }
};

export const deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json({ message: "Teacher soft-deleted", id: teacher._id });
  } catch (err) {
    next(err);
  }
};
