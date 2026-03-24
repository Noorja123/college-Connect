import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  semester: { type: Number, required: true },
  credits: { type: Number, required: true }
}, { timestamps: true });

subjectSchema.set('toJSON', { virtuals: true });
subjectSchema.set('toObject', { virtuals: true });

export default mongoose.model('Subject', subjectSchema);
