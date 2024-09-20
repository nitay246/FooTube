import { User } from "../models/users.js";
import { Video } from "../models/Video.js";


async function createUserSer(username, displayname, password, img) {
    // If the image doesn't have a prefix, add it
    if (img && !img.startsWith("data")) {
      img = `data:image/png;base64,${img}`;
    }
    
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error('Username already taken');
    }
    
    // Check if the display name is already taken
    const existingDisplay = await User.findOne({ displayname });
    if (existingDisplay) {
      throw new Error('Displayname already taken');
    }
    
    // Create a new user
    const user = new User({ username, displayname, password, img });
    return await user.save();
}

async function getUserByUsernameSer(username, password) {
    // Find user by username
    const user = await User.findOne({ username });
    
    // Check if user exists and if password matches
    if (!user || user.password !== password) {
      throw new Error('Incorrect username or password');
    }
    
    return user;
}

const getUserInfoSer = async (userId) => {
    // Find user by ID and populate their videos
    const user = await User.findById(userId).populate('videos');
    
    // Check if user exists
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
}

const getUserVideosSer = async (userId) => {
    // Find user by ID and populate their videos
    const user = await User.findById(userId).populate('videos');
    
    // Check if user exists
    if (!user) {
      throw new Error('User not found');
    }
    
    return user.videos;
}

const deleteUserSer = async (userId) => {
    // Find user by ID and delete
    const user = await User.findByIdAndDelete(userId);
    
    // Check if user exists
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
}

const updateUserSer = async (userId, displayname, username, password, img) => {
    // Find user by ID
    const user = await User.findById(userId);
    
    // Check if user exists
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update username if provided and not already taken
    if (username) {
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== userId) {
          throw new Error('Username already exists');
        }
        user.username = username;
    }
    
    // Update password if provided and meets criteria
    if (password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
          throw new Error('Password must be at least 8 characters long and contain both letters and numbers');
        }
        user.password = password;
    }
    
    // Update display name if provided and not already taken
    if (displayname) {
        const existingUser = await User.findOne({ displayname });
        if (existingUser && existingUser._id.toString() !== userId) {
          throw new Error('Displayname already taken');
        }
        user.displayname = displayname;
    }
    
    // Update image if provided
    if (img) user.img = img;
    
    return user;
}

const addingVideoSer = async (title, description, creator, creatorName, source) => {
    // Create a new video document
    const video = new Video({
        title,
        description,
        views: 0,
        uploadTime: new Date(), // Corrected 'uploadtime' to 'uploadTime'
        comments: [],
        likes: 0,
        dislikes: 0, // Corrected 'dislike' to 'dislikes'
        creator: creator,
        creatorName: creatorName,
        source: source,
    });
    
    return video;
}

// Export the service functions
export {
  createUserSer,
  getUserByUsernameSer,
  getUserInfoSer,
  getUserVideosSer,
  deleteUserSer,
  updateUserSer,
  addingVideoSer
};
