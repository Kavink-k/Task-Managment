const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Task = require('../models/Task');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedCoreData = async () => {
  // Clear existing collections
  await User.deleteMany({});
  await Task.deleteMany({});
  console.log('[Seed Script] Cleared existing User and Task data.');

  // Seed Demo Admin
  const admin = await User.create({
    name: 'System Admin',
    email: 'admin@taskflow.com',
    password: 'AdminPass123!',
    role: 'admin'
  });

  // Seed Demo Employees
  const emp1 = await User.create({
    name: 'John Doe',
    email: 'john.doe@taskflow.com',
    password: 'EmpPass123!',
    role: 'employee'
  });

  const emp2 = await User.create({
    name: 'Jane Smith',
    email: 'jane.smith@taskflow.com',
    password: 'EmpPass123!',
    role: 'employee'
  });

  console.log('[Seed Script] Created Demo Admin and Employees successfully.');

  // Seed Demo Tasks
  await Task.create([
    {
      title: 'Design Database Schema for Authentication',
      description: 'Create Mongoose User and Task models with strict field validation and password encryption.',
      assignedTo: emp1._id,
      priority: 'High',
      status: 'Completed'
    },
    {
      title: 'Build JWT Auth Middleware',
      description: 'Implement JWT signing and authorization verification middleware for protected REST endpoints.',
      assignedTo: emp1._id,
      priority: 'High',
      status: 'In Progress'
    },
    {
      title: 'Integrate Nodemailer Email Notifications',
      description: 'Configure automated HTML email templates for task assignment and status updates.',
      assignedTo: emp2._id,
      priority: 'Medium',
      status: 'Pending'
    },
    {
      title: 'Implement Search and Server Pagination',
      description: 'Build backend query handling for search filtering and pagination metadata.',
      assignedTo: emp2._id,
      priority: 'Low',
      status: 'Not Started'
    }
  ]);

  console.log('[Seed Script] Created sample tasks.');
  console.log('--- DEMO CREDENTIALS READY ---');
  console.log('Admin Email:      admin@taskflow.com | Password: AdminPass123!');
  console.log('Employee 1 Email: john.doe@taskflow.com | Password: EmpPass123!');
  console.log('Employee 2 Email: jane.smith@taskflow.com | Password: EmpPass123!');
};

const runStandaloneSeed = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow';
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`[Seed Script] Connected to MongoDB: ${MONGO_URI}`);
    await seedCoreData();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  runStandaloneSeed();
}

module.exports = { seedCoreData };
