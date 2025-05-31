import mongoose from "mongoose";
import Product from "../models/productModel.js"
//import bcrypt from "bcryptjs";

const getProducts = async (req , res) => {
    console.log(req)
    try{
        const products = await Product.find();
        if (products.length === 0){
            return res.status(400).json('No products');
        }  
        res.status(201).send({products});
    }catch (err){
        res.status(500).send('Error getting all products')
    }
}

const getProduct = async (req , res) => {
    const productParam = req.params.product;
    try{
        const product = await Product.find({ 'name' : productParam});  
        if (!product || product.length === 0) {
            return res.status(400).json('No product with such name');
        }
        res.status(200).json(product);
    }catch(err){
        res.status(500).send('Error getting product')
    }
}


const createProduct = async (req , res) => {
         try{

            const { name , price , description , category , imageUrl } = req.body;

            if  ( !name || !price || !description || !category || !imageUrl ) {
                return res.status(400).send('All field are required');
            }

            const existingProduct = await Product.find();

            if (existingProduct > 0){
                return res.status(400).send('You allready have a product with that name');
            }

            const product = await Product.create({
                name,
                price,
                description,
                category,
                imageUrl
            });
        
            const returnProduct = {
                _id: product._id,
                name: product.name,
                price: product.price,
                category: product.category,
                description: product.description,
                imageUrl: product.imageUrl
            };

            res.status(201).send({
                message: `${name} has been added to the products list`,
                returnProduct
            });

         }catch (err){

         }

}



export default {
    getProducts,
    getProduct,
    createProduct
}