import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017");
      console.log('Connected to Wassapp');
    } catch (error) {
      console.log('Error connecting to MongoDB:', error);
    }
};

export default connectDB;