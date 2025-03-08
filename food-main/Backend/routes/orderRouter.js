import express from "express";
import { placeOrder, verifyOrder, userorders, listOrders } from "../controllers/orderController.js";

const orderRouter = express.Router();

// Middleware for debugging
const foodMiddleware = (req, res, next) => {
    console.log("Food middleware is running");
    next();
};

// Routes
orderRouter.post("/place", foodMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", userorders);
orderRouter.get("/list", listOrders);

export default orderRouter;
