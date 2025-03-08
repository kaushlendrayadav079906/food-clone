import Cart from "../models/cartModel.js";
import User from "../models/user.Model.js"; 
import Food from "../models/foodModel.js";
import mongoose from "mongoose";

// ✅ Add item to cart
export const addToCart = async (req, res) => {
    const { userId, itemId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ message: "Invalid User ID or Item ID" });
    }

    try {
        const userExists = await User.findById(userId);
        const itemExists = await Food.findById(itemId);

        if (!userExists || !itemExists) {
            return res.status(404).json({ message: "User or Item not found" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [{ itemId, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex(item => item.itemId.toString() === itemId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ itemId, quantity });
            }
        }

        await cart.save();
        res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Remove single item from cart
export const removeFromCart = async (req, res) => {
    const { userId, itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ message: "Invalid User ID or Item ID" });
    }

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => item.itemId.toString() !== itemId);
        await cart.save();

        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Get user cart
export const getCart = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    try {
        const cart = await Cart.findOne({ userId }).populate("items.itemId");

        if (!cart || cart.items.length === 0) {
            return res.status(200).json({ items: [] }); // ✅ Return empty cart properly
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Clear entire cart
export const clearCart = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];  // ✅ Empty the cart
        await cart.save();

        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
