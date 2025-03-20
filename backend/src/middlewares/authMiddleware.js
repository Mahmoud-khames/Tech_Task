const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const protect = async (req, res, next) => {
  try {
    const token =
       req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(new AppError("You are not authorized to access this route", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

     req.user = decoded;
    console.log(decoded);

    next();
  } catch (error) {
    return next(new AppError("You are not authorized to access this route", 401));
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access denied" });
  }
};

module.exports = { protect, admin };
