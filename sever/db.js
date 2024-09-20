import mongoose from 'mongoose';

const connectDB = async () => {
  // Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/data')

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`Error connecting to MongoDB: ${err}`);
});
};

export default connectDB;
