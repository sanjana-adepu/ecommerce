import Product from "../models/product.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import Order from "../models/order.js";
import dotenv from "dotenv";

dotenv.config();

console.log(
  "Braintree ENV:",
  process.env.BRAINTREE_MERCHANT_ID,
  process.env.BRAINTREE_PUBLIC_KEY,
  process.env.BRAINTREE_PRIVATE_KEY
);

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const create = async (req, res) => {
    try{
        // console.log(req.fields);
        // console.log(req.files);
        const {name, description, price, category, quantity, shipping} =
        req.fields;
        const {photo} = req.files;

        //validation
        switch(true){
            case !name.trim():
                return res.json({ error: "Name is required"});
            case !description.trim():
                return res.json({ error: "Description is required"});
            case !price.trim():
                return res.json({ error: "price is required"});
            case !category.trim():
                return res.json({ error: "Category is required"});
            case !quantity.trim():
                return res.json({ error: "quantity is required"});
            case !shipping.trim():
                return res.json({ error: "shipping is required"});
            case photo && photo.size > 1000000:
                res.json({ error: "Image should be lless than 1MB in size"});
        }

        //create product
        const product = new Product({...req.fields, slug: slugify(name)});

        if(photo){
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();
        res.json(product);
    }catch(err){
        console.log(err);
        return res.status(400).json(err.message);
    }
};

export const list = async (req,res)=> {
    try{
        const products = await Product.find({})
        .populate("category")
            .select("-photo")
            .limit(12)
            .sort({createdAt: -1});

        res.json(products);
    }catch(err){
        console.log(err);
        return res.status(400).json(err);
    }
};

export const read = async (req,res)=> {
    try{
        const product = await Product.findOne({slug: req.params.slug})
        .select('-photo').populate("category");
        res.json(product);
    }catch(err){
        console.log(err);
        return res.status(400).json(err);
    }
};

export const photo = async (req,res)=> {
    try{
        const product = await Product.findById(req.params.productId).select("photo");
        if(product.photo.data){
            res.set('Content-Type', product.photo.contentType);
            return res.send(product.photo.data);
        }
        // res.json(product);
    }catch(err){
        console.log(err);
        return res.status(400).json(err);
    }
};

export const remove = async (req,res)=> {
    try{
        const removed = await Product.findByIdAndDelete(
            req.params.productId
        ).select("-photo");
        res.json(removed);
    }catch(err){
        console.log(err);
        return res.status(400).json(err);
    }
}

export const update = async (req, res) => {
    try{
        // console.log(req.fields);
        // console.log(req.files);
        const {name, description, price, category, quantity, shipping} =
        req.fields;
        const {photo} = req.files;

        //validation
        switch(true){
            case !name.trim():
                return res.json({ error: "Name is required"});
            case !description.trim():
                return res.json({ error: "Description is required"});
            case !price.trim():
                return res.json({ error: "price is required"});
            case !category.trim():
                return res.json({ error: "Category is required"});
            case !quantity.trim():
                return res.json({ error: "quantity is required"});
            case !shipping.trim():
                return res.json({ error: "shipping is required"});
            case photo && photo.size > 1000000:
                res.json({ error: "Image should be less than 1MB in size"});
        }

        //update product
        const product = await Product.findByIdAndUpdate(
            req.params.productId,
             {
                ...req.fiels,
                slug: slugify(name),
             },
            {new: true});

        if(photo){
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();
        res.json(product);
    }catch(err){
        console.log(err);
        return res.status(400).json(err.message);
    }
};

export const filteredProducts = async (req,res) => {
    try{
        const {checked, radio} = req.body;

        let args={};
        if(checked.length > 0) args.category = checked;
        if(radio.length > 0) args.price = {$gte : radio[0], $lte: radio[1]};

        console.log("args =>", args);

        const products = await Product.find(args);
        console.log(
            "filtered products =>", products.length
        )
        res.json(products);

    }catch(err){
        console.log(err);
    }
};

export const productsCount = async (req,res) => {
    try{
        const total = await Product.find({}).estimatedDocumentCount();
        res.json(total);
    }catch(err){
        console.log(err);
    }
};

export const listProducts = async (req,res) => {
    try{
        const perPage = 6;
        const page = req.params.page ? req.params.page :1;

        const products = await Product.find({})
        .select("-photo")
        .skip((page-1) * perPage)
        .limit(perPage) 
        .sort({createdAt: -1});

        res.json(products);

    }catch(err){
        console.log(err);
    }
};

export const productsSearch = async(req, res) => {
    try{
        const {keyword} = req.params;
        const results = await Product.find({
            $or: [
                {name: {$regex: keyword, $options: "i"}},
                {description: {$regex: keyword, $options: "i"}},
            ],
        }).select("-photo");

        res.json(results);
    }catch(err){
        console.log(err);
    }
};

export const relatedProducts = async(req, res) => {
    try{
        const {productId, categoryId} = req.params;
        const related = await Product.find({
            category: categoryId,
            _id : {$ne: productId},
        })
        .select("-photo")
        .populate('category')
        .limit(3);

        res.json(related);
    }catch(err){
        console.log(err);
    }
};

export const getToken = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send({ clientToken: response.clientToken });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export const processPayment = async (req, res) => {
  try {
    const { nonce, cart } = req.body;

    let total = 0;
    cart.map((item) => {
      total += item.price;
    });

    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
        //   res.send(result);
            const order = new Order({
                products: cart,
                payment: result,
                buyer: req.auth._id,
            }).save();
            res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};
