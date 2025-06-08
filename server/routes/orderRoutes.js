import express from 'express';
//import loginUser from '../controllers/authController.js'; 
import productController from '../controllers/orderController.js';
import authenticate from '../middleware/authMiddleware.js';  
import authorize from '../middleware/roleMiddleware.js';   

const router = express.Router();

//create product
/* router.post(
    '/product/:product',
    authenticate,
    authorize('admin'),
    productController.createProduct
  );
  */


export default router;