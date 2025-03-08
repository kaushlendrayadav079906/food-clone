const user_model = require('./models/user.model');

exports.verifySignUpBody = async (req, res, next) => {
    try {
        // Check for required fields
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).send({
                message: "Missing required fields: name, email, userId, or password",
            });
        }

        // Check if a user with the same userId already exists
        const existingUser = await user_model.findOne({ userId });
        if (existingUser) {
            return res.status(400).send({
                message: "User with the same userId already exists",
            });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error("Error while validating signup data:", err);
        res.status(500).send({ message: "Error while validating signup data" });
    }
};