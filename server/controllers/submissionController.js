import Submission from '../models/Submission.js';

export const createSubmission = async (req, res, next) => {
  try {
    const { assignmentId, studentId, fileUrl } = req.body;
    if (!assignmentId || !studentId || !fileUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const submission = new Submission({ assignmentId, studentId, fileUrl });
    const saved = await submission.save();
    
    const populated = await saved.populate(['assignmentId', 'studentId']);
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

export const getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ isDeleted: false })
      .populate('assignmentId', 'title dueDate')
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' }});
    res.status(200).json(submissions);
  } catch (err) {
    next(err);
  }
};

export const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findOne({ _id: req.params.id, isDeleted: false })
      .populate('assignmentId')
      .populate('studentId');
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.status(200).json(submission);
  } catch (err) {
    next(err);
  }
};

export const updateSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate('assignmentId').populate('studentId');
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.status(200).json(submission);
  } catch (err) {
    next(err);
  }
};

export const deleteSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.status(200).json({ message: "Submission soft-deleted", id: submission._id });
  } catch (err) {
    next(err);
  }
};
