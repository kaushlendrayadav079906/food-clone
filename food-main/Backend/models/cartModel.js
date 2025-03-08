import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
            quantity: { type: Number, default: 1, min: 1 },
        },
    ],
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
