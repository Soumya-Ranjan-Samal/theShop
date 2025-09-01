import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Product from "./models/product.js";
import Review from "./models/review.js";
import User from "./models/user.js";
import Seller from "./models/seller.js";
import Order from "./models/order.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import productRoute from "./routes/product.js";
import reviewRoute from "./routes/review.js";
import userRoute from "./routes/user.js";
import sellerRoute from "./routes/seller.js";
import cartRoute from "./routes/userCart.js";
import orderRoute from "./routes/order.js";
import otpRoute from "./routes/emailandPhoneOtp.js";
import otpVerifyRoute from "./routes/emailandPhoneVerify.js";



// Data base connection ----------------------------------------
connect().then(()=>{
    console.log("Database connected...");
}).catch((error)=>{
    console.log("Error in Database Connection: \n"+error)
});
async function connect(){
    await mongoose.connect("mongodb://localhost:27017/theShop");
}

// Server settings ---------------------------------------------
const app = express();
const port = 3000;
const salt = 10;
const secret = "mySecretKey"; 


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());



// Server Routers ----------------------------------------------




app.get('/check/person/state',async (req,res)=>{
    let token = req.headers.authorization?.split(' ')[1];
    if(!token){
        res.send({state: ''});
    }try{
        let tokenData = jwt.verify(token, secret);
        if(await User.findOne({_id: tokenData._id})){
            return res.send({state: 'User'})
        }
        if(await Seller.findOne({_id: tokenData._id})){
            return res.send({state: 'Seller'})
        }
    }catch(error){
        console.log(error);
        res.send({state: ''});
    }
});

app.patch('/seller/order/:id/update',async (req,res)=>{
    let token = req.headers.authorization?.split(' ')[1];
    if(!token){
        res.send({message: 'You are not autherized to make changes', state: false});
    }try{
        let tokenData = jwt.verify(token, secret);
        let {state, deliveryDate} = req.body;

        let order = await Order.findOne({_id: req.body.id});
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
        res.send({message: 'You are not autherized to make changes', state: false});
    }
});

app.get('/user/account',async (req,res)=>{
    let token = req.headers.authorization?.split(' ')[1];
    if(!token){
        res.send({message: 'Log in to visit account', state: false});
    }try{
        let tokenData = jwt.verify(token, secret);
        await User.findOne({_id: tokenData._id}).then((data)=>{
            res.send({data: data, state: true});
        }).catch((error)=>{
            console.log(error);
            res.send({message: 'something went wrong please try later!', state: false})
        })
    }catch(error){
        console.log(error);
        res.send({message: 'Log in to visit account', state: false});
    }
});

app.get('/seller/account',async (req,res)=>{
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

app.get('/seller/account/:rname',async (req,res)=>{
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

app.use('/otp', otpRoute);

app.use('/verify', otpVerifyRoute);

app.use('/user', userRoute);

app.use('/order', orderRoute);

app.use('/user/cart', cartRoute);
 
app.use('/seller', sellerRoute);

app.use('/products/:id/review', reviewRoute);

app.use('/products', productRoute);

app.get("/",(req,res)=>{
    res.send("The Shop");
});

app.listen(port,()=>{
    console.log("serverstarted listening...");
});
