import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  file: {
    url: { type: String, required: true },
    name: { type: String },
    size: { type: Number },
    type: { type: String }
  },
  status: { type: String, enum: ['submitted', 'graded'], default: 'submitted' },
  submittedAt: { type: Date, default: Date.now },
  marks: { type: Number },
  feedback: { type: String },
  isDeleted: { type: Boolean, default: false, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

submissionSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: false });
  next();
});

submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

export default mongoose.model('Submission', submissionSchema);
