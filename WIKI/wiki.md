## Technologies Used
- **React**: A JavaScript library for building user interfaces.
- **Express.js**: A web application framework for Node.js.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (JSON Web Tokens)**: A standard for creating access tokens for user authentication.
- **Bootstrap**: A CSS framework for responsive design.

## Prerequisites
- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **MongoDB**: Ensure you have MongoDB installed and running. You can download it from [mongodb.com](https://www.mongodb.com/). The DB will contain a `data` folder with two subfolders: `users` and `videos`.
- **Android Studio**: Ensure you have Android Studio installed. You can download it from [Android Studio](https://developer.android.com/studio).

## Setting Up the Environment

### Step 1: Start MongoDB
- **Command**: `mongod` or open MongoDB Compass and press connect
- **Description**: Assuming your `mongod` is configured correctly (as per instructions in the prerequisites), open CMD or Terminal and run the command `mongod`. Ensure the local server address is set to `mongodb://localhost:27017`.
![MongoDB Screenshot](https://github.com/Nadav1542/MainProject/blob/ex04-with-wiki/WIKI/pictures%20for%20wiki/Screenshot%202024-09-02%20221113.png)

### Step 2: Start the TCP Server
- **note**: To download the tcp server node js and webapp go to the MainProject reppsotory in git and pull it.
- **Command**: Press the arrow
- **Description**: Just press the play arrow and the C++ server will start.
![Run TCP](https://github.com/Nadav1542/MainProject/blob/2bb1a7e0721ae59059cbf82869cc1f5ce45462d2/WIKI/pictures%20for%20wiki/Screenshot%202024-09-02%20220940.png)

### Step 3: Start the Node.js Server
- **Command**: `node server.js`
- **Description**: To use the server, you first need to install Express. Run the following commands in the terminal:
  and enter `npm install express`

- **action**: Open the mainproject directory in your text editor and navigate to the server subdirectory by running cd server. Then, start the server using node server.js.
![starting up node js server](https://github.com/Nadav1542/MainProject/blob/2bb1a7e0721ae59059cbf82869cc1f5ce45462d2/WIKI/pictures%20for%20wiki/Screenshot%202024-09-02%20221310.png)

### step 4: seeding the data base
- **Command**: cd server then enter node seed.js
- **Description** in order for you to have a full data base with users and videos you need to run the seed file found in the server directory directory
![seeding the data base](https://github.com/Nadav1542/MainProject/blob/d89a598ec33ad6072062c5563e706d01238fd1c2/WIKI/pictures%20for%20wiki/Screenshot%202024-09-03%20152809.png)

### Step 5: Starting up the front end

### webapp:
- **Command**: npm start 
to use npm start you need to install npm to do that go to the terminal and enter : 
1. `npm install express` 
2. `npm install mongoose`
- **Description**: In the "mainproject" file enter the command "cd webapp" then enter "npm start" to open the web app.
![starting up the webapp](https://github.com/Nadav1542/MainProject/blob/2bb1a7e0721ae59059cbf82869cc1f5ce45462d2/WIKI/pictures%20for%20wiki/Screenshot%202024-09-02%20221332.png)
the webapp main page 
![main page](https://github.com/Nadav1542/MainProject/blob/2bb1a7e0721ae59059cbf82869cc1f5ce45462d2/WIKI/pictures%20for%20wiki/Screenshot%202024-09-02%20221359.png)
 ## User Operations

## Registration and Login

 # Register a New User

- **Description**: press the three lines icon to open the side menu, then click the signup button.
follow the instructions to enter username (must be a unique name), nickname, password, password confermation and finally uplopad a profile picture by clikcing on the alloted space.
![filling in the details](https://github.com/Nadav1542/MainProject/blob/2bb1a7e0721ae59059cbf82869cc1f5ce45462d2/WIKI/pictures%20for%20wiki/Screenshot%202024-09-02%20221436.png)
all thats left is to press upload

# Login

- **Description**: press the three lines icon to open the side menu, then click the signin button.
enter your username and password then press signin.
![entering details](https://github.com/Nadav1542/MainProject/blob/2bb1a7e0721ae59059cbf82869cc1f5ce45462d2/WIKI/pictures%20for%20wiki/Screenshot%202024-09-02%20221616.png)
press home and youll reach the next picture
![user main page](https://github.com/Nadav1542/MainProject/blob/2bb1a7e0721ae59059cbf82869cc1f5ce45462d2/WIKI/pictures%20for%20wiki/Screenshot%202024-09-02%20221626.png)

## Managing Videos
# Create a Video
- **Description**: after loggin in open the side menu and press the upload video tab, in the new screen fill the required fields and press upload.
![how to upload a video](https://github.com/Nadav1542/MainProject/blob/2bb1a7e0721ae59059cbf82869cc1f5ce45462d2/WIKI/pictures%20for%20wiki/Screenshot%202024-09-02%20221803.png)

# Edit a Video or delete it

- **Description**: after loggin in with the same account that uploaded the video, click the video and press the edit button in the video Description.
now you can edit the video name and description to save press the corresponding button, press the delete button to delete the video.
![editing and deleting a video](https://github.com/Nadav1542/MainProject/blob/2bb1a7e0721ae59059cbf82869cc1f5ce45462d2/WIKI/pictures%20for%20wiki/Screenshot%202024-09-02%20221850.png)


## android app:
# make sure to copy the android repository named Ex03
- **Description**: open the android file in android studio , set up an emulator of your choosing then press the green arrow to run the app.
in the next picture you can see the main screen and the green arrow mentioned above
![press the green arrow to run](https://github.com/Nadav1542/MainProject/blob/2bb1a7e0721ae59059cbf82869cc1f5ce45462d2/WIKI/pictures%20for%20wiki/Screenshot%202024-09-03%20023740.png)
### User Operations
## Registration and Login

# Register a New User

- **Description**: press the signup folating button then,follow the instructions to enter username (must be a unique name), nickname, password, password confermation.
finally uplopad a profile picture(note that the pictures taken by the emulators app are uri and not supported by the app you must upload a real picture so it can be converted to base64) by clikcing on the alloted space.
![signingup to the app](https://github.com/Nadav1542/MainProject/blob/2bb1a7e0721ae59059cbf82869cc1f5ce45462d2/WIKI/pictures%20for%20wiki/7c8530a1-5815-4929-abec-959224efcc7d.jpg)


# Login

- **Description**: press the floating signin button on the main page and enter your username and password.
![filling details on android](https://github.com/Nadav1542/MainProject/blob/feccfb464a2aa1bb9e4a7c326328da85aa96afa6/WIKI/pictures%20for%20wiki/44bb922b-01a9-46e5-aa00-6b29e5e07cff.jpg)

## Managing Videos
# Create a Video

- **Description**: after connecting to a user press the floating  uploadvideo button (the lowest one in the main page), next enter title description and the video ,note thet you need to upload the video itself and not a uri.
![uploading a video](https://github.com/Nadav1542/MainProject/blob/2bb1a7e0721ae59059cbf82869cc1f5ce45462d2/WIKI/pictures%20for%20wiki/f140c1ee-4880-439a-8f00-647407fc6e22.jpg)

# Edit a Video and delete a video

- **Description**: after connecting to the user that uploaded the video click the video , next click the edit video button to enter the edit activity there you can edit the provided fields as you please, to save press the edit button to delete the video just press the delete buttons.
![editing and deleting](https://github.com/Nadav1542/MainProject/blob/2bb1a7e0721ae59059cbf82869cc1f5ce45462d2/WIKI/pictures%20for%20wiki/c1fed451-0ec8-4779-ab8d-d1ab0b1c4dfd.jpg)


