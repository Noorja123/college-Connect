import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: String, required: true },
  department: { type: String, required: true },
  isDeleted: { type: Boolean, default: false, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

courseSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: false });
  next();
});

export default mongoose.model('Course', courseSchema);
