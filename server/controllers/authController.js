const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'taskflow_jwt_secret_key_2026_xplore_intellects',
    {
      expiresIn: '7d'
    }
  );
};

/**
  @desc    Authenticate user & get token
  @route   POST /api/auth/login
  @access  Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate presence
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password'
    });
  }

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Generate Token
  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

module.exports = {
  login
};
