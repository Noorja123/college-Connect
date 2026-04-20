import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  duration: { type: String, required: true },
  department: { type: String, required: true, index: true },
  isDeleted: { type: Boolean, default: false, index: true }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
