import Assignment from '../models/Assignment.js';

export const createAssignment = async (req, res, next) => {
  try {
    const { title, subjectId, teacherId, dueDate } = req.body;
    if (!title || !subjectId || !teacherId || !dueDate) return res.status(400).json({ success: false, message: "Missing required fields", data: null });
    const assignment = new Assignment({ title, subjectId, teacherId, dueDate });
    const saved = await assignment.save();
    const populated = await saved.populate(['subjectId', 'teacherId']);
    res.status(201).json({ success: true, message: "Assignment created", data: populated });
  } catch (err) { next(err); }
};

export const getAssignments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const assignments = await Assignment.find({ isDeleted: false })
      .populate('subjectId', 'name courseId')
      .populate('teacherId', 'userId department')
      .skip(skip).limit(limit);
    res.status(200).json({ success: true, message: "Assignments fetched", data: assignments });
  } catch (err) { next(err); }
};

export const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, isDeleted: false })
      .populate('subjectId')
      .populate('teacherId');
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found", data: null });
    res.status(200).json({ success: true, message: "Assignment fetched", data: assignment });
  } catch (err) { next(err); }
};

export const updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true }).populate('subjectId').populate('teacherId');
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found", data: null });
    res.status(200).json({ success: true, message: "Assignment updated", data: assignment });
  } catch (err) { next(err); }
};

export const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found", data: null });
    res.status(200).json({ success: true, message: "Assignment soft-deleted", data: null });
  } catch (err) { next(err); }
};
