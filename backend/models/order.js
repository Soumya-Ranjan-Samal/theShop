import {model, Schema} from "mongoose";

const orderSchema = Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    buyerId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    status: {
        type: String,
        enum: ["Shipping", "In warehouse", "On way"]
    }
});

const Order = model("Order",orderSchema);

export default Order;