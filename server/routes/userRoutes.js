import express from 'express';
//import loginUser from '../controllers/authController.js'; 
import userController from '../controllers/userController.js';  
import productController from '../controllers/productController.js'
import authenticate from '../middleware/authMiddleware.js';  
import authorize from '../middleware/roleMiddleware.js';  

const router = express.Router();

// Login
router.post('/login', userController.loginUser);

//register

router.post('/register', userController.registerUser);

//get all users 
router.get('/', userController.getUsers);

//delete user by id
 router.delete(
    'delete/userID', 
    authenticate,
    authorize('admin'),
    userController.deleteUser
);

// update user by id
router.put(
    'update/userID', 
    authenticate,
    authorize('admin'),
    userController.updateUser
);





export default router;