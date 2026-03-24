import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teacherId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  subjects: [{ type: String }],
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

teacherSchema.set('toJSON', { virtuals: true });
teacherSchema.set('toObject', { virtuals: true });

export default mongoose.model('Teacher', teacherSchema);
