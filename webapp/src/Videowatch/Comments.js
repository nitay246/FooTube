import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Comments.css';
import { UserContext } from '../contexts/UserContext';


function Comments({ id, video, setVideo }) {
  const { userConnect, connectedUser } = useContext(UserContext);
  const [newComment, setNewComment] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editedComment, setEditedComment] = useState('');

  useEffect(() => {
    if (video) {
      setVideo(video);
    }
  }, [video, setVideo]);

  const handleCommentSubmit = async (event) => {
    if(!userConnect) return;
    event.preventDefault();
    if (newComment.trim()) {
      const newCommentObj = {
        text: newComment,
        user: connectedUser.displayname,
        img: connectedUser.img,
        userId: connectedUser._id,
      };
      try {
        const response = await fetch(`http://localhost:8000/api/videos/${id}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
          body: JSON.stringify(newCommentObj),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newCommentResponse = await response.json();

        setVideo((prevVideo) => ({
          ...prevVideo,
          comments: [...prevVideo.comments, newCommentResponse],
        }));

        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleEditCommentSubmit = async (event, index) => {
    if(!connectedUser) return;
    event.preventDefault();
    if (editedComment.trim()) {
      try {
        const response = await fetch(`http://localhost:8000/api/videos/${id}/comments/${index}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
          body: JSON.stringify({ text: editedComment }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedComment = await response.json();

        setVideo((prevVideo) => {
          const updatedComments = [...prevVideo.comments];
          updatedComments[index] = updatedComment;
          return { ...prevVideo, comments: updatedComments };
        });

        setEditIndex(null);
        setEditedComment('');
      } catch (error) {
        console.error('Error editing comment:', error);
      }
    }
  };

  const handleDeleteComment = async (index) => {
    if(!connectedUser) return;
    try {
      const response = await fetch(`http://localhost:8000/api/videos/${id}/comments/${index}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedComments = await response.json();

      setVideo((prevVideo) => ({
        ...prevVideo,
        comments: updatedComments,
      }));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLikeVideo = async () => {
    if (!userConnect) return; // Return early if the user is not connected
    try {
      const response = await fetch(`http://localhost:8000/api/videos/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setVideo((prevVideo) => ({ ...prevVideo, likes: data.likes, dislikes: data.dislikes }));
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleDislikeVideo = async () => {
    if (!userConnect) return; // Return early if the user is not connected
    try {
      const response = await fetch(`http://localhost:8000/api/videos/${id}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setVideo((prevVideo) => ({ ...prevVideo, dislikes: data.dislikes, likes: data.likes }));
    } catch (error) {
      console.error('Error disliking video:', error);
    }
  };

  const handleShareVideo = () => {
    const videoUrl = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: 'Check out this video!',
          url: videoUrl,
        })
        .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard
        .writeText(videoUrl)
        .then(() => {
          alert('Video URL copied to clipboard!');
        })
        .catch((error) => console.log('Error copying URL:', error));
    }
  };

  return (
    <div className="comments-section">
      <div className="row">
        <nav className="nav">
          <button className="nav-link btn" onClick={handleLikeVideo} disabled={!userConnect}>
            <i className="bi bi-hand-thumbs-up"></i> {video.likes}
          </button>
          <button className="nav-link btn" onClick={handleDislikeVideo} disabled={!userConnect}>
            <i className="bi bi-hand-thumbs-down"></i> {video.dislikes}
          </button>
          <button className="nav-link btn" onClick={handleShareVideo}>
            <i className="bi bi-share"></i>
          </button>
        </nav>
      </div>

      {userConnect && (
        <form onSubmit={handleCommentSubmit} className="mt-3">
          <div className="form-group">
            <label htmlFor="newComment">Add a Comment:</label>
            <textarea
              id="newComment"
              className="form-control"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            Submit
          </button>
        </form>
      )}

      <ul className="list-group mt-3">
        {video.comments.map((comment, index) => (
          <div key={index} className="list-group-items">
            {editIndex === index ? (
              userConnect && (
                <form onSubmit={(e) => handleEditCommentSubmit(e, index)}>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      placeholder="Edit your comment..."
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary m-2">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary m-2"
                    onClick={() => setEditIndex(null)}
                  >
                    Cancel
                  </button>
                </form>
              )
            ) : (
              <>
                <Link to={`/Myvideos/${encodeURIComponent(comment.userId)}`}>
                  <strong>
                    <p>
                      <img
                        src={comment.img}
                        alt=""
                        style={{
                          width: '1.5rem',
                          height: '1.5rem',
                          borderRadius: '50%',
                          marginRight: '0.5rem',
                        }}
                      />
                      {comment.user}:
                    </p>
                  </strong>
                </Link>
                <i>{comment.text}</i>

                {userConnect && connectedUser._id === comment.userId && (
                  <div>
                    <button
                      className="alert alert-info p-1 m-2"
                      style={{ color: 'blue' }}
                      onClick={() => {
                        setEditIndex(index);
                        setEditedComment(comment.text);
                      }}
                    >
                      <i className="bi bi-pencil m-1"></i>
                      Edit
                    </button>
                    <button
                      className="alert alert-danger p-1 m-2"
                      style={{ color: 'red' }}
                      onClick={() => handleDeleteComment(index)}
                    >
                      <i className="bi bi-trash m-1"></i>
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Comments;