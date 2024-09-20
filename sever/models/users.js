import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
  // Username field with unique constraint and validation
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required'],
    minlength: [1, 'Username must be at least 1 character long']
  },
  // Display name field with required validation
  displayname: {
    type: String,
    required: [true, 'Name is required']
  },
  // Password field with required validation and custom validator
  password: {
    type: String,
    required: [true, 'Password is required'],
    validate: {
      validator: function (v) {
        const letterPattern = /[a-zA-Z]/;
        const numberPattern = /[0-9]/;
        return v.length >= 2 && letterPattern.test(v) && numberPattern.test(v);
      },
      message: 'Password must contain both letters and numbers'
    }
  },
  // Image field with required validation
  img: {
    type: String,
    required: [true, 'Profile picture is required']
  },
  // Videos field with references to Video documents
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }]
});

// Create an index on the username field with unique constraint
userSchema.index({ username: 1 }, { unique: true });

// Define the User model using the user schema
const User = mongoose.model('User', userSchema);

export { User };
