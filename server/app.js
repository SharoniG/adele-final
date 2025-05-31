import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js'; // Import user routes
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
dotenv.config();

mongoose
.connect(`mongodb+srv://argusapocraphex30:Guchtum8A5!@cluster0.uzzhosq.mongodb.net/shop?retryWrites=true&w=majority`)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
}); 


app.use(express.json());   
app.use(cookieParser()); 

// Set up routing for all /users endpoints
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


app.listen(3000, () => {   
  console.log('Server is running on port 3000');
});