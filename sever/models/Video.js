import mongoose from 'mongoose';

// Define the schema for a video
const videoSchema = new mongoose.Schema({
  title: String, // Title of the video
  description: String, // Description of the video
  source: String, // Source URL or path of the video
  views: Number, // Number of views the video has
  uploadtime: { type: Date, default: Date.now }, // Time when the video was uploaded
  comments: Array, // Array of comments on the video
  creatorName: String, // Name of the video's creator
  likes: { type: Number, default: 0 }, // Number of likes, default is 0
  dislikes: { type: Number, default: 0 }, // Number of dislikes, default is 0
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], // Array of user IDs who liked the video
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], // Array of user IDs who disliked the video
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who created the video
});

// Create an index on the views field for sorting in descending order
videoSchema.index({ views: -1 });

// Create a Mongoose model for the video schema
export const Video = mongoose.model('Video', videoSchema);