import User from '../models/User.js';

const formatUserResponse = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  phone: user.phone,
  createdAt: user.createdAt,
});

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: formatUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Registration failed',
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Invalid password',
      });
    }

    return res.status(200).json({
      message: 'User logged in successfully',
      user: formatUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Login failed',
      error: error.message,
    });
  }
};
