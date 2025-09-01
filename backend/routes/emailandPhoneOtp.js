import  express from 'express';
import { getOtp, emailOtps, phoneOtps } from '../utils/otpobject.js';


const otpRoute = express.Router({mergeParams: true});

otpRoute.post("/email",(req,res)=>{
    let email = req.body.email;
    let otp = getOtp();
    console.log(otp,email);
    emailOtps[email] = otp;
    res.status(200).send("otp generated");
});

otpRoute.post("/phone",(req,res)=>{
    let phone = req.body.phone;
    let otp = getOtp();
    console.log(otp,phone);
    phoneOtps[phone] = otp;
    res.status(200).send("otp generated");
});

export default otpRoute;