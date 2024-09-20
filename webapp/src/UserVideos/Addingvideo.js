import './Addingvideo.css';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { VideoContext } from '../contexts/VideoContext';
import { UserContext } from '../contexts/UserContext';


// Addingvideo component for uploading a new video
function Addingvideo({ darkMode }) {
    // State variables for video details and error handling

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const {  setVideolist,videoList } = useContext(VideoContext);
    const {  connectedUser } = useContext(UserContext);
    console.log("message from adding video", connectedUser)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        file: null,
      });
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(formData)
      };
    
    

    // Handle file input change
    const handleFileChange = (event) => {
        const validation = validateVideoFile(event.target.files[0]); // Validate the selected video file
        if (validation.isValid) {
            setFormData({ ...formData, file: event.target.files[0] });
            setError(''); // Clear any previous error messages
            console.log(formData)

        } else {
            setFormData({ ...formData, file: null });
            setError(validation.error); // Set validation error message
        }
    };

    // Validate video file type
    const validateVideoFile = (file) => {
        if (!file) {
            return { isValid: false, error: 'No file selected' };
        }

        const validVideoType = 'video/mp4';

        if (file.type === validVideoType) {
            return { isValid: true, error: '' };
        } else {
            return { isValid: false, error: 'Invalid file type. Please upload a video file in MP4 format.' };
        }
    };

    // Handle video upload form submission
    const handleUpload = async (event) => {
        event.preventDefault(); // Prevent form submission from refreshing the page
        if (formData.title && formData.description && formData.file) {
            
            console.log(formData)
            const newFormData = new FormData();
            newFormData.append('title', formData.title)
            newFormData.append('description', formData.description)
            newFormData.append('file', formData.file)
            
            try {
                const response = await fetch(`http://localhost:8000/api/users/${connectedUser._id}/videos`, {
                    method: 'POST', 
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                      },
                    body: newFormData,
                    });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const newVideo = await response.json();
            // Update video list with the new video
            setVideolist([...videoList, newVideo]);
            navigate('/'); // Navigate to the home page after uploading
        }
         catch (error) {
            setError('Failed to upload video');
            console.error('Error uploading video:', error);
        }
    };
}

    // Handle dark mode toggle
    const handleDarkModeToggle = () => {
        const event = new Event('toggleDarkMode');
        window.dispatchEvent(event);
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-7 p-0 bg-body-tertiary rounded">
                    <form id="upload-video" className="cardreg p-4 shadow-lg" onSubmit={handleUpload}>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-dark ms-2" type="button" style={{ whiteSpace: 'nowrap' }} onClick={handleDarkModeToggle}>
                                <i className={darkMode ? 'bi bi-sun' : 'bi bi-moon-stars-fill'}></i>
                                {darkMode ? ' Light Mode' : ' Dark Mode'}
                            </button>
                        </div>
                        <div className="d-flex justify-content-center align-items-center flex-column mb-3 text-center">
                            <h2 className="mb-3">Upload New Video</h2>
                        </div>

                        {/* Video Title */}
                        <div className="validinput">Enter video title</div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                value={formData.title}
                                name="title"
                                onChange={handleChange}
                                className="form-control"
                                id="videoTitle"
                                placeholder="Enter video title"
                                required
                            />
                            <label htmlFor="videoTitle">Video Title</label>
                        </div>

                        {/* Video Description */}
                        <div className="mb-3">
                            <label htmlFor="videoDescription" className="form-label validinput">Enter video description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                id="videoDescription"
                                rows="3"
                                placeholder="Enter video description here"
                                required
                            />
                        </div>

                        {/* Upload Video */}
                        <div className="validinput mb-2">Upload your video</div>
                        <input
                            type="file"
                            name="videoFile"
                            onChange={handleFileChange}
                            className="form-control mb-2"
                            id="videoFile"
                            required
                        />
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        {/* Video Category */}
                        <div className="validinput">Select category</div>
                        <div className="form-floating mb-4">
                            <select
                                className="form-select p-2"
                                name="videoCategory"
                                id="videoCategory"
                                required
                            >
                                <option className="options" value="" disabled>Select category</option>
                                <option className="options" value="Education">Education</option>
                                <option className="options" value="Entertainment">Entertainment</option>
                                <option className="options" value="Sports">Sports</option>
                                <option className="options" value="News">News</option>
                                <option className="options" value="Music">Music</option>
                                <option className="options" value="Other">Other</option>
                            </select>
                        </div>
                        <div className="d-flex justify-content-between">
                            <button className="btn btn-primary" type="submit">Upload Video</button>
                            <Link to='/'><button className="btn btn-sign">Home</button></Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Addingvideo;