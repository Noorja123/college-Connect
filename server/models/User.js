import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  isDeleted: { type: Boolean, default: false, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

userSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: false });
  next();
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const bcrypt = await import('bcryptjs');
  const salt = bcrypt.default.genSaltSync(10);
  this.password = bcrypt.default.hashSync(this.password, salt);
});

export default mongoose.model('User', userSchema);
