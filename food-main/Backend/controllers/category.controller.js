const category_model = require("../models/category.model");

// Controller for creating the category
exports.createNewCategory = async (req, res) => {
    // Read the req body
    const cat_data = {
        name: req.body.name,
        description: req.body.description // Fixed typo: req.boy to req.body
    };

    try {
        // Insert into MongoDB
        const category = await category_model.create(cat_data);
        return res.status(201).send(category);
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).send({
            message: "Error while creating the category" // Fixed typo: "create the categoory" to "creating the category"
        });
    }
};