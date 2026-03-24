import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  dueDate: { type: Date, required: true },
  totalMarks: { type: Number, required: true },
  teacherName: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

assignmentSchema.set('toJSON', { virtuals: true });
assignmentSchema.set('toObject', { virtuals: true });

export default mongoose.model('Assignment', assignmentSchema);
