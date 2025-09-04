import express from 'express';
import jwt from "jsonwebtoken";
import Order from '../models/order.js';
import Seller from '../models/seller.js';
import User from '../models/user.js';
import Product from '../models/product.js';
import { getOtp } from '../utils/otpobject.js';
import { configDotenv } from 'dotenv';

configDotenv();

const secret = process.env.SECRET;

const orderRoute = express.Router({mergeParams: true});

orderRoute.get('/',async (req,res)=>{
 const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).send({
      message: "Do login first",
      status: false
    });
  }
  try{
    let tokenData = jwt.verify(token,secret);
    let result = await Order.find({buyerId: tokenData._id}).populate('productId');
    res.status(200).send({data : result});
  }catch(error){
    console.log(error);
    res.status(400).send({message: "Do login first", status: false});
  }
});

orderRoute.post('/', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).send({
      message: "Do login first",
      status: false
    });
  }

  try {
    const tokenData = jwt.verify(token, secret);
    const productIds = req.body.orders;
    const quantity = req.body.quantity;

    const products = await Product.find({
      _id: { $in: productIds },
      Available: { $gt: 0 }
    }).populate('sellerId');

    for (let i = 0; i < products.length; i++) {
      const el = products[i];
      const estimatedDeliveryDate = new Date();
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);

      const order = new Order({
        buyerId: tokenData._id,
        sellerId: el.sellerId,
        productId: el._id,
        quantity: quantity[i],
        totalAmount: el.price - (el.price * el.Offer / 100),
        deliveryDate: estimatedDeliveryDate,
        Otp: getOtp()
      });

      const result = await order.save();
      console.log(result);
      await Seller.updateOne({ _id: el.sellerId }, { $push: { orders: result._id } });
      await User.updateOne({ _id: tokenData._id }, { $push: { order: result._id } });

    }

    return res.status(200).send({
      message: 'All orders placed successfully',
      status: true
    });

  } catch (error) {
    console.log(error, Date.now());
    return res.status(500).send({
      message: "Something went wrong",
      status: false,
      error
    });
  }
});

orderRoute.post('/:id/:quantity', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).send({
      message: "Do login first",
      status: false
    });
  }

  try {
    const tokenData = jwt.verify(token, secret);
    const productId = req.params.id;
    const quantity = req.params.quantity;

    const products = await Product.findOneAndUpdate({
      _id: { $in: productId },
      Available: { $gt: 0 }
    },{$inc : {Available : -quantity }}).populate('sellerId');

      const el = products;
      const estimatedDeliveryDate = new Date();
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);

      const order = new Order({
        buyerId: tokenData._id,
        sellerId: el.sellerId,
        productId: el._id,
        quantity: quantity,
        totalAmount: el.price - (el.price * el.Offer / 100),
        deliveryDate: estimatedDeliveryDate,
        Otp: getOtp()
      });

      const result = await order.save();
      await Seller.updateOne({ _id: el.sellerId }, { $push: { orders: result._id } });
      await User.updateOne({ _id: tokenData._id }, { $push: { order: result._id }, $pull : {cart: products._id} });


    return res.status(200).send({
      message: 'All orders placed successfully',
      status: true
    });

  } catch (error) {
    console.log(error, Date.now());
    return res.status(500).send({
      message: "Something went wrong",
      status: false,
      error
    });
  }
});

orderRoute.patch('/cancel/:orderId',async (req,res)=>{
    const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).send({
      message: "Do login first",
      status: false
    });
  }

  try {
    const tokenData = jwt.verify(token, secret);
    
    let order = await Order.findOne({_id: req.params.orderId});
    if(!order){
        return res.status(400).send({message: 'Wrong order detils',status: false});
    } 
    if(order.buyerId != tokenData._id && order.sellerId != tokenData._id){
        return res.status(400).send({message: 'This is not your order',status: false});
    }
    if(order.status !== 'Placed') {
        return res.status(400).send({ message: 'Order cannot be cancelled after packing', status: false });
    }

    order.isCancelled=true;
    order.cancelledAt = Date.now();
    order.cancelReason = req.body.cancelReason;

    await Product.findOneAndUpdate({_id: order.productId}, {$inc: {Available: order.quantity}});

    await order.save();

    return res.status(200).send({
      message: 'Orders Cancelled successfully',
      status: true
    });

  } catch (error) {
    console.log(error, Date.now());
    return res.status(500).send({
      message: "Something went wrong",
      status: false,
      error
    });
  }
});

export default orderRoute;