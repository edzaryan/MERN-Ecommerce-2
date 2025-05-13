const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDb Connected Successfully.");
    } catch (err) {
        console.error("MongoDb connection failed.", err);
        process.exit(1);
    }
}

module.exports = connectDB;