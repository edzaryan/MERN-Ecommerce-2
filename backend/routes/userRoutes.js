const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if user already exists
        let existedUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (existedUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        // Create a new user instance
        let user = new User({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password.trim() // Assume password is hashed in model using pre-save middleware
        });

        // Save user to DB
        await user.save();

        // Create JWT payload
        const payload = { user: { id: user._id, role: user.role } };

        // Sign token with expiration
        const token = await new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: "40h" },
                (err, token) => {
                    if (err) reject(err);
                    else resolve(token);
                }
            );
        });

        // Send back user info and token
        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

/**
 * @route   POST /api/users/login
 * @desc    Login an existing user and return a token
 * @access  Public
 */
router.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;

        console.log(email, password);

        // Check if both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Clean input
        email = email.trim().toLowerCase();
        password = password.trim();

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password (uses custom instance method defined in User model)
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT payload
        const payload = { user: { id: user._id, role: user.role } };

        // Sign and return token
        const token = await new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: "40h" },
                (err, token) => {
                    if (err) reject(err);
                    else resolve(token);
                }
            );
        });

        // Return user info and token
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

/**
 * @route   GET /api/users/profile
 * @desc    Get current logged-in user's profile
 * @access  Private (must be authenticated)
 */
router.get("/profile", protect, async (req, res) => {
    // The `protect` middleware attaches the user to req.user if token is valid
    res.json(req.user);
});

module.exports = router;
