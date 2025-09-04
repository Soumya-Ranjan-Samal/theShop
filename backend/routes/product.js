import  express from 'express';
import Product from '../models/product.js';
import User from "../models/user.js";
import Seller from "../models/seller.js";
import jwt from "jsonwebtoken";

import { configDotenv } from 'dotenv';

configDotenv();

const secret = process.env.SECRET;

const productRoute = express.Router({mergeParams: true});

productRoute.get("/",async (req,res)=>{
    let data = await Product.find({});
    res.send(data);
});

productRoute.get("/catagory/:value",async (req,res)=>{
    await Product.find({catagory: req.params.value}).then((data)=>{
        res.status(200).send(data);
    }).catch((error)=>{
        console.log(error);
    });
});

productRoute.post("/", async (req,res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        res.status(401).send({
            message: "Do Login First",
            state: false,
        });
    }
    let result = jwt.verify(token, secret);
    let newproduct = await Product({
        ...req.body,
        sellerId: result._id,
    });
    await newproduct.save().then(async (productdata)=>{
        await Seller.updateOne({_id: result._id},{$push : {products: productdata._id}}).then(()=>{
            res.status(200).send({
                message: "New Product Added",
                _id: productdata._id
            });
        }).catch((error)=>{
            res.status(403).send({
                message: "No updation occured in sellers account",
                state: false,
            });
        })
    }).catch((error)=>{
        res.status(500).send({
            error: "some error occured in saving the data",
            details: error
        });
    });
});

productRoute.delete("/:id/delete",async(req,res)=>{
    let authHeader = req.headers.authorization;
    let token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.json({
            status: false,
            message: "Invalid token, Login first",
        });
    }
    try{
        let result = jwt.verify(token, secret);
        await Product.findOneAndDelete({_id: req.params.id, sellerId: result._id}).then(async (data)=>{
            await User.updateOne({_id: result._id},{$pull : {products : data._id}}).then(()=>{
                res.send({
                    status: true,
                    message: "successfull deletion"
                });
            }).catch(()=>{
                res.send({
                    status: false,
                    message: "no updation in seller's account"
                });
            })
        }).catch(()=>{
            res.send({
                status: false,
                message: "there is some issue in deleting the product",
            });
        })
    }catch{
        res.send({
            status: false,
            message: "Do Login first",
        });
    }
});

productRoute.get("/:id/edit",async (req,res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        res.status(401).send({
            message: "Do Login First",
            state: false,
        });
    }
    try{
        let result = jwt.verify(token, secret);
        await Product.findOne({_id: req.params.id}).then((product)=>{
            if(result._id == product.sellerId){
                res.status(200).send({...product._doc});
            }else{
                res.status(403).send({
                    message: "you are not the owner",
                    state: false,
                });
            }
        }).catch((error)=>{
            console.log(error);
            res.status(500).send({
                error: true,
                message: error
            });
        });
    }
    catch{
        res.status(403).send({
            message: "Do Login First",
            state: false,
        });
    }
});

productRoute.get("/:id",async (req,res)=>{
    await Product.findOne({_id: req.params.id}).populate({path: "review", populate: {path: 'userId', select: 'username'}}).then((result)=>{
        let avgrating = 0;
        let len = result.review.length;
        for(let i=0;i<len;i++){
            avgrating+=result.review[i].rating;
        }
        let token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        let tokenData = false;
        try{
            tokenData = jwt.verify(token, secret);
            if(tokenData._id == result.sellerId){
                tokenData = true;
            }else{
                tokenData = false
            }
        }catch(error){
            console.log(error);
            tokenData = false
        }
        res.status(200).send({...result._doc, avgrating: avgrating/len,tokenData});
    }).catch((error)=>{
        console.log(error);
        res.status(500).send({
            error: true,
            message: error
        });
    });
});

productRoute.patch("/:id",async (req,res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        res.status(401).send({
            message: "Do Login First",
            state: false,
        });
    }
    let result = jwt.verify(token, secret);
    if(!result){
        res.status(403).send({
            message: "Do Login First",
            state: false,
        });
    }
    let data = req.body;
    let product = await Product.findOne({_id: data._id});
    if(result._id == product.sellerId){
    await Product.findOneAndUpdate({_id: req.params.id},data,{ new: true } ).populate("review").then((result)=>{
        let avgrating = 0;
        let len = result.review.length;
        for(let i=0;i<len;i++){
            avgrating+=result.review[i].rating;
        }
        res.status(200).send({...result._doc, avgrating: avgrating/len});
    }).catch((error)=>{
        console.log(error);
        res.status(500).send({
            error: true,
            message: error
        });
    });
    }else{
        res.status(403).send({
            message: "you are not the owner",
            state: false,
        });
    }
});


export default productRoute;