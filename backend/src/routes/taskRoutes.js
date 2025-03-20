const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getTasks).post(protect, createTask);
router.route('/:id').patch(protect, updateTask).delete(protect, deleteTask);

module.exports = router;