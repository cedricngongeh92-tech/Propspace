import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.warn('MongoDB connection warning:', error.message);
    console.warn('Start MongoDB locally or update MONGO_URI in .env to use MongoDB Atlas.');
  }
};

export default connectDB;
