const mongoose = require('mongoose');
const logger = require('../utils/logger');

const dotenv = require('dotenv');
dotenv.config();
const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI)
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("MongoDB connected")
        logger.info('MongoDB connected');
    } catch (error) {
        logger.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
