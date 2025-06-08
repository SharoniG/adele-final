import express from 'express';
//import loginUser from '../controllers/authController.js'; 
import orderController from '../controllers/orderController.js';
import authenticate from '../middleware/authMiddleware.js';  
import authorize from '../middleware/roleMiddleware.js';   

const router = express.Router();

//create product
router.post(
    '/new',
    authenticate,
    authorize('admin'),
    orderController.createOrder
  );
  


export default router;