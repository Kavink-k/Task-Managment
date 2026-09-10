const User = require('../models/User');
const Task = require('../models/Task');

/**
  @desc    Get all employees with task summary statistics
  @route   GET /api/employees
  @access  Private (Admin only)
 */
const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Aggregate task counts for each employee
    const employeesWithStats = await Promise.all(
      employees.map(async (emp) => {
        const totalTasks = await Task.countDocuments({ assignedTo: emp._id });
        const completedTasks = await Task.countDocuments({
          assignedTo: emp._id,
          status: 'Completed'
        });
        const pendingTasks = totalTasks - completedTasks;

        return {
          _id: emp._id,
          name: emp.name,
          email: emp.email,
          role: emp.role,
          createdAt: emp.createdAt,
          totalTasks,
          pendingTasks,
          completedTasks
        };
      })
    );

    res.status(200).json({
      success: true,
      employees: employeesWithStats
    });
  } catch (error) {
    console.error('[Get Employees Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees'
    });
  }
};

/**
  @desc    Create a new employee
  @route   POST /api/employees
  @access  Private (Admin only)
 */
const createEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check email uniqueness
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    const employee = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'employee'
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        createdAt: employee.createdAt,
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0
      }
    });
  } catch (error) {
    console.error('[Create Employee Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create employee'
    });
  }
};

/**
  @desc    Update employee details
  @route   PUT /api/employees/:id
  @access  Private (Admin only)
 */
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const employee = await User.findById(id);

    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (name) employee.name = name.trim();

    if (email && email.toLowerCase().trim() !== employee.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email address is already in use by another user'
        });
      }
      employee.email = email.toLowerCase().trim();
    }

    if (password && password.trim().length > 0) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters'
        });
      }
      employee.password = password;
    }

    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        createdAt: employee.createdAt
      }
    });
  } catch (error) {
    console.error('[Update Employee Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update employee'
    });
  }
};

/**
  @desc    Delete employee
  @route   DELETE /api/employees/:id
  @access  Private (Admin only)
 */
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id);

    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Delete tasks assigned to this employee
    await Task.deleteMany({ assignedTo: id });

    // Delete employee record
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Employee and associated tasks deleted successfully'
    });
  } catch (error) {
    console.error('[Delete Employee Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee'
    });
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
