import mongoose from "mongoose";
import Order from '../models/orderModel.js'
import Product from "../models/productModel.js";


 const createOrder = async (req, res) => {
  try {

    console.log('req.user:', req.user);


    const items = req.body.items;
    const totalPrice = req.body.totalPrice;

    console.log('items:', req.body.items);
    console.log('totalPrice:', req.body.totalPrice);

    const customerId = req.user._id; // we get this from the order route  -> authenticate authorize
   
  
   
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Empty order'});
    }

  
    const fullItems = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const product = await Product.findById(item.product);

      if (!product) {
        console.log( `Product not found ${item.product}`);
        continue;
      }
    

      fullItems.push({
        product: product._id,
        quantity: item.quantity,
      });
    }


    // Creating the order
    const newOrder = new Order({
      customer: customerId,
      items: fullItems,
      totalPrice: totalPrice
    });

    const savedOrder = await newOrder.save();


    res.status(201).json('savedOrder'); // print this to the user 


  } catch (err) {
    console.error('⚠️ Order Save Error:', err);       
    console.error('🔍 Validation Errors:', err.errors); // מדפיס את השדות שלא תקינים
    res.status(500).json({ message: 'error creating the order' });
  }
};



const getOrders = async (req , res) =>{
  try{


    
    const orders = await Order.find().populate('customer items.product'); // כולל מידע על הלקוח והמוצר
    res.status(200).json(orders);


  } catch (err) {
    res.status(500).json({ message: 'error getting order' });
  }


};


export default {

  createOrder,
  getOrders

}