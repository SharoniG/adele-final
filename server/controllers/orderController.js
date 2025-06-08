import mongoose from "mongoose";
import Order from '../models/orderModel.js'


export const createOrder = async (req, res) => {
  try {
    const items = req.body.items;
    const totalPrice = req.body.totalPrice;
    const customerId = req.user._id;

    // אם אין פריטים בהזמנה
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'אין פריטים בהזמנה' });
    }

    // בניית רשימת פריטים עם מידע על כל מוצר
    const fullItems = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: 'מוצר לא נמצא' });
      }

      fullItems.push({
        product: product._id,
        quantity: item.quantity,
        productSnapshot: {
          name: product.name,
          price: product.price
        }
      });
    }

    
    // יצירת ההזמנה
    const newOrder = new Order({
      customer: customerId,
      items: fullItems,
      totalPrice: totalPrice
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה ביצירת ההזמנה' });
  }
};






export default {

}