import Subject from '../models/Subject.js';

export const createSubject = async (req, res, next) => {
  try {
    const { name, courseId, teacherId } = req.body;
    if (!name || !courseId || !teacherId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const subject = new Subject({ name, courseId, teacherId });
    const saved = await subject.save();
    
    const populated = await saved.populate(['courseId', 'teacherId']);
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

export const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ isDeleted: false })
      .populate('courseId', 'name duration department')
      .populate('teacherId', 'userId department');
    res.status(200).json(subjects);
  } catch (err) {
    next(err);
  }
};

export const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, isDeleted: false })
      .populate('courseId')
      .populate('teacherId');
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.status(200).json(subject);
  } catch (err) {
    next(err);
  }
};

export const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate('courseId').populate('teacherId');
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.status(200).json(subject);
  } catch (err) {
    next(err);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.status(200).json({ message: "Subject soft-deleted", id: subject._id });
  } catch (err) {
    next(err);
  }
};
