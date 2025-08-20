import {model, Schema} from "mongoose";

const userSchema = Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    order: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    cart: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    password: {
        type: "String",
        required: true
    }
});

const User = model("User",userSchema);

export default User;