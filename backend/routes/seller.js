import express from 'express';
import Seller from '../models/seller.js';
import jwt from "jsonwebtoken";

const sellerRoute = express.Router({mergeParams: true});

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