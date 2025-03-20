const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const cors = require("cors");
 
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors((origin = "*")));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
