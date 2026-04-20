import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  department: { type: String, required: true, index: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  isDeleted: { type: Boolean, default: false, index: true }
}, { timestamps: true });

export default mongoose.model('Teacher', teacherSchema);
