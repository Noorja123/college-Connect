import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true, index: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  isDeleted: { type: Boolean, default: false, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

assignmentSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: false });
  next();
});

export default mongoose.model('Assignment', assignmentSchema);
