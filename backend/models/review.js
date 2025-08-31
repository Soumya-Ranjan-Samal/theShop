import mongoose, {Schema, model} from "mongoose";

const reviewSchema = Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    on: {
        type: Date,
        default: Date.now()
    }
});

const Review = model("Review", reviewSchema);

export default Review;