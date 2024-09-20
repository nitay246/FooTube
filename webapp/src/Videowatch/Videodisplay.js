import './Singlevideo.css';
import { useState, useEffect, useContext } from 'react';
import Comments from './Comments';
import { useNavigate, Link } from 'react-router-dom';
import { VideoContext } from '../contexts/VideoContext';
import { UserContext } from '../contexts/UserContext';
import {jwtDecode} from 'jwt-decode';

function Videodisplay({ id, creator, darkMode }) {
  const { deleteVideo, formatDate } = useContext(VideoContext);
  const { setuserConnect, connectedUser, setconnectedUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('');
  const [views, setViews] = useState('');
  const [uploadTime, setUploadTime] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const checkJWT = async () => {
    let token = localStorage.getItem('jwtToken');
    if (!token) {
      token = localStorage.getItem('jwtTokenBackup');
    }

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          const response = await fetch(`http://localhost:8000/api/users/${decodedToken.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const userDetails = await response.json();
            setuserConnect(true);
            setconnectedUser(userDetails);
            if (!localStorage.getItem('jwtToken')) {
              localStorage.setItem('jwtToken', token);
            }
          } else {
            console.log('Failed to fetch user details');
          }
        } else {
          console.log('Token is expired');
        }
      } catch (error) {
        console.log('Invalid token:', error);
      }
    } else {
      console.log('No token found in localStorage');
    }
  };

  useEffect(() => {
    if (!connectedUser) {
      checkJWT();
    }
  }, [connectedUser]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${encodeURIComponent(creator)}/videos/${encodeURIComponent(id)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVideo(data);
        setTitle(decodeURIComponent(data.title));
        setDescription(decodeURIComponent(data.description));
        setSource(data.source);
        setViews(decodeURIComponent(data.views));
        setUploadTime(decodeURIComponent(formatDate(data.uploadtime)));

        // Increment view count and update recommendation
        await incrementViews();
      } catch (error) {
        console.error('Failed to fetch video', error);
      }
      
    };

    const incrementViews = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${encodeURIComponent(creator)}/videos/${encodeURIComponent(id)}/views`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const updatedViews = await response.json();
          setViews(updatedViews.views);
        } else {
          console.error('Failed to increment views');
        }
      } catch (error) {
        console.error('Error incrementing views:', error);
      }
    };

    fetchVideo();
  }, [id, creator, connectedUser]);

  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);
  const handleEditTitle = () => setIsEditingTitle(!isEditingTitle);
  const handleEditDescription = () => setIsEditingDescription(!isEditingDescription);

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    handleEdit();
  };

  const handleSaveDescription = () => {
    setIsEditingDescription(false);
    handleEdit();
  };

  const handleEdit = async () => {
    if (!connectedUser) return;

    const updatedVideo = { title, description };
    try {
      const response = await fetch(`http://localhost:8000/api/users/${encodeURIComponent(creator)}/videos/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify(updatedVideo),
      });
      if (response.ok) {
        const updatedVideoData = await response.json();
        setVideo(updatedVideoData);
      } else {
        console.error('Failed to update video');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    if (!connectedUser) return;

    try {
      const response = await fetch(`http://localhost:8000/api/users/${encodeURIComponent(creator)}/videos/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      deleteVideo(video._id);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete video', error);
    }
  };

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="row m-4">
        <div>
          <video src={`http://localhost:8000/videowatch/${video.source}`} className="card-img-top rounded" controls autoPlay />
          <div className="card-body singlevideo">
            <div className="card-text">
              <>
                <strong><Link to={`/Myvideos/${encodeURIComponent(video.creator)}`}>{video.creatorName}</Link></strong>
              </>
              <h3>{title}</h3>
              <i>{description}</i>
              <div>{views} views - {uploadTime}</div>
            </div>
            {connectedUser && connectedUser._id === video.creator && (
              <>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  className="btn btn-sm btn-outline-primary edit-button mt-3"
                >
                  <i className="bi bi-pencil"></i> Edit video details
                </button>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className={`modal-content ${darkMode ? 'dark-mode-input' : ''}`}>
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <input
                          type="text"
                          value={title}
                          onChange={handleTitleChange}
                          placeholder="New title"
                          className="form-control d-inline w-auto"
                        />
                        <p className="mt-3">
                          <input
                            type="text"
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="New description"
                            className="form-control d-inline w-auto"
                          />
                        </p>
                        {connectedUser && connectedUser._id === video.creator && (
                          <p className="mt-3">
                            <button onClick={handleDelete} className="btn btn-sm btn-outline-danger ms-2" data-bs-dismiss="modal">
                              <i className="bi bi-trash"></i> Delete video
                            </button>
                          </p>
                        )}
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSaveDescription}>Save changes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Comments id={id} video={video} setVideo={setVideo} />
    </>
  );
}

export default Videodisplay;
