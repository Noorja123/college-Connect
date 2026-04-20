import Student from '../models/Student.js';

export const createStudent = async (req, res, next) => {
  try {
    const { userId, rollNumber, courseId, semester, division } = req.body;
    if (!userId || !rollNumber || !courseId || !semester || !division) return res.status(400).json({ success: false, message: "Missing required fields", data: null });
    const student = new Student({ userId, rollNumber, courseId, semester, division });
    const saved = await student.save();
    const populated = await saved.populate(['userId', 'courseId']);
    res.status(201).json({ success: true, message: "Student enrolled successfully", data: populated });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: "Roll number already exists", data: null });
    next(err);
  }
};

export const getStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const students = await Student.find({ isDeleted: false })
      .populate('userId', 'name email role')
      .populate('courseId', 'name department')
      .skip(skip).limit(limit);
    res.status(200).json({ success: true, message: "Students fetched", data: students });
  } catch (err) { next(err); }
};

export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, isDeleted: false }).populate('userId', 'name email role').populate('courseId', 'name department');
    if (!student) return res.status(404).json({ success: false, message: "Student not found", data: null });
    res.status(200).json({ success: true, message: "Student fetched", data: student });
  } catch (err) { next(err); }
};

export const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true }).populate('userId', 'name email role').populate('courseId');
    if (!student) return res.status(404).json({ success: false, message: "Student not found", data: null });
    res.status(200).json({ success: true, message: "Student updated", data: student });
  } catch (err) { next(err); }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!student) return res.status(404).json({ success: false, message: "Student not found", data: null });
    res.status(200).json({ success: true, message: "Student soft-deleted", data: null });
  } catch (err) { next(err); }
};
