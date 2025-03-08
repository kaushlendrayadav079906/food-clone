import orderModel from "../models/orderModel.js";
import userModel from "../models/user.Model.js"; 
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});

export const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentMethod, paymentStatus, paymentDetails } = req.body;

        if (!userId || !items || !items.length || !amount || !address || !paymentMethod) {
            return res.status(400).json({ success: false, message: "Missing required fields in order request" });
        }

        // Validate foodId inside items array
        for (let item of items) {
            if (!item.foodId) {
                return res.status(400).json({ success: false, message: "Each item must include a foodId" });
            }
        }

        let finalPaymentStatus = paymentStatus || "Pending";
        let finalPaymentDetails = paymentDetails || {};

        // 🛑 Dummy Payment Handling
        if (paymentMethod === "DUMMY") {
            finalPaymentStatus = "Completed"; // Fake successful payment
            finalPaymentDetails = {
                transactionId: "DUMMY123456",
                method: "DUMMY",
                status: "success",
            };
        }

        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod,
            paymentStatus: finalPaymentStatus,
            paymentDetails: finalPaymentDetails,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        console.error("Error placing order:", error.message);
        res.status(500).json({ success: false, message: "Error placing order.", error: error.message });
    }
};

// Verify Order Controller
export const verifyOrder = async (req, res) => {
    try {
        const { paymentId, orderId, signature } = req.body;

        if (!paymentId || !orderId || !signature) {
            return res.status(400).json({ success: false, message: "Invalid payment details" });
        }

        // Example: Add logic to verify the payment with Razorpay
        res.json({ success: true, message: "Order verified successfully!" });

    } catch (error) {
        console.error("Error verifying order:", error.message);
        res.status(500).json({ success: false, message: "Error verifying order.", error: error.message });
    }
};

// Fetch User Orders Controller
export const userorders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching user orders:", error.message);
        res.status(500).json({ success: false, message: "Error fetching user orders.", error: error.message });
    }
};

// Fetch All Orders (Admin View)
export const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find().populate("userId", "name email").sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching all orders:", error.message);
        res.status(500).json({ success: false, message: "Error fetching all orders.", error: error.message });
    }
};
