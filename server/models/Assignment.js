import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true, index: true },
  dueDate: { type: Date, required: true, index: true },
  isDeleted: { type: Boolean, default: false, index: true }
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);
