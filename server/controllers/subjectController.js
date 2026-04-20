import Subject from '../models/Subject.js';
import Assignment from '../models/Assignment.js';
import Enrollment from '../models/Enrollment.js';

export const createSubject = async (req, res, next) => {
  try {
    const { name, courseId, teacherId } = req.body;
    if (!name || !courseId || !teacherId) return res.status(400).json({ success: false, message: "Missing required fields", data: null });
    const subject = new Subject({ name, courseId, teacherId, createdBy: req.user && req.user._id ? req.user._id : undefined });
    const saved = await subject.save();
    const populated = await saved.populate(['courseId', 'teacherId']);
    res.status(201).json({ success: true, message: "Subject created", data: populated });
  } catch (err) { next(err); }
};

export const getSubjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const subjects = await Subject.find({ isDeleted: false })
      .populate('courseId', 'name duration department')
      .populate('teacherId', 'userId department')
      .skip(skip).limit(limit);
    res.status(200).json({ success: true, message: "Subjects fetched", data: subjects });
  } catch (err) { next(err); }
};

export const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, isDeleted: false }).populate('courseId').populate('teacherId');
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found", data: null });
    res.status(200).json({ success: true, message: "Subject fetched", data: subject });
  } catch (err) { next(err); }
};

export const updateSubject = async (req, res, next) => {
  try {
    const payload = { ...req.body, updatedBy: req.user && req.user._id ? req.user._id : undefined };
    const subject = await Subject.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, payload, { new: true, runValidators: true }).populate('courseId').populate('teacherId');
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found", data: null });
    res.status(200).json({ success: true, message: "Subject updated", data: subject });
  } catch (err) { next(err); }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const updater = req.user && req.user._id ? req.user._id : undefined;
    const subject = await Subject.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true, updatedBy: updater }, { new: true });
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found", data: null });
    
    // Cascading soft-delete
    await Assignment.updateMany({ subjectId: subject._id }, { isDeleted: true, updatedBy: updater });
    await Enrollment.updateMany({ subjectId: subject._id }, { isDeleted: true, updatedBy: updater });
    
    res.status(200).json({ success: true, message: "Subject soft-deleted with cascade", data: null });
  } catch (err) { next(err); }
};
