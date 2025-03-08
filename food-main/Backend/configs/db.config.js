import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://kaushl:kaushl079906@cluster0.n1s3d.mongodb.net/food-del");
        console.log("DB Connected");
    } catch (error) {
        console.error("Error connecting to DB:", error);
        throw error;
    }
};
