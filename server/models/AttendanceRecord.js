import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  date: { type: Date, required: true, index: true },
  status: { type: String, enum: ["present", "absent"], required: true, index: true },
  isDeleted: { type: Boolean, default: false, index: true }
}, { timestamps: true });

attendanceRecordSchema.index({ studentId: 1, subjectId: 1, date: 1 }, { unique: true });

export default mongoose.model('AttendanceRecord', attendanceRecordSchema);
