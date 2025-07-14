import mongoose from "mongoose";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";


  const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const existingUser = await User.find({ email });
    if (!existingUser.length) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = existingUser[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = user.generateAuthToken();
    console.log(token)
    const maxAge = user.role === 'admin'
      ? 60 * 60 * 1000   // שעה בשביל שלא יהיה מצב שמי שאדמין ישאר מחובר להרבה זמן 
      : 24 * 60 * 60 * 1000;  // 24 hours

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge,
   });

    res.status(200).json({ message: "Login successful", user: { id: user._id, email: user.email } });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error!" });
  }

}


export default loginUser;