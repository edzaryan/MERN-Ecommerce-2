const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@admin.com",
            password: "123456",
            role: "admin"
        });

        const userID = createdUser._id;

        const sampleProducts = products.map(product => {
            return { ...product, user: userID };
        });

        await Product.insertMany(sampleProducts);

        console.log("Product data seeded successfully.");
        process.exit();
    } catch (error) {
        console.log("Error seeding the data:", error);
        process.exit(1);
    }
}

seedData();
