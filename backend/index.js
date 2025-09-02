import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRoute from "./routes/product.js";
import reviewRoute from "./routes/review.js";
import userRoute from "./routes/user.js";
import sellerRoute from "./routes/seller.js";
import cartRoute from "./routes/userCart.js";
import orderRoute from "./routes/order.js";
import otpRoute from "./routes/emailandPhoneOtp.js";
import otpVerifyRoute from "./routes/emailandPhoneVerify.js";
import personStateCheck from "./utils/personStateCheck.js";
import { configDotenv } from 'dotenv';

// Enviorment veriable configuration ---------------------------

configDotenv();

// Server settings ---------------------------------------------

const app = express();
const port = process.env.PORT;
const salt = process.env.SALT;
const secret = process.env.SECRET;
const mongodb_url = process.env.MONGODB_URL;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

// Data base connection ----------------------------------------

connect().then(()=>{
    console.log("Database connected...");
}).catch((error)=>{
    console.log("Error in Database Connection: \n"+error)
});
async function connect(){
    await mongoose.connect(mongodb_url);
}

// Server Routers ----------------------------------------------

app.get('/check/person/state', personStateCheck); // checks the state of the person if he/ is loged in or not

app.use('/otp', otpRoute);

app.use('/verify', otpVerifyRoute);

app.use('/user', userRoute);

app.use('/order', orderRoute);

app.use('/user/cart', cartRoute);
 
app.use('/seller', sellerRoute);

app.use('/products/:id/review', reviewRoute);

app.use('/products', productRoute);

app.get("/",(req,res)=> res.send("The Shop") );

app.listen(port,()=>{
    console.log("serverstarted listening...");
});
