import jwt from "jsonwebtoken";
const secret = "mySecretKey";

let authenticate = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        res.status(401).send({
            message: "Do Login First",
            state: false,
        });
    }
    let result = jwt.verify(token, secret);
    if(result){
        next();
    }else{
        res.status(401).send({
            message: "Do Login First",
            state: false,
        });
    }
}