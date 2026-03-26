import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try {
        const uri =
            process.env.MONGODB_URI === 'test'
                ? process.env.MONGODB_TEST_URI
                : process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};