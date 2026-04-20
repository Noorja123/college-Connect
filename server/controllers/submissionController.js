import Submission from '../models/Submission.js';

export const createSubmission = async (req, res, next) => {
  try {
    const { assignmentId, studentId, file, status, marks, feedback } = req.body;
    if (!assignmentId || !studentId || !file || !file.url) return res.status(400).json({ success: false, message: "Missing required fields (file.url)", data: null });
    const submission = new Submission({ assignmentId, studentId, file, status, marks, feedback, createdBy: req.user && req.user._id ? req.user._id : undefined });
    const saved = await submission.save();
    const populated = await saved.populate(['assignmentId', 'studentId']);
    res.status(201).json({ success: true, message: "Submission created", data: populated });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: "You have already submitted this assignment", data: null });
    next(err);
  }
};

export const getSubmissions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const submissions = await Submission.find({ isDeleted: false })
      .populate('assignmentId', 'title dueDate')
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
      .skip(skip).limit(limit);
    res.status(200).json({ success: true, message: "Submissions fetched", data: submissions });
  } catch (err) { next(err); }
};

export const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findOne({ _id: req.params.id, isDeleted: false }).populate('assignmentId').populate('studentId');
    if (!submission) return res.status(404).json({ success: false, message: "Submission not found", data: null });
    res.status(200).json({ success: true, message: "Submission fetched", data: submission });
  } catch (err) { next(err); }
};

export const updateSubmission = async (req, res, next) => {
  try {
    const payload = { ...req.body, updatedBy: req.user && req.user._id ? req.user._id : undefined };
    const submission = await Submission.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, payload, { new: true, runValidators: true }).populate('assignmentId').populate('studentId');
    if (!submission) return res.status(404).json({ success: false, message: "Submission not found", data: null });
    res.status(200).json({ success: true, message: "Submission updated", data: submission });
  } catch (err) { next(err); }
};

export const deleteSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true, updatedBy: req.user && req.user._id ? req.user._id : undefined }, { new: true });
    if (!submission) return res.status(404).json({ success: false, message: "Submission not found", data: null });
    res.status(200).json({ success: true, message: "Submission soft-deleted", data: null });
  } catch (err) { next(err); }
};
