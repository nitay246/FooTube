import React, { useRef,useContext } from 'react';
import { Link } from 'react-router-dom';
import { VideoContext } from '../contexts/VideoContext';

// VideoItem component to display individual video items
function VideoItem({ video }) {
  const { formatDate } = useContext(VideoContext);
  const videoRef = useRef(null); // Reference to the video element
  //const video = videoList.find((v) => v._id === decodeURIComponent(id));
  // Function to handle mouse enter event on the video
  const handleMouseEnter = () => {
    if (videoRef.current) {
      
      videoRef.current.play().catch((error) => {
        console.error('Error playing video:', error); // Log any errors encountered while playing the video
      });
    }
  };

  // Function to handle mouse leave event on the video
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause(); // Pause the video
      videoRef.current.currentTime = 0; // Reset the video to the beginning
    }
  };




  return (
    <div className="card col-md-4 col-lg-3 col-sm-6 border-0 p-2">
      <Link to={`/videowatch/${encodeURIComponent(video._id)}/${encodeURIComponent(video.creator)}`}>
        <video
          src={`http://localhost:8000/videowatch/${video.source}`} // Video source
          className="card-img-top" // CSS class for styling
          ref={videoRef} // Reference to the video element
          onMouseEnter={handleMouseEnter} // Play video on mouse enter
          onMouseLeave={handleMouseLeave} // Pause and reset video on mouse leave
          muted // Mute the video
          loop // Loop the video
        />
        <div className="card-body">
          <h4 className="card-text">{video.title}</h4> {/* Video title */}
          <p className="card-text"><i>{video.creatorName}</i></p>
          <p className="card-text">{video.views} views - {formatDate(video.uploadtime)}</p> {/* Video views and upload time */}
        </div>
      </Link>
    </div>
  );
}

export default VideoItem;
