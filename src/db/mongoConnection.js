import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://vejegamarcos:vHM02ycTEP8oJj0S@marcos.gegllmp.mongodb.net/wassapp");
      console.log('Connected to Wassapp');
    } catch (error) {
      console.log('Error connecting to MongoDB:', error);
    }
};

export default connectDB;