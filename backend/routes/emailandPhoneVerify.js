import  express from 'express';
import { emailOtps, phoneOtps } from '../utils/otpobject';


const otpVerifyRoute = express.Router({mergeParams: true});

otpVerifyRoute.post("/email",(req,res)=>{
    let email = req.body.email;
    let otp = req.body.emailOtp;
    if(otp == emailOtps[email]){
        console.log("correct");
        delete emailOtps[email];
        res.status(200).send("correct");
    }else{
        console.log("incorrect");
        delete emailOtps[email];
        res.status(200).send("incorrect");
    }
});

otpVerifyRoute.post("/verify/phone",(req,res)=>{
    let phone = req.body.phone;
    let otp = req.body.phoneOtp;
    console.log(otp,phoneOtps[phone]);
    if(otp == phoneOtps[phone]){
        console.log("correct");
        delete phoneOtps[phone];
        res.status(200).send("correct");
    }else{
        console.log("incorrect");
        delete phoneOtps[phone]
        res.status(200).send("incorrect");
    }
});

export default otpVerifyRoute;