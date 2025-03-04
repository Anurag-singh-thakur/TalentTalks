const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          
            });
            console.log('MongoDB Connected...');
    }
    catch (error) {
        console.error("MongoDB connection error " ,error.message);
        process.exit(1);
    }   
}

module.exports = connectDB;