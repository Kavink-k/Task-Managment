const Task = require('../models/Task');
const User = require('../models/User');
const {
  sendTaskAssignedEmail,
  sendTaskStatusUpdatedEmail
} = require('../services/emailService');

/**
  @desc    Create and assign a new task
  @route   POST /api/tasks
  @access  Private (Admin only)
 */
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority } = req.body;

    // Validation
    if (!title || !description || !assignedTo || !priority) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, assignedTo, priority'
      });
    }

    // Verify assigned user exists and is an employee
    const employee = await User.findById(assignedTo);
    if (!employee || employee.role !== 'employee') {
      return res.status(400).json({
        success: false,
        message: 'Invalid assigned employee'
      });
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      assignedTo,
      priority,
      status: 'Not Started'
    });

    const populatedTask = await Task.findById(task._id).populate(
      'assignedTo',
      'name email role'
    );

    // Send email notification to assigned employee asynchronously
    sendTaskAssignedEmail({
      employeeEmail: employee.email,
      employeeName: employee.name,
      taskTitle: task.title,
      taskDescription: task.description,
      priority: task.priority,
      status: task.status,
      assignedDate: task.createdAt
    });

    res.status(201).json({
      success: true,
      message: 'Task assigned successfully',
      task: populatedTask
    });
  } catch (error) {
    console.error('[Create Task Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create task'
    });
  }
};

/**
  @desc    Get all tasks with backend search and pagination
  @route   GET /api/tasks
  @access  Private (Admin only)
 */
const getAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search ? req.query.search.trim() : '';

    const skip = (page - 1) * limit;

    let queryFilter = {};

    if (search) {
      // Find matching employee IDs if search matches employee name
      const matchingEmployees = await User.find({
        role: 'employee',
        name: { $regex: search, $options: 'i' }
      }).select('_id');

      const employeeIds = matchingEmployees.map((emp) => emp._id);

      queryFilter = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { assignedTo: { $in: employeeIds } }
        ]
      };
    }

    const total = await Task.countDocuments(queryFilter);
    const totalPages = Math.ceil(total / limit) || 1;

    const tasks = await Task.find(queryFilter)
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('[Get All Tasks Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
};

/**
  @desc    Get logged-in employee assigned tasks
  @route   GET /api/tasks/my
  @access  Private (Employee only)
 */
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('assignedTo', 'name email role')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('[Get My Tasks Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your assigned tasks'
    });
  }
};

/**
  @desc    Update assigned task status
  @route   PATCH /api/tasks/:id/status
  @access  Private (Employee only)
 */
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Not Started', 'Pending', 'In Progress', 'Completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value. Allowed: ${validStatuses.join(', ')}`
      });
    }

    const task = await Task.findById(id).populate('assignedTo', 'name email role');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Strict Backend Ownership Validation (Spec #15 & #26)
    if (task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to update this task'
      });
    }

    const previousStatus = task.status;
    task.status = status;
    await task.save();

    // Send email notification to Admin asynchronously (Spec #16)
    sendTaskStatusUpdatedEmail({
      adminEmail: process.env.ADMIN_EMAIL,
      employeeName: req.user.name,
      taskTitle: task.title,
      previousStatus,
      newStatus: task.status,
      updatedDate: task.updatedAt
    });

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    console.error('[Update Task Status Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task status'
    });
  }
};

/**
  @desc    Get task statistics for Admin Dashboard
  @route   GET /api/tasks/stats
  @access  Private (Admin only)
 */
const getTaskStats = async (req, res) => {
  try {
    const notStarted = await Task.countDocuments({ status: 'Not Started' });
    const pending = await Task.countDocuments({ status: 'Pending' });
    const inProgress = await Task.countDocuments({ status: 'In Progress' });
    const completed = await Task.countDocuments({ status: 'Completed' });

    res.status(200).json({
      success: true,
      stats: {
        notStarted,
        pending,
        inProgress,
        completed
      }
    });
  } catch (error) {
    console.error('[Get Task Stats Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task statistics'
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  getTaskStats
};
