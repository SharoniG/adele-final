import express from 'express';
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
  

  router.get(
    '/:costumerID',
    authenticate,
    authorize('admin'),
    orderController.getOrders
  );





  

export default router;