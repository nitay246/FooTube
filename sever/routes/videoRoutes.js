import express from 'express';
import {
  createComment,
  getVideosForHomePage,
  addLike,
  addDislike,
  editComment,
  deleteComment,
  filterVideos
} from '../controllers/videoController.js';
import { verifyToken } from '../auth.js';

const router = express.Router();

// Route to get videos for the home page
router.route('/').get(getVideosForHomePage);

// Route to add a like to a video, requires token verification
router.post('/:id/like', verifyToken, addLike);

// Route to add a dislike to a video, requires token verification
router.post('/:id/dislike', verifyToken, addDislike);

// Route to create a comment on a video, requires token verification
router.post('/:videoId/comments', verifyToken, createComment);

// Route to edit a comment on a video, requires token verification
router.patch('/:videoId/comments/:index', verifyToken, editComment);

// Route to delete a comment on a video, requires token verification
router.delete('/:videoId/comments/:index', verifyToken, deleteComment);

// Route to filter videos based on some criteria
router.post('/filter', filterVideos);

// Export the router to be used in other parts of the application
export default router;
