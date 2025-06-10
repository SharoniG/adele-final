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
        enum: ['general', 'stuffed', 'accesories','trend'],
        default: 'general',
    },
    imageUrl: String,
    stock: {
      type: Number,
    },
    productCode: { 
      type: String, 
      unique: true 
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });



  const Product = mongoose.model('Product', productSchema);
  
  export default Product;    
