import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'

const app = express();

mongoose
.connect(`mongodb+srv://argusapocraphex30:Guchtum8A5!@cluster0.uzzhosq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
}); 


app.use(express.json());   

app.listen(3000, () => {   
  console.log('Server is running on port 3000');
});