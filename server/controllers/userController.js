import mongoose from "mongoose";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

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


