import AttendanceRecord from '../models/AttendanceRecord.js';

export const createAttendance = async (req, res, next) => {
  try {
    const { subjectId, date, records } = req.body;
    if (!subjectId || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: "Missing required fields or records is not an array", data: null });
    }
    const attendance = new AttendanceRecord({ subjectId, date, records, createdBy: req.user && req.user._id ? req.user._id : undefined });
    const saved = await attendance.save();
    const populated = await saved.populate(['subjectId', 'records.studentId']);
    res.status(201).json({ success: true, message: "Attendance sheet marked successfully", data: populated });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: "Attendance sheet for this Date/Subject already exists", data: null });
    next(err);
  }
};

export const getAttendanceRecords = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sheets = await AttendanceRecord.find({ isDeleted: false })
      .populate('subjectId', 'name')
      .populate('records.studentId')
      .skip(skip).limit(limit);
    res.status(200).json({ success: true, message: "Attendance sheets fetched", data: sheets });
  } catch (err) { next(err); }
};

export const getAttendanceById = async (req, res, next) => {
  try {
    const sheet = await AttendanceRecord.findOne({ _id: req.params.id, isDeleted: false }).populate('subjectId').populate('records.studentId');
    if (!sheet) return res.status(404).json({ success: false, message: "Record not found", data: null });
    res.status(200).json({ success: true, message: "Record fetched", data: sheet });
  } catch (err) { next(err); }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const payload = { ...req.body, updatedBy: req.user && req.user._id ? req.user._id : undefined };
    const sheet = await AttendanceRecord.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, payload, { new: true, runValidators: true }).populate('subjectId').populate('records.studentId');
    if (!sheet) return res.status(404).json({ success: false, message: "Record not found", data: null });
    res.status(200).json({ success: true, message: "Record sheet updated", data: sheet });
  } catch (err) { next(err); }
};

export const deleteAttendance = async (req, res, next) => {
  try {
    const sheet = await AttendanceRecord.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true, updatedBy: req.user && req.user._id ? req.user._id : undefined }, { new: true });
    if (!sheet) return res.status(404).json({ success: false, message: "Record not found", data: null });
    res.status(200).json({ success: true, message: "Record sheet soft-deleted", data: null });
  } catch (err) { next(err); }
};
