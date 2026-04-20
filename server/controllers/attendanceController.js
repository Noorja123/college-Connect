import AttendanceRecord from '../models/AttendanceRecord.js';

export const createAttendance = async (req, res, next) => {
  try {
    const { studentId, subjectId, date, status } = req.body;
    if (!studentId || !subjectId || !date || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const attendance = new AttendanceRecord({ studentId, subjectId, date, status });
    const saved = await attendance.save();
    
    const populated = await saved.populate(['studentId', 'subjectId']);
    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Attendance already marked for this subject on this date" });
    next(err);
  }
};

export const getAttendanceRecords = async (req, res, next) => {
  try {
    const records = await AttendanceRecord.find({ isDeleted: false })
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name' } })
      .populate('subjectId', 'name');
    res.status(200).json(records);
  } catch (err) {
    next(err);
  }
};

export const getAttendanceById = async (req, res, next) => {
  try {
    const record = await AttendanceRecord.findOne({ _id: req.params.id, isDeleted: false })
      .populate('studentId')
      .populate('subjectId');
    if (!record) return res.status(404).json({ message: "Attendance record not found" });
    res.status(200).json(record);
  } catch (err) {
    next(err);
  }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const record = await AttendanceRecord.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate('studentId').populate('subjectId');
    if (!record) return res.status(404).json({ message: "Attendance record not found" });
    res.status(200).json(record);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "This update conflicts with an existing attendance record" });
    next(err);
  }
};

export const deleteAttendance = async (req, res, next) => {
  try {
    const record = await AttendanceRecord.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!record) return res.status(404).json({ message: "Attendance record not found" });
    res.status(200).json({ message: "Attendance record soft-deleted", id: record._id });
  } catch (err) {
    next(err);
  }
};
