import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'late'], required: true }
}, { timestamps: true });

attendanceRecordSchema.set('toJSON', { virtuals: true });
attendanceRecordSchema.set('toObject', { virtuals: true });

export default mongoose.model('AttendanceRecord', attendanceRecordSchema);
