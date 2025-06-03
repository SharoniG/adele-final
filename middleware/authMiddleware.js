import jwt from 'jsonwebtoken';

//Middleware function to authenticate a token
 const authenticate = (req, res, next) => {

    console.log(req); 
    console.log(res); 

  // Get the token from the cookies
  const token = req.cookies.token;

  // If no token is found, deny access
  if (!token) {
    return res.status(401).send('Please authenticate'); 
  }

  try {
    // Verify and decode the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    // Store the decoded user information in the request object
    req.user = decoded;  

    next(); // next() -> a funcion the help us to proceed to the next function (in our case the endpoint)
  } catch (error) {
    res.status(401).send('Invalid token');  
  }
  
};
 export default authenticate;