import {model, Schema} from "mongoose";

const sellerSchema = Schema({
    username: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    password: {
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
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }]
});

const Seller = model("Seller",sellerSchema);

export default Seller;