import  express from 'express';
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';

configDotenv();

const secret = process.env.SECRET;

const cartRoute = express.Router({mergeParams: true});

cartRoute.post("/:id/add",async (req,res)=>{
    let token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if(!token){
        res.status(400).send({
            message: "Do login first",
            status: false
        });
    }
    try{
        let tokenData = jwt.verify(token, secret);
        User.findOneAndUpdate({_id: tokenData._id},{$push: {cart: req.params.id}}).then(()=>{
            res.status(200).send({
                message: "Item is added to cart",
                status: true,
            });
        }).catch((error)=>{
            res.status(500).send({
                message: "some error is occured in adding the item in to the cart",
                status: false,
                error
            });
        });
    }catch(error){
        res.status(400).send({
                message: "DO login first",
                status: false,
                error
            });
    }
});

cartRoute.delete('/:id/remove',async (req,res)=>{
    let token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if(!token){
        res.status(400).send({
            message: "Do log in first",
            status: false
        });
    }
    try{
        const tokenData = jwt.verify(token, secret);
        let productId = new mongoose.Types.ObjectId(req.params.id);
        await User.updateOne({_id: tokenData._id},{$pull: {cart: { $in : [productId]}}}).then((data)=>{
            console.log('hello'+productId+'go');
            res.status(200).send({
                message: "Item removed",
                status: true
            });
        }).catch((error)=>{
            console.log(error);
            res.status(500).send({
                message: 'Something went wrong! please try later',
                status: false
            });
        });
    }catch(error){
        console.log(error);
        res.status(400).send({
            message: "Do log in first",
            status: false,
            det: error
        });
    }
});

cartRoute.get("/",async (req,res)=>{
    let token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if(!token){
        res.send({
            message: "Do login to your account",
            state: false
        });
    }
    try{
        let result = jwt.verify(token, secret);
        await User.findOne({_id: result._id}).populate('cart').then((user)=>{
            res.send({
                data: user,
                status: true,
            });
        })
    }catch(error){
        res.send({
            message: "Log in to see your cart",
            status: false,
        });
    }
});


export default cartRoute;