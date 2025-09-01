import  express from 'express';
import Product from '../models/product.js';
import User from "../models/user.js";
import Review from "../models/review.js";
import jwt from "jsonwebtoken";

const reviewRoute = express.Router({mergeParams: true});

reviewRoute.post("/",async (req,res)=>{
    let token = req.headers?.authorization.split(' ')[1]
    if(! token){
        res.status(400).send({
            message: 'You are not loged in',
            status: false
        })
    }
    try{
        let tokenData = jwt.verify(token, secret);
        
        let userInfo = await User.findOne({_id: tokenData._id}).select('order').populate({path: 'order', select: 'status productId'});
        let check = false;

        for(const el of userInfo.order){
            if(el.productId == req.params.id && el.status == 'Delivered'){
                check = true;
                break;
            }
        }
        if(check == false){
            return res.status(400).send({
                message: 'You have to Buy this before giving any feedback',
                status: false
            });
        }
        let review = Review({
            ...req.body,
            userId: userInfo._id,
        });
        await review.save().then(async (result)=>{
            await Product.updateOne({_id: req.params.id},{$push: {review: result._id}}).then((result2)=>{
                return res.status(200).send(result2);
            }).catch((error)=>{
                console.log(error);
                return res.status(500).send({error: "error in updating the product review", deatils: error});
            });
        }).catch((error)=>{
            console.log(error);
            return res.status(500).send({error: "error in creating a new review", details: error});
        });
    }
    catch(error){
        console.log('Error in creating a review ',error);
        res.status(400).send({
            message: 'You are not loged in',
            status: false
        });
    }
});


reviewRoute.delete("/:rid",async (req,res)=>{
    let token = req.headers?.authorization?.split(' ')[1];
    if(!token){
        return  res.status(400).send({
            message: 'Do log in first',
            status: false
        });
    }
    try{
        let tokenData = jwt.verify(token, secret);
        
        let review = await Review.findOneAndDelete({_id: req.params.rid, userId: tokenData._id});
        if(!review){
            returres.status(400).send({
                message: 'You are not the reviewer',
                status: false,
            });
        }
        await Product.findOneAndUpdate({_id: req.params.id},{$pull: {review: review._id}}).then(()=>{
            res.status(200).send({success: "ok"});
        }).catch((error)=>{
            res.status(500).send({error: "some error occured in removing review from product review list", details: error});
        });
    }catch(error){
        console.log(error);
        res.status(400).send({
            message: "Do log in first",
            status: false,
        });
    }
});

export default reviewRoute;
