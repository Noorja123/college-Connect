import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  course: { type: String, required: true },
  semester: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

export default mongoose.model('Student', studentSchema);
