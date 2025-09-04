import express from 'express';
import Seller from '../models/seller.js';
import Order from '../models/order.js';
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import bcrypt from 'bcrypt';

configDotenv();

const salt = process.env.SALT;
const secret = process.env.SECRET;

const sellerRoute = express.Router({mergeParams: true});

sellerRoute.patch('/order/:id/update',async (req,res)=>{
    let token = req.headers?.authorization?.split(' ')[1];
    console.log(token);
    if(!token){
        res.status(400).send({message: 'You are not autherized to make changes', state: false});
    }try{
        let tokenData = jwt.verify(token, secret);
        let {state, deliveryDate} = req.body;
        let order = await Order.findOne({_id: req.params.id});
        if(state == 'Delivered'){
            opt = req.body.otp;
            if(otp != order.Otp){
                return res.status(400).send({
                    message: "Invalid OTP",
                    status: false
                });
            }
        }
        order.status = state;
        order.deliveryDate = deliveryDate;
        await order.save().then((result)=>{
            res.status(200).send({
                message: 'Updation successful',
                state: true
            });
        }).catch(()=>{
            res.status(500).send({
                message: "Some error occured in updation",
                state: false
            });
        });
    }catch(error){
        console.log(error);
        res.status(400).send({message: 'You are not autherized to make changes', state: false});
    }
});

sellerRoute.get('/account',async (req,res)=>{
    let token = req.headers.authorization?.split(' ')[1];
    if(!token){
        res.send({message: 'Log in to visit account', state: false});
    }try{
        let tokenData = jwt.verify(token, secret);
        await Seller.findOne({_id: tokenData._id}).then((data)=>{
            res.send({data: data, state: true});
        }).catch((error)=>{
            console.log(error);
            res.send({message: 'something went wrong please try later!', state: false})
        });
    }catch(error){
        console.log(error);
        res.send({message: 'Log in to visit account', state: false});
    }
});


sellerRoute.get('/account/:rname',async (req,res)=>{
    let token = req.headers.authorization?.split(' ')[1];
    if(!token){
        res.send({message: 'Log in to visit account', state: false});
    }try{
        let tokenData = jwt.verify(token, secret);
        if(req.params.rname == 'orders'){
            await Seller.findOne({_id: tokenData._id}).select('username companyName '+req.params.rname).populate({path: req.params.rname, populate: [{path: 'productId',select: '-review'},{path: 'buyerId',select: 'address email phone username'}], select: '-Otp'}).then((data)=>{
            
            res.send({data: data, state: true});
        }).catch((error)=>{
            console.log(error);
            res.send({message: 'something went wrong please try later!', state: false})
        });
        }else if(req.params.rname == 'products'){
            await Seller.findOne({_id: tokenData._id}).select('username companyName '+req.params.rname).populate(req.params.rname).then((data)=>{
            
            res.send({data: data, state: true});
        }).catch((error)=>{
            console.log(error);
            res.send({message: 'something went wrong please try later!', state: false})
        });
        }
        
    }catch(error){
        console.log(error);
        res.send({message: 'Log in to visit account', state: false});
    }
});

sellerRoute.post("/signup", async (req,res)=>{
    let data = req.body;
    if(data.phoneOtp != true || data.emailOtp != true){
        res.status(200).send({
            message: "The Otps are not verified",
            state: false,
        });
    }
    else{
        let isExist = await Seller.findOne({email : data.email});
        if(isExist){
            res.status(200).send({
                message : "User Already exist",
                state: false
            });
        }
        else{
            let hashedPassword = await bcrypt.hash(data.password,salt);
            let newUser = await Seller({
                username: data.username,
                email: data.email,
                phone: data.phone,
                address: data.address,
                password: hashedPassword,
                companyName: data.companyName,
            });
            await newUser.save().then((result)=>{
                let token = jwt.sign({
                    _id: result._id,
                },secret,{expiresIn: "12h"});
                res.status(200).send({
                    message: "Account creation successful",
                    state: true,
                    token: token,
                    _id: result._id,
                    person: "Seller"
                });
            }).catch((error)=>{
                res.status(200).send({
                    message: "Account creation unsuccessful",
                    state: false
                });
            });
        } 
    }
});

sellerRoute.post("/signin",async (req,res)=>{
    let data = req.body;
    let user = await Seller.findOne({email: data.email});
    if(!user){
        res.status(200).send({
            state: false,
            message: "No such account is found."
        });
    }else{
        let passwordCheck = await bcrypt.compare(data.password, user.password);
        if(passwordCheck){
            let token = jwt.sign({
                _id: user._id,
            },secret,{expiresIn: "12h"});
            res.status(200).send({
                message: "Welcome Back "+user.username,
                state: true,
                token: token,
                _id: user._id,
                person: "Seller"
            });
        }else{
            res.status(200).send({
                message: "Wrong password",
                state: false
            });
        }
    }
});

export default sellerRoute;