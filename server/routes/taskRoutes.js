const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Admin Routes
router.post('/', protect, authorize('admin'), createTask);
router.get('/', protect, authorize('admin'), getAllTasks);
router.get('/stats', protect, authorize('admin'), getTaskStats);

// Employee Routes
router.get('/my', protect, authorize('employee'), getMyTasks);
router.patch('/:id/status', protect, authorize('employee'), updateTaskStatus);

module.exports = router;
