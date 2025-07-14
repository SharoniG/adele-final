import mongoose from "mongoose";
import Product from "../models/productModel.js"
import { getNextSequence } from '../utils/getNextSequence.js';


const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(400).json('No products');
    }
    res.status(201).send({ products });
  } catch (error) {
    res.status(500).send('Error getting all products')
  }
}

const getProduct = async (req, res) => {
  const code = req.params.code;
  try {
    const product = await Product.findOne({ productCode: code });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product by code:", error);
    res.status(500).json({ error: "Error getting product" });
  }

};

const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock, imageUrl } = req.body;
    if (!name || !price || !description || !category || !imageUrl || stock == null) {
      return res.status(400).send("All fields are required");
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).send("You already have a product with that name");
    }

    let product;
    let retries = 0;
    const maxRetries = 5;

    while (!product && retries < maxRetries) {
      const sequenceNumber = await getNextSequence("products"); //מספרת רץ חדש כדי לשרשר אותו אחרי זה
      const productCode = `PROD-${sequenceNumber.toString().padStart(3, '0')}`; // יצירת קוד מוצר PROD-sequenceNumber

      try {
        product = await Product.create({
          name,
          price,
          description,
          category,
          imageUrl,
          stock,
          productCode
        });
      } catch (error) {
        if (error.code === 11000 && error.message.includes('productCode')) { //אם הקוד מוצר הזה קיים כבר בדאטה בייס אז הוא ינסה שוב עם קודם חדש ויעלה את המונה של מספר ניסיונות
          retries++;
          continue;
        } else {
          throw error; // שגיאה ״רגילה״ שלא קשורה לקוד מוצר כפול
        }
      }
    }

    if (!product) {
      return res.status(500).send("Failed to generate unique product code");
    }

    res.status(201).send({
      message: `${name} has been added to the products list`,
      product,
    });

  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).send("Server error while creating product");
  }
};


const updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };

    const updated = await Product.findOneAndUpdate(
      { productCode: req.params.productCode },
      { $set: updates },
      { new: true, runValidators: true }
    )
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}


const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete(
      { productCode: req.params.productCode },
    )
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({
      message: `Product '${deleted.name}' was successfully deleted`
    });

  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}



const getHot = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(category)
    const hot = await Product.find({ category });
    res.status(200).json(hot);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


const getTopByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).limit(4);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching top products by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getHot,
  getTopByCategory
}