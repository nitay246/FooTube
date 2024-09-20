import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import videoRoutes from './routes/videoRoutes.js';
import userRoutes from './routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import net from 'net'; // Import the net module for TCP communication
import connectDB from './db.js';
import { generateTokenForUser } from './controllers/userController.js';

// Get the directory name in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
connectDB();

// Create an Express server
const server = express();

// Middleware to serve static files
server.use(express.static(path.join(__dirname, 'build')));

// Increase the request body size limit
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Middleware
server.use(cors());
server.use(express.json());

// Use routes
server.use('/api/videos', videoRoutes);
server.use('/api/users', userRoutes);
server.use('/api/tokens/', generateTokenForUser);

// Route to serve video files
server.get('/videowatch/:fileName', (req, res) => {
  const videoPath = path.join(__dirname, 'build', req.params.fileName);
  res.sendFile(videoPath);
});

// Start the server
server.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
