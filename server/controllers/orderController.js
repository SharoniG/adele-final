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
      return res.status(400).json({ message: 'Empty order' });
    }

    const fullItems = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const product = await Product.findById(item.product);
      if (!product) {
        console.log(`Product not found ${item.product}`);
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
    res.status(201).json(savedOrder); 

  } catch (err) {
    console.error('Order Save Error:', err);
    console.error('Validation Errors:', err.errors); // מדפיס את השדות שלא תקינים
    res.status(500).json({ message: 'error creating the order' });
  }
};



const getOrdersHistory = async (req, res) => {
  try {

    const orders = await Order.find().populate("customer", "name");   // בגלל שיש לנו רפרנס לuser

    if (orders.length === 0) {
      return res.status(400).json('No orders');
    }

    return res.status(200).json(orders);
  } catch (err) {
    res.status(500).send('Error getting all orders')
  }
}


const getOrders = async (req, res) => {
  try {
    const costumerID = req.params.costumerID;
    const orders = await Order.find({ customer: costumerID }).populate('items.product');
    console.log(orders);

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.status(200).json(orders);

  } catch (err) {
    res.status(500).json({ message: 'error getting order' });
  }


};


const updateOrderStatus = async (req, res) => {

  console.log(req)

  try {
    const orderId = req.params.orderID;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await updatedOrder.populate("customer", "name");
    res.status(200).json(updatedOrder);

  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const cancelOrder = async (req, res) => {

  console.log(req)
  try {
    const orderId = req.params.orderID;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // אם ההזמנה כבר נשלחה או בוטלה – אי אפשר לבטל שוב
    if (order.status === 'shipped' || order.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot cancel this order - order has been cancelled or shipped' });
    }

    order.status = 'cancelled';
    const cancelledOrder = await order.save();

    res.status(200).json(cancelledOrder);

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export default {

  createOrder,
  getOrders,
  updateOrderStatus,
  cancelOrder,
  getOrdersHistory

}