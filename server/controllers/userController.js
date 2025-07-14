import mongoose from "mongoose";
import User from "../models/userModel.js";
import Product from "../models/productModel.js"
import Order from "../models/orderModel.js";
import generateToken from '../utils/tokenUtils.js'
import bcrypt from "bcryptjs";

// Log in
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = generateToken(user);

    const maxAge = user.role === 'admin'
      ? 60 * 60 * 1000        // One hour in miliseconds
      : 24 * 60 * 60 * 1000;  // 24 hours

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge
    });
    console.log("JWT:", token);
    res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
}

// Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    //console.log(name, email, role);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !password || !role) {
      return res.status(400).send({ error: 'All fields are required' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).send({ error: 'Invalid email format' });
    }
    if (password.length < 6) {
      return res.status(400).send({ error: 'Password must be at least 6 characters long' });
    }
    if (name.length < 3) {
      return res.status(400).send({ error: 'Name must be at least 3 characters long' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: 'Email already exists' });
    }

    const saltRounds = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      password: hashedPass,
      role
    });

    res.status(201).send({
      message: `The user ${name} has been created successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send({ error: 'Server error creating user' });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(400).json('No users');
    }
    return res.status(200).json(users); 
  } catch (err) {
    res.status(500).send('Error getting all users')
  }
}

//delete user 
const deleteUser = async (req, res) => {
  try {
    console.log(req)
    const user = req.params.userID;
    const deletedUser = await User.findByIdAndDelete(user)
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }

}

// update user by id
const updateUser = async (req, res) => {
  try {
    const userID = req.params.userID; // userID כמו בראוטר 
    const { name, email, role } = req.body;

    if (!name || name.length < 3) {
      return res.status(400).json({ message: "Name must be at least 3 characters." });
    }
    const emailRegex = /.+\@.+\..+/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }
    const allowedRoles = ["user", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { name, email, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get by id
const getUserById = async (req, res) => {
  console.log(req)
  try {
    const user = await User.findById(req.params.id).select('-password'); // בלי סיסמה
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: "retrieved user successful", user: { id: user._id, name: user.name, email: user.email, role: user.role, created: user.createdAt } });
  } catch (err) {
    console.error("Error getting user by ID:", err);
    res.status(500).json({ message: 'Server error while getting user' });
  }
};


export default {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
  updateUser,
  getUserById
}

