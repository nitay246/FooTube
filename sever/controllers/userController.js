import { vi } from '@faker-js/faker';
import { generateToken } from '../auth.js';
import { User } from '../models/users.js';
import { Video } from '../models/Video.js';
import {getUserByUsernameSer, createUserSer, getUserInfoSer, getUserVideosSer,
   deleteUserSer, updateUserSer, addingVideoSer } from '../services/userServices.js';
import { getTopAndRandomVideos } from '../services/videoService.js';
import net from 'net'; // Import the net module for TCP communication

   const userThreads = new Map(); // Store threads or connections by user ID
   
const generateTokenForUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsernameSer(username, password);
    const token = generateToken(user);
   
    // Establish a TCP connection for the user
    const client = new net.Socket();
    const ip_address = '127.0.0.1';
    const port_no = 5555;
   
    client.connect(port_no, ip_address, () => {
      console.log(`User ${user.username} connected to the server`);
      client.write(`${user._id}`);
    });
   
    // Handle incoming data from the server
    client.on('data', (data) => {
      console.log(`Received for user ${user.username}:`, data.toString());
    });
   
    // Handle the connection closing
    client.on('close', () => {
      console.log(`Connection closed for user ${user.username}`);
    });
   
    // Handle errors
    client.on('error', (error) => {
      console.error(`Error for user ${user.username}:`, error);
   });
    // Store the connection in the map
    const userId = user._id.toString();
    userThreads.set(userId, client);
    //console.log("userThreads", userThreads)
   
    res.status(200).json({ user, token });
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
};
   
// Controller function for user signup
const signup = async (req, res) => {
  try {
    // Create a new user using the createUserSer service
    const createdUser = await createUserSer(req.body.username, req.body.displayname, req.body.password, req.body.img);
    res.json(createdUser);
  } catch (error) {
    // Handle username already taken error
    if (error.message === 'Username already taken') {
      res.status(409).json({ message: error.message });
    } {
      res.status(500).json({ message: error.message });
    }
  }
};

// Controller function to get user information by ID
const getUserInfo = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await getUserInfoSer(userId)
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details' });
  }
};

// Controller function to get user videos by user ID
const getUserVideos = async (req, res) => {
  const userId = req.params.id;
  try {
    const videos = await getUserVideosSer(userId)
    console.log("reached")
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user videos' });
  }
};

// // Controller function to generate token for user authentication
// const generateTokenForUser = async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await getUserByUsernameSer(username, password);
//     const token = generateToken(user);
//     res.status(200).json({ user, token });
//   } catch (error) {
//     res.status(401).json({ error: 'Invalid credentials' });
//   }
// };

// Controller function to delete a user by ID
const deleteUser = async (req, res) => {
  const userId  = req.params.id;
  try {
    await deleteUserSer(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};

// Controller function to update user details by ID
const updateUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const { displayname, username, password, img } = req.body;
    const user = await updateUserSer(userId, displayname, username, password, img );
    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to add a new video for a user
const addingVideo = async (req, res) => {
  const userId  = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const video = await addingVideoSer(req.body.title, req.body.description, user._id, user.displayname,  req.file.filename)
    await video.save();

    user.videos.push(video._id);
    await user.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error adding video', error: error.message });
  }
};

const getRecommendedVideos = async (req, res) => {
  const { userId, videoId } = req.params;
  try {
    // Retrieve the TCP client from the userThreads map
    const client = userThreads.get(userId);
    if (!client) {
      return res.status(500).json({ message: 'TCP connection for user not found' });
    }

    // Send the GET_RECOMMENDATIONS request to the C++ server
    const message = JSON.stringify({
      type: 'GET_RECOMMENDATIONS',
      userId: userId,
      videoId: videoId
    });
    client.write(message);

    // Listen for the response from the C++ server
    client.once('data', async (data) => {
      console.log(`Received recommended videos for user ${userId}:`, data.toString());

      // The response is expected to be in JSON format {"type":"RECOMMENDATIONS","videos":["videoId1","videoId2",...]}
      const response = JSON.parse(data.toString());
      
      if (response.type === 'RECOMMENDATIONS') {
        const videoIds = response.videos || [];
        console.log('videoIds', videoIds);

        if (videoIds.length === 0) {
          console.log("No recommendations found");
          const videos = await getTopAndRandomVideos();
          res.status(200).json(videos);
        } else {
          // Fetch video details from the database based on the received video IDs
          const videos = await Video.find({ _id: { $in: videoIds } }).sort({ views: -1 });

          // Send the video details as the response
          res.status(200).json(videos);
        }
      } else {
        res.status(500).json({ error: 'Unexpected response format from recommendation server' });
      }
    });

    // Handle errors in the TCP connection
    client.on('error', (error) => {
      console.error(`Error for user ${userId}:`, error);
      res.status(500).json({ error: 'Error connecting to the recommendation server' });
    });

  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};


const updateRecommend = async (req, res) => {
  const { userId, videoId } = req.params;

  try {
    console.log("userID", userId)
    // Retrieve the TCP client from the userThreads map
    const client = userThreads.get(userId);
    //console.log("client", client)
    if (!client) {
      return res.status(500).json({ message: 'TCP connection for user not found' });
    }

    // Create the message to be sent to the TCP server
    const message = JSON.stringify({
      type: 'WATCHED_VIDEO',
      userId,
      videoId
    });
    // Send the message to the TCP server
    client.write(message);
    // Send a success response to the HTTP request
    res.status(200).json({ message: 'Recommendation sent successfully' });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ message: 'Error updating recommendation', error: error.message });
  }
};

export { signup, generateTokenForUser, getUserInfo, getUserVideos, deleteUser, updateUser, addingVideo, updateRecommend, getRecommendedVideos };
