import express from 'express';
import { 
  getUserInfo, 
  getUserVideos, 
  signup, 
  generateTokenForUser, 
  deleteUser, 
  updateUser,
  updateRecommend,
  getRecommendedVideos, 
  addingVideo 
} from '../controllers/userController.js';
import { 
  getVideobyUser, 
  deleteVideo, 
  updateVideo, 
  incrementViews 
} from '../controllers/videoController.js';
import multer from 'multer';
import { verifyToken } from '../auth.js';

const router = express.Router();

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'build/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize multer with the configured storage
const upload = multer({ storage: storage });

router.post('/:userId/updateRecommend/:videoId', updateRecommend);

router.get('/:userId/recommendedVideo/:videoId', getRecommendedVideos);

// Route to increment views for a specific video
router.post('/:creator/videos/:id/views', incrementViews);

// Route to get a specific video by its ID and creator
router.get('/:creator/videos/:id', getVideobyUser);

// Route to delete a specific video by its ID and creator (requires token verification)
router.delete('/:creator/videos/:id', verifyToken, deleteVideo);

// Route to update a specific video by its ID and creator (requires token verification)
router.patch('/:creator/videos/:id', verifyToken, updateVideo);

// Route to sign up a new user
router.post('/', signup);

// Route to get user information by user ID
router.get('/:id', getUserInfo);

// Route to get videos of a specific user by user ID
router.get('/:id/videos', getUserVideos);

// Route to delete a specific user by user ID (requires token verification)
router.delete('/:id', verifyToken, deleteUser);

// Route to update user information by user ID (requires token verification)
router.patch('/:id', verifyToken, updateUser);

// Route to add a new video for a specific user by user ID (requires token verification)
router.post('/:id/videos', verifyToken, upload.single('file'), addingVideo);

export default router;
