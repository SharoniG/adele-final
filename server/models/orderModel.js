import mongoose from "mongoose";

// תת-סכמה לפריטים בתוך ההזמנה
const orderItemSchema = new mongoose.Schema({

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // ref to my Product model
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  }

});

// סכמת ההזמנה הראשית
const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ref to my User model  
    required: true
  },
  items: [orderItemSchema], // array of products usin the schema that is above 
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'cancelled'],
    default: 'pending'
  },
  orderedAt: {
    type: Date,
    default: Date.now
  }
});


const Order = mongoose.model('Order', orderSchema);
  
export default Order;    
