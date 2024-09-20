import VideoItem from './VideoItem';
import './Card.css';
import React from 'react';
import { useContext } from 'react';
import { VideoContext } from '../contexts/VideoContext';

// Component to render a list of videos
function Videolist() {
 
  const { videoList } = useContext(VideoContext);
  
  return (
    <>
      {/* Iterate over the videoList array and render a VideoItem for each video */}
      {videoList.map((video, index) => (
        <VideoItem 
        key={video._id} video={video}
        />
      ))}
    </>
  );
}

export default Videolist;
