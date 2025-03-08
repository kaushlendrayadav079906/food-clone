import express from 'express';
import { addFood, listFood, getFoodById, removeFood } from '../controllers/foodController.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure images are stored in the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });
const foodRouter = express.Router();

// Routes
foodRouter.post('/add', upload.single('image'), addFood);
foodRouter.get('/list', listFood);
foodRouter.get('/:id', getFoodById); // Get food by ID
foodRouter.delete('/remove/:id', removeFood);

export default foodRouter;
