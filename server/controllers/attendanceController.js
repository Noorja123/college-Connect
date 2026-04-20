import AttendanceRecord from '../models/AttendanceRecord.js';

export const createAttendance = async (req, res, next) => {
  try {
    const { studentId, subjectId, date, status } = req.body;
    if (!studentId || !subjectId || !date || !status) return res.status(400).json({ success: false, message: "Missing required fields", data: null });
    const attendance = new AttendanceRecord({ studentId, subjectId, date, status });
    const saved = await attendance.save();
    const populated = await saved.populate(['studentId', 'subjectId']);
    res.status(201).json({ success: true, message: "Attendance marked", data: populated });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: "Attendance already marked", data: null });
    next(err);
  }
};

export const getAttendanceRecords = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const records = await AttendanceRecord.find({ isDeleted: false })
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name' } })
      .populate('subjectId', 'name')
      .skip(skip).limit(limit);
    res.status(200).json({ success: true, message: "Attendance fetched", data: records });
  } catch (err) { next(err); }
};

export const getAttendanceById = async (req, res, next) => {
  try {
    const record = await AttendanceRecord.findOne({ _id: req.params.id, isDeleted: false }).populate('studentId').populate('subjectId');
    if (!record) return res.status(404).json({ success: false, message: "Record not found", data: null });
    res.status(200).json({ success: true, message: "Record fetched", data: record });
  } catch (err) { next(err); }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const record = await AttendanceRecord.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true }).populate('studentId').populate('subjectId');
    if (!record) return res.status(404).json({ success: false, message: "Record not found", data: null });
    res.status(200).json({ success: true, message: "Record updated", data: record });
  } catch (err) { next(err); }
};

export const deleteAttendance = async (req, res, next) => {
  try {
    const record = await AttendanceRecord.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: "Record not found", data: null });
    res.status(200).json({ success: true, message: "Record soft-deleted", data: null });
  } catch (err) { next(err); }
};
