const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || ' mongodb://127.0.0.1:27017/Travel_Budget?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.1';
if (!process.env.MONGO_URI) {
    console.warn('Warning: MONGO_URI is not set. Using default value.');
}

const connectdb = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("mongo DB now connected to your server");
    } catch (error) {
        console.error(`Connection error to ${MONGO_URI}:`, error);
    }
}

module.exports = connectdb;