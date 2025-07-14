import express from 'express';
//import loginUser from '../controllers/authController.js'; 
import productController from '../controllers/productController.js'
import authenticate from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';


const router = express.Router();

//Get all products
router.get('/all', productController.getProducts);


//Get specific producti
router.get('/code/:code', productController.getProduct);


//create product
router.post(
  '/new',
  authenticate,
  authorize('admin'),
  productController.createProduct
);

//update prroduct 
router.patch(
  '/code/:productCode',
  authenticate,
  authorize('admin'),
  productController.updateProduct

)
 //Delete product
router.delete(
  '/delete/:productCode',
  authenticate,
  authorize('admin'),
  productController.deleteProduct
)

//Get Hot items
router.get(
  '/category/:category',
  productController.getHot
)

//Get the first 4 items
router.get("/top/:category", productController.getTopByCategory);

export default router;

