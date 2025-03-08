import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // Price should be a number
    image: { type: String, required: true },
    category: { type: String, required: true },
});

const Food = mongoose.models.Food || mongoose.model("Food", foodSchema);
export default Food;
