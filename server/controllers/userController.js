import mongoose from "mongoose";
import User from "../models/userModel.js";
import Product from "../models/productModel.js"
import Order from "../models/orderModel.js";
import generateToken from '../utils/tokenUtils.js'
import bcrypt from "bcryptjs";


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try{
      const existingUser = await User.find({ email });
      if (!existingUser.length) {
        return res.status(404).json({ message: "User not found" });
      }
      const user = existingUser[0];
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
      
      res.status(200).json({ message: "Login successful", user: { id: user._id, email: user.email , role: user.role} });


  }catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error!" });
    }
  
}


const registerUser = async (req, res) => {
   try{
    const {name, email, password, role } = req.body;
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

    if (name.length < 6) {
        return res.status(400).send({ error: 'Password must be at least 3 characters long' });
    
    }

    const existingUser = await User.find({ email });

    if (existingUser.length > 0) {
      return res.status(400).send({ error: 'Email already exists' });
    }

    const saltRounds = await bcrypt.genSalt();
    const hashedPadd = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      password: hashedPadd,
      role
    });


    res.status(201).send({
        messahe: `The user ${name} has been created successfully`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
    })

   } catch (err){
     res.status(500).send({rror: 'Server error creating user'});
   }

};




export default {
    registerUser,
    loginUser
}

