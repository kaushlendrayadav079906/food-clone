import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import foodRouter from "./routes/foodRouter.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRouter.js";
import authRouter from "./routes/auth.routes.js";
import { connectDB } from "./configs/db.config.js";

// Load environment variables
dotenv.config();

const app = express();

// CORS options
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
connectDB();

// Serve static images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/food", foodRouter);
app.use("/api/order", orderRouter);

const PORT = process.env.PORT || 8889;
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
