import Assignment from '../models/Assignment.js';

export const createAssignment = async (req, res, next) => {
  try {
    const { title, subjectId, teacherId, dueDate } = req.body;
    if (!title || !subjectId || !teacherId || !dueDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const assignment = new Assignment({ title, subjectId, teacherId, dueDate });
    const saved = await assignment.save();
    
    const populated = await saved.populate(['subjectId', 'teacherId']);
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

export const getAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ isDeleted: false })
      .populate('subjectId', 'name courseId')
      .populate('teacherId', 'userId department');
    res.status(200).json(assignments);
  } catch (err) {
    next(err);
  }
};

export const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, isDeleted: false })
      .populate('subjectId')
      .populate('teacherId');
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.status(200).json(assignment);
  } catch (err) {
    next(err);
  }
};

export const updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate('subjectId').populate('teacherId');
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.status(200).json(assignment);
  } catch (err) {
    next(err);
  }
};

export const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.status(200).json({ message: "Assignment soft-deleted", id: assignment._id });
  } catch (err) {
    next(err);
  }
};
