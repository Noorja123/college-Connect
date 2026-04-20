import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  fileUrl: { type: String, required: true },
  marks: { type: Number, default: null },
  feedback: { type: String, default: null },
  isDeleted: { type: Boolean, default: false, index: true }
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);
