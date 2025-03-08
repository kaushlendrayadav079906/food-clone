// Import necessary modules
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import user_model from '../models/user.model.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const secret = process.env.JWT_SECRET; // Use secret from .env file

// Signup function
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const userExists = await user_model.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password and create user
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = await user_model.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: `User ${newUser.name} created successfully`,
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: 'Error occurred during signup' });
  }
};

// Signin function
export const signin = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if user exists
    const user = await user_model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '2h' }); // Set expiry as 2 hours

    return res.status(200).json({
      name: user.name,
      email: user.email,
      accessToken: token,
    });
  } catch (error) {
    console.error("Error during signin:", error);
    return res.status(500).json({ message: 'Error occurred during signin' });
  }
};