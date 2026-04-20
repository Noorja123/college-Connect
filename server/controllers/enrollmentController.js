import Enrollment from '../models/Enrollment.js';

export const createEnrollment = async (req, res, next) => {
  try {
    const { studentId, subjectId } = req.body;
    if (!studentId || !subjectId) return res.status(400).json({ success: false, message: "Missing required fields", data: null });
    const enrollment = new Enrollment({ studentId, subjectId, createdBy: req.user && req.user._id ? req.user._id : undefined });
    const saved = await enrollment.save();
    const populated = await saved.populate(['studentId', 'subjectId']);
    res.status(201).json({ success: true, message: "Enrollment created", data: populated });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: "Enrollment already exists", data: null });
    next(err);
  }
};

export const getEnrollments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const enrollments = await Enrollment.find({ isDeleted: false })
      .populate('studentId')
      .populate('subjectId')
      .skip(skip).limit(limit);
    res.status(200).json({ success: true, message: "Enrollments fetched", data: enrollments });
  } catch (err) { next(err); }
};

export const getEnrollmentById = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({ _id: req.params.id, isDeleted: false }).populate('studentId').populate('subjectId');
    if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment not found", data: null });
    res.status(200).json({ success: true, message: "Enrollment fetched", data: enrollment });
  } catch (err) { next(err); }
};

export const deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true, updatedBy: req.user && req.user._id ? req.user._id : undefined }, { new: true });
    if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment not found", data: null });
    res.status(200).json({ success: true, message: "Enrollment soft-deleted", data: null });
  } catch (err) { next(err); }
};
