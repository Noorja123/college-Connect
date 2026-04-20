import Teacher from '../models/Teacher.js';
import User from '../models/User.js';

export const createTeacher = async (req, res, next) => {
  try {
    const { userId, department, subjects } = req.body;
    if (!userId || !department) return res.status(400).json({ success: false, message: "Missing required fields", data: null });
    
    // Strict Role Enforcement
    const user = await User.findById(userId);
    if (!user || user.role !== 'teacher') return res.status(400).json({ success: false, message: "Linked user must be a teacher", data: null });
    
    const teacher = new Teacher({ userId, department, subjects, createdBy: req.user && req.user._id ? req.user._id : undefined });
    const saved = await teacher.save();
    const populated = await saved.populate(['userId', 'subjects']);
    res.status(201).json({ success: true, message: "Teacher created successfully", data: populated });
  } catch (err) { next(err); }
};

export const getTeachers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const teachers = await Teacher.find({ isDeleted: false })
      .populate('userId', 'name email role')
      .populate('subjects')
      .skip(skip).limit(limit);
    res.status(200).json({ success: true, message: "Teachers fetched", data: teachers });
  } catch (err) { next(err); }
};

export const getTeacherById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ _id: req.params.id, isDeleted: false }).populate('userId').populate('subjects');
    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found", data: null });
    res.status(200).json({ success: true, message: "Teacher fetched", data: teacher });
  } catch (err) { next(err); }
};

export const updateTeacher = async (req, res, next) => {
  try {
    const payload = { ...req.body, updatedBy: req.user && req.user._id ? req.user._id : undefined };
    const teacher = await Teacher.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, payload, { new: true, runValidators: true }).populate('userId').populate('subjects');
    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found", data: null });
    res.status(200).json({ success: true, message: "Teacher updated", data: teacher });
  } catch (err) { next(err); }
};

export const deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true, updatedBy: req.user && req.user._id ? req.user._id : undefined }, { new: true });
    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found", data: null });
    res.status(200).json({ success: true, message: "Teacher soft-deleted", data: null });
  } catch (err) { next(err); }
};
