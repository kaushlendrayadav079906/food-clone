const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user_model = require('./models/user.model');

const secret = 'yourSecretKey'; // Replace with environment variable in production

// Middleware to verify signup body
exports.verifySignUpBody = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).send({ message: "Missing required fields: name, email, or password" });
        }

        // Check if user already exists by email
        const existingUser = await user_model.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "User with this email already exists" });
        }

        next();
    } catch (err) {
        console.error("Error while validating signup data:", err);
        res.status(500).send({ message: "Error while validating signup data" });
    }
};

// Signup function
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await user_model.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: `User ${newUser.name} created successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred during signup' });
    }
};

// Signin function
exports.signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await user_model.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });

        res.status(200).json({ token, name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred during signin' });
    }
};
