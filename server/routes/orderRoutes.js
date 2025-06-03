import express from 'express';
//import loginUser from '../controllers/authController.js'; 
import productController from '../controllers/orderController.js';
import authenticate from '../middleware/authMiddleware.js';  
import authorize from '../middleware/roleMiddleware.js';   

const router = express.Router();




export default router;