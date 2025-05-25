import jwt from 'jsonwebtoken';
  // Function to generate a JWT token for a user
  const generateToken = (user) => {

  // Set token expiration based on user role:
  // 1 hour for admin, 1 day for all other roles
  const expiresIn = user.role === 'admin' ? '1h' : '1d';

  /* Create and return the signed token with user ID and role as payload.
  The payload is the part of the JWT that contains the actual data (like user ID and role). 
  It's used to identify the user and determine permissions. */

  return jwt.sign(
    { id: user._id, role: user.role }, // Send the user id and the role for the user.
    process.env.JWT_SECRET,  // Secret key for signing, they key in the .env file
    { expiresIn } //Token expiration time, we change the time depending on the role
  );

};


export default generateToken;