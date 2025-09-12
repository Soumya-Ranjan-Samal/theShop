import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    pictures: [{
        url: String,
        publicId: String,
    }],
    price: {
        type: String,
        required: true,
        min: 100,
        default: 100
    },
    Available: {
        type: Number,
        default: 0,
    },
    ProductSheller: {
        type: String,
    },
    catagory: [{
        type: String,
        enum: ["Electronics", "Fashion", "Home & Kitchen", "Health & Wellness", "Toys & Kids", "Books & Stationery", "Automobile Accessories", "Sports & Outdoor", "Pet Supplies"]
    }],
    Offer: {
        type: Number,
        min: 0,
        max: 80
    },
    specifications: [{
        type: String,
    }],
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
});


const Product = mongoose.model("Product",productSchema);



export default Product