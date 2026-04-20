import Student from '../models/Student.js';

export const createStudent = async (req, res, next) => {
  try {
    const { userId, rollNumber, courseId, semester, division } = req.body;
    if (!userId || !rollNumber || !courseId || !semester || !division) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const student = new Student({ userId, rollNumber, courseId, semester, division });
    const saved = await student.save();
    
    const populated = await saved.populate(['userId', 'courseId']);
    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Roll number already exists" });
    next(err);
  }
};

export const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ isDeleted: false })
      .populate('userId', 'name email role')
      .populate('courseId', 'name department');
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, isDeleted: false })
      .populate('userId', 'name email role')
      .populate('courseId', 'name department');
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email role').populate('courseId');
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student soft-deleted", id: student._id });
  } catch (err) {
    next(err);
  }
};
