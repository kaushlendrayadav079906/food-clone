import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food", // Ensure this matches your food model
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        }
    ],
    amount: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "Online"],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
    },
    paymentDetails: Object,
}, { timestamps: true });

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
