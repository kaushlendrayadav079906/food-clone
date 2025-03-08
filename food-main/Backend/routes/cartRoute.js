import express from "express";
import { addToCart, removeFromCart, getCart, clearCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/getCart/:userId", getCart);
router.delete("/removeItem/:userId/:itemId", removeFromCart);
router.delete("/clearCart/:userId", clearCart);  // ✅ Added Clear Cart API

export default router;
