import { Video } from '../models/Video.js';

// Service function to delete a video by its ID and creator
const deleteVideoSer = async (id, creator) => {
  const video = await Video.findOneAndDelete({ _id: id, creator });
  return video;
};

// Service function to add a comment to a video
const addCommentToVideo = async (videoId, comment) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error('Video not found');
    }

    video.comments.push(comment); // Add the comment to the video's comments array
    await video.save(); // Save the updated video
    // Find the newly added comment
    const newComment = video.comments[video.comments.length - 1];
    return newComment; // Return only the new comment object
  } catch (error) {
    console.error(error); // Log the error for better debugging
    throw new Error('Failed to add comment');
  }
};

// Service function to get the top and random videos
const getTopAndRandomVideos = async () => {
  try {
    // Get the 10 most viewed videos
    const topVideos = await Video.find().sort({ views: -1 }).limit(10);

    // Extract the IDs of the top 10 most viewed videos
    const topVideoIds = topVideos.map(video => video._id);

    // Get 10 random videos excluding the top 10 most viewed videos
    const randomVideos = await Video.aggregate([
      { $match: { _id: { $nin: topVideoIds } } },
      { $sample: { size: 10 } }
    ]);

    // Combine the two arrays
    const combinedVideos = topVideos.concat(randomVideos);

    return combinedVideos;
  } catch (error) {
    console.error('Failed to retrieve videos:', error);
    throw new Error('Failed to retrieve videos');
  }
};

// Service function to update a video's title and description
const updateVideoSer = async (id, creator, title, description) => {
  const updatedVideo = await Video.findOneAndUpdate(
    { _id: id, creator: creator },
    { title, description },
    { new: true } // returns the updated document
  );
  return updatedVideo;
};

// Service function to get a video by its ID
const getVideobyUserSer = async (id) => {
  const video = await Video.findById(id);
  return video;
};

// Service function to add a like to a video
const addLikeSer = async (id, userId) => {
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  if (video.likedBy && video.likedBy.includes(userId)) {
    return video;
  }

  if (video.dislikedBy && video.dislikedBy.includes(userId)) {
    video.dislikes -= 1;
    video.dislikedBy.pull(userId);
  }

  video.likes += 1;
  video.likedBy.push(userId);

  await video.save();
  return video;
};

// Service function to add a dislike to a video
const addDislikeSer = async (id, userId) => {
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  if (video.dislikedBy && video.dislikedBy.includes(userId)) {
    return video;
  }

  if (video.likedBy && video.likedBy.includes(userId)) {
    video.likes -= 1;
    video.likedBy.pull(userId);
  }

  video.dislikes += 1;
  video.dislikedBy.push(userId);

  await video.save();
  return video;
};

// Service function to edit a comment on a video
const editCommentSer = async (videoId, index, text) => {
  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }

  if (index < 0 || index >= video.comments.length) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  video.comments[index].text = text;
  // Explicitly mark the comments array as modified
  video.markModified('comments');
  await video.save();
  return video;
};

// Service function to delete a comment from a video
const deleteCommentSer = async (videoId, index) => {
  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }

  if (index < 0 || index >= video.comments.length) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  video.comments.splice(index, 1);
  await video.save();
  return video;
};

// Service function to increment the view count of a video
const incrementViewsSer = async (id) => {
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }
  video.views += 1;
  await video.save();
  return video;
};

export { 
  deleteVideoSer, 
  addCommentToVideo, 
  getTopAndRandomVideos, 
  updateVideoSer, 
  getVideobyUserSer, 
  addLikeSer, 
  addDislikeSer, 
  editCommentSer, 
  deleteCommentSer, 
  incrementViewsSer 
};
