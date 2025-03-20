const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncWrapper = require("../middlewares/asyncWrapper");
const AppError = require("../utils/AppError");

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });

const getUsers = asyncWrapper(async (req, res, next) => {
  if (!req.user) return next(new AppError("Not authorized", 401));

  const users = await User.find({}).select("-password");
  res.status(200).json({ users });
});

const registerUser = asyncWrapper(async (req, res, next) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return next(new AppError("User already exists", 400));

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashPassword,
    role: "user",
  });

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
});

const loginUser = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid credentials", 401));
  }
  

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
});

const createUser = asyncWrapper(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Not authorized", 403));
  }

  const { username, email, password, role } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return next(new AppError("User already exists", 400));

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
    role,
  });

  res.status(201).json({
    _id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
  });
});

const updateUser = asyncWrapper(async (req, res, next) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return next(new AppError("Username and email are required!", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { username, email },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    return next(new AppError("User not found!", 404));
  }

  res.status(200).json({ success: true, data: updatedUser });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Not authorized", 403));
  }

  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found", 404));

  await user.deleteOne();

  res.status(200).json({ message: "User deleted successfully" });
});

const changePassword = asyncWrapper(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("User not found", 404));

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return next(new AppError("Current password is incorrect", 400));

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
});

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
