import User from '../models/User.js';

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "Missing required fields", data: null });
    }
    const user = new User({ name, email, password, role });
    const saved = await user.save();
    saved.password = undefined;
    res.status(201).json({ success: true, message: "User created successfully", data: saved });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: "Email already exists", data: null });
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ isDeleted: false }).select('-password').skip(skip).limit(limit);
    res.status(200).json({ success: true, message: "Users fetched successfully", data: users });
  } catch (err) { next(err); }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User not found", data: null });
    res.status(200).json({ success: true, message: "User fetched successfully", data: user });
  } catch (err) { next(err); }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User not found", data: null });
    res.status(200).json({ success: true, message: "User updated successfully", data: user });
  } catch (err) { next(err); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found", data: null });
    res.status(200).json({ success: true, message: "User successfully soft-deleted", data: null });
  } catch (err) { next(err); }
};
