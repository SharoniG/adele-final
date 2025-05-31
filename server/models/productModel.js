import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {  
        type: String, 
        required: true 
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    description: String,
    category: {
        type: String,
        enum: ['general', 'stuffed', 'fashion','trend'],
        default: 'general',
    },
    imageUrl: String,
    stock: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });



  const Product = mongoose.model('Product', productSchema);
  
  export default Product;    
