const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} = require("../controllers/authController");

const { protect, admin } = require("../middlewares/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/users", protect, admin, getUsers);

router.post("/users", protect, admin, createUser);

router.patch("/users/:id", protect, admin, updateUser);

router.delete("/users/:id", protect, admin, deleteUser);

router.post("/change-password", protect, changePassword);
module.exports = router;
