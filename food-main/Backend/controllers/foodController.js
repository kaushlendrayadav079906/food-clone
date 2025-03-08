import foodModel from '../models/foodModel.js';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation

// Add Food Item
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newFood = new foodModel({
      name,
      description,
      price: Number(price),
      category,
      image: req.file.filename, // Save only filename
    });

    await newFood.save();
    res.status(201).json({ success: true, message: 'Food added successfully', data: newFood });
  } catch (error) {
    console.error('Error adding food:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// List All Food Items
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    if (!foods.length) {
      return res.status(404).json({ success: false, message: 'No food items found' });
    }
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    console.error('Error fetching food items:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get Food Item by ID
const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the id format using mongoose.Types.ObjectId.isValid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid food id format' });
    }

    const foodItem = await foodModel.findById(id);
    if (!foodItem) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.status(200).json({ success: true, data: foodItem });
  } catch (error) {
    console.error('Error fetching food item:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Remove Food Item
const removeFood = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the id format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid food id format' });
    }

    const food = await foodModel.findById(id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    // Delete the image file if it exists
    if (food.image) {
      const imagePath = path.join('uploads', food.image);
      try {
        await fs.access(imagePath); // Check if file exists
        await fs.unlink(imagePath); // Delete if it exists
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }

    await foodModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Food removed successfully' });
  } catch (error) {
    console.error('Error removing food:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export { addFood, listFood, getFoodById, removeFood };
