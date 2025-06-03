import mongoose from "mongoose";
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'


const createOrder = async (req, res) => {
  try {
    
    const userId = req.user._id; // we create this in the authMiddleware 
    const items = req.body.items;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must include at least one item.' });
    }

    let totalPrice = 0;
    const fullItems = [];

    for (const item of items) {

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.product} not found.` });
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      fullItems.push({
        product: product._id,
        quantity: item.quantity,
        productSnapshot: {
          name: product.name,
          price: product.price
        }
      });
    }

    const newOrder = new Order({
      customer: userId,
      items: fullItems,
      totalPrice
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export default {
  createOrder
};



