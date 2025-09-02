import User from "../models/user.js";
import Seller from "../models/seller.js";
import jwt from "jsonwebtoken";
import { configDotenv } from 'dotenv';

configDotenv();

const salt = process.env.SALT;
const secret = process.env.SECRET;

const personStateCheck = async (req,res)=>{
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
}

export default personStateCheck;