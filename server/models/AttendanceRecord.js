import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  date: { type: Date, required: true, index: true },
  records: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['present', 'absent'], required: true }
  }],
  isDeleted: { type: Boolean, default: false, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

attendanceRecordSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: false });
  next();
});

attendanceRecordSchema.index({ subjectId: 1, date: 1 }, { unique: true });

export default mongoose.model('AttendanceRecord', attendanceRecordSchema);
