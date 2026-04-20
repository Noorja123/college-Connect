import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  isDeleted: { type: Boolean, default: false, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

enrollmentSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: false });
  next();
});

enrollmentSchema.index({ studentId: 1, subjectId: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);
