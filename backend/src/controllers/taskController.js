const Task = require("../models/Task");
const asyncWrapper = require("../middlewares/asyncWrapper");
const AppError = require("../utils/AppError");
const { sendEmail } = require("../services/emailService");
const User = require("../models/User");

const getTasks = asyncWrapper(async (req, res) => {
  let tasks;
  
  if (req.user.role === "admin") {
    tasks = await Task.find().populate("assignedTo", "username email");
  } else {
    tasks = await Task.find({ assignedTo: req.user.id }).populate("assignedTo", "username email"); 
  }

  res.json({ tasks });
});

const createTask = asyncWrapper(async (req, res, next) => {
  const { title, description, assignedTo } = req.body;

  if (!title || !assignedTo || assignedTo.length === 0) {
    return next(
      new AppError("Title and at least one assigned user are required!", 400)
    );
  }

  const task = await Task.create({ title, description, assignedTo });

  for (const userId of assignedTo) {
    const user = await User.findById(userId);
    if (user) {
      await sendEmail(
        user.email,
        "New Task Assigned",
        `You have been assigned a new task: ${title}
        Task Description: ${description}`
         
      );
    }
  }

  res.status(201).json(task);
});

const updateTask = asyncWrapper(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(new AppError("Task not found", 404));

  if (!task.assignedTo.includes(req.user.id) && req.user.role !== "admin") {
    return next(new AppError("Not authorized", 403));
  }

  
  const oldAssignedUsers = task.assignedTo.map(user => user.toString());


  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate("assignedTo", "username email");


  const newAssignedUsers = updatedTask.assignedTo.map(user => user._id.toString());

 
  const newlyAddedUsers = newAssignedUsers.filter(userId => !oldAssignedUsers.includes(userId));


  for (const userId of newlyAddedUsers) {
    const user = await User.findById(userId);
    if (user) {
      await sendEmail(
        user.email,
        "You've been added to a task",
        `Hello ${user.username},\n\nYou have been assigned a new task: ${updatedTask.title}\n\nTask Description: ${updatedTask.description}`
      );
    }
  }

  res.json(updatedTask);
});


const deleteTask = asyncWrapper(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(new AppError("Task not found", 404));
  if (task.assignedTo.toString() !== req.user.id && req.user.role !== "admin")
    return next(new AppError("Not authorized", 403));

  await task.deleteOne();
  res.json({ message: "Task deleted successfully" });
});

module.exports = { getTasks, createTask, updateTask, deleteTask };
