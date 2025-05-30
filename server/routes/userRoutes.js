import express from 'express';
import loginUser from '../controllers/authController.js'; 
//import userController from '../controllers/userController.js';  
import authenticate from '../middleware/authMiddleware.js';  
import authorize from '../middleware/roleMiddleware.js';  

const router = express.Router();

// Login
router.post('/login', loginUser);


export default router;