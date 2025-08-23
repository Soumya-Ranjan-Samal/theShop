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
// const client = await redis.createClient().on("error", (err) => console.log("Redis Client Error", err)).connect();


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());



// Server Routers ----------------------------------------------

let phoneOtps = {}
let emailOtps = {}

function getOtp(){
    return Math.floor(Math.random()*10) * 1000 + Math.floor(Math.random()*10) * 100 + Math.floor(Math.random()*10) * 10 + Math.floor(Math.random()*10);
}


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
})

app.post("/otp/email",(req,res)=>{
    let email = req.body.email;
    let otp = getOtp();
    console.log(otp,email);
    emailOtps[email] = otp;
    res.status(200).send("otp generated");
});

app.post("/otp/phone",(req,res)=>{
    let phone = req.body.phone;
    let otp = getOtp();
    console.log(otp,phone);
    phoneOtps[phone] = otp;
    res.status(200).send("otp generated");
});

app.post("/verify/email",(req,res)=>{
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

app.post("/verify/phone",(req,res)=>{
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

app.post("/user/signup", async (req,res)=>{
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
                    person: "User"
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

app.post("/user/signin",async (req,res)=>{
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
                message: "Account creation successful",
                state: true,
                token: token,
                person: "User"
            });
        }else{
            res.status(200).send({
                message: "Wrong password",
                state: false
            });
        }
    }
});

app.get('/order',async (req,res)=>{
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
})

app.post('/order', async (req, res) => {
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


app.post('/order/:id/:quantity', async (req, res) => {
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


app.patch('/order/cancel/:orderId',async (req,res)=>{
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
    if(order.buyerId != tokenData._id){
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



app.post("/user/cart/:id/add",async (req,res)=>{
    let token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if(!token){
        res.status(400).send({
            message: "Do login first",
            status: false
        });
    }
    try{
        let tokenData = jwt.verify(token, secret);
        User.findOneAndUpdate({_id: tokenData._id},{$push: {cart: req.params.id}}).then(()=>{
            res.status(200).send({
                message: "Item is added to cart",
                status: true,
            });
        }).catch((error)=>{
            res.status(500).send({
                message: "some error is occured in adding the item in to the cart",
                status: false,
                error
            });
        });
    }catch(error){
        res.status(400).send({
                message: "DO login first",
                status: false,
                error
            });
    }
});

app.delete('/user/cart/:id/remove',async (req,res)=>{
    let token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if(!token){
        res.status(400).send({
            message: "Do log in first",
            status: false
        });
    }
    try{
        const tokenData = jwt.verify(token, secret)
        await User.findOneAndUpdate({_id: tokenData._id},{$pull: {cart: req.params.id}}).then(()=>{
            res.status(200).send({
                message: "Item removed",
                status: true
            });
        })
    }catch(error){
        console.log(error);
        res.status(400).send({
            message: "Do log in first",
            status: false,
            det: error
        });
    }
});

app.get("/user/cart",async (req,res)=>{
    let token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if(!token){
        res.send({
            message: "Do login to your account",
            state: false
        });
    }
    try{
        let result = jwt.verify(token, secret);
        await User.findOne({_id: result._id}).populate('cart').then((user)=>{
            res.send({
                data: user,
                status: true,
            });
        })
    }catch(error){
        res.send({
            message: "Log in to see your cart",
            status: false,
        });
    }
});

app.post("/seller/signup", async (req,res)=>{
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

app.post("/seller/signin",async (req,res)=>{
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
                message: "Account creation successful",
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

app.get("/catagory/:value",async (req,res)=>{
    await Product.find({catagory: req.params.value}).then((data)=>{
        res.status(200).send(data);
    }).catch((error)=>{
        console.log(error);
    });
});

app.delete("/products/:id/review/:rid",async (req,res)=>{
    await Product.updateOne({_id: req.params.id},{$pull : {review: req.params.rid}}).then(async (result)=>{
        await Review.deleteOne({_id: req.params.rid}).then(()=>{
            res.status(200).send({success: "ok"})
        }).catch((error)=>{
            res.status(500).send({error: "error in deleteing the review from review collection", details: error});
        });
    }).catch((error)=>{
        res.status(500).send({error: "some error occured in removing review from product review list", details: error});
    });
});

app.post("/products/:id/review",async (req,res)=>{
    let review = await Review({
        ...req.body
    });
    await review.save().then(async (result)=>{
        await Product.updateOne({_id: req.params.id},{$push: {review: result._id}}).then((result2)=>{
            res.status(200).send(result2);
        }).catch((error)=>{
            console.log(error);
            res.status(500).send({error: "error in updating the product review", deatils: error});
        });
    }).catch((error)=>{
            console.log(error);
            res.status(500).send({error: "error in creating a new review", details: error});
    });
});


app.patch("/products/:id",async (req,res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        res.status(401).send({
            message: "Do Login First",
            state: false,
        });
    }
    let result = jwt.verify(token, secret);
    if(!result){
        res.status(403).send({
            message: "Do Login First",
            state: false,
        });
    }
    let data = req.body;
    let product = await findOne({_id: data._id});
    if(result._id == product.sellerId){
    await Product.findOneAndUpdate({_id: req.params.id},data,{ new: true } ).populate("review").then((result)=>{
        let avgrating = 0;
        let len = result.review.length;
        for(let i=0;i<len;i++){
            avgrating+=result.review[i].rating;
        }
        res.status(200).send({...result._doc, avgrating: avgrating/len});
    }).catch((error)=>{
        console.log(error);
        res.status(500).send({
            error: true,
            message: error
        });
    });
    }else{
        res.status(403).send({
            message: "you are not the owner",
            state: false,
        });
    }
});

app.get("/products/:id",async (req,res)=>{
    await Product.findOne({_id: req.params.id}).populate("review").then((result)=>{
        let avgrating = 0;
        let len = result.review.length;
        for(let i=0;i<len;i++){
            avgrating+=result.review[i].rating;
        }
        let token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        let tokenData = false;
        try{
            tokenData = jwt.verify(token, secret);
            if(tokenData._id == result.sellerId){
                tokenData = true;
            }else{
                tokenData = false
            }
        }catch(error){
            console.log(error);
            tokenData = false
        }
        res.status(200).send({...result._doc, avgrating: avgrating/len,tokenData});
    }).catch((error)=>{
        console.log(error);
        res.status(500).send({
            error: true,
            message: error
        });
    });
});

app.get("/products/:id/edit",async (req,res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        res.status(401).send({
            message: "Do Login First",
            state: false,
        });
    }
    try{
        let result = jwt.verify(token, secret);
        await Product.findOne({_id: req.params.id}).then((product)=>{
            if(result._id == product.sellerId){
                res.status(200).send({...product._doc});
            }else{
                res.status(403).send({
                    message: "you are not the owner",
                    state: false,
                });
            }
        }).catch((error)=>{
            console.log(error);
            res.status(500).send({
                error: true,
                message: error
            });
        });
    }
    catch{
        res.status(403).send({
            message: "Do Login First",
            state: false,
        });
    }
});

app.get("/products",async (req,res)=>{
    let data = await Product.find({});
    res.send(data);
});

app.post("/products", async (req,res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        res.status(401).send({
            message: "Do Login First",
            state: false,
        });
    }
    let result = jwt.verify(token, secret);
    let newproduct = await Product({
        ...req.body,
        sellerId: result._id,
    });
    await newproduct.save().then(async (productdata)=>{
        await Seller.updateOne({_id: result._id},{$push : {products: productdata._id}}).then(()=>{
            res.status(200).send({
                message: "New Product Added",
                _id: productdata._id
            });
        }).catch((error)=>{
            res.status(403).send({
                message: "No updation occured in sellers account",
                state: false,
            });
        })
    }).catch((error)=>{
        res.status(500).send({
            error: "some error occured in saving the data",
            details: error
        });
    });
});

app.delete("/products/:id/delete",async(req,res)=>{
    let authHeader = req.headers.authorization;
    let token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.json({
            status: false,
            message: "Invalid token, Login first",
        });
    }
    try{
        let result = jwt.verify(token, secret);
        await Product.findOneAndDelete({_id: req.params.id, sellerId: result._id}).then(async (data)=>{
            await User.updateOne({_id: result._id},{$pull : {products : data._id}}).then(()=>{
                res.send({
                    status: true,
                    message: "successfull deletion"
                });
            }).catch(()=>{
                res.send({
                    status: false,
                    message: "no updation in seller's account"
                });
            })
        }).catch(()=>{
            res.send({
                status: false,
                message: "there is some issue in deleting the product",
            });
        })
    }catch{
        res.send({
            status: false,
            message: "Do Login first",
        });
    }
});


// app.post("/products/:id/sell",async (req,res)=>{
//     await Product.findOne({_id: req.params.id}).then(async (result)=>{
//         result.Available-=1
//         let updatedcount = await result.save();
//         // create order
//     })
// })


app.get("/",(req,res)=>{
    res.send("The Shop");
});


app.listen(port,()=>{
    console.log("serverstarted listening...");
});
