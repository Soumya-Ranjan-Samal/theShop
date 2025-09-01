import  express from 'express';
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const userRoute = express.Router({mergeParams: true});

userRoute.post("/signup", async (req,res)=>{
    let data = req.body;
    if(data.phoneOtp != true || data.emailOtp != true){
        res.status(200).send({
            message: "The Otps are not verified",
            state: false,
        });
    }
    else{
        let isExist = await User.findOne({email : data.email});
        if(isExist){
            res.status(200).send({
                message : "User Already exist",
                state: false
            });
        }
        else{
            let hashedPassword = await bcrypt.hash(data.password,salt);
            let newUser = await User({
                username: data.username,
                email: data.email,
                phone: data.phone,
                address: data.address,
                password: hashedPassword,
            });
            await newUser.save().then((result)=>{
                let token = jwt.sign({
                    _id: result._id,
                },secret,{expiresIn: "12h"});
                res.status(200).send({
                    message: "Account creation successful",
                    state: true,
                    token: token,
                    person: "User",
                    _id: result._id
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

userRoute.post("/signin",async (req,res)=>{
    let data = req.body;
    let user = await User.findOne({email: data.email});
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
                message: "Welcome back "+user.username,
                state: true,
                token: token,
                person: "User",
                _id: user._id
            });
        }else{
            res.status(200).send({
                message: "Wrong password",
                state: false
            });
        }
    }
});


export default userRoute;