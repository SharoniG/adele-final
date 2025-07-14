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
  

//Get order history 
router.get(
    '/',
    authenticate,
    authorize('admin'),
    orderController.getOrdersHistory
  );

//Get order history per id
  router.get(
    '/:costumerID',
    authenticate,
    authorize('admin'),
    orderController.getOrders
  );

  //Update order
  router.put(
    '/update/:orderID',
    authenticate,
    authorize('admin'),
    orderController.updateOrderStatus
  );

//Delete order
  router.delete(
    '/cancel/:orderID',
    authenticate,
    authorize('admin'),
    orderController.cancelOrder
  );



  

export default router;