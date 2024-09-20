import { useState, useEffect } from 'react';
import Singlevideo from './Singlevideo';
import './videostyle.css';
import { useContext } from 'react';
import { VideoContext } from '../contexts/VideoContext';
function LeftVideos({ videoId, userId }) {
  const [videoList, setVideoList] = useState([]);
 // const { videoList,setVideoList } = useContext(VideoContext);
  console.log('lalalala');
 if(!userId){
  
  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/videos');
      if (response.ok) {
        const data = await response.json();
        setVideoList(data);
      } else {
        console.error('Failed to fetch videos:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };
  fetchVideos();
 }
 
 
 useEffect(() => {
    const fetchRecommendedVideos = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${userId}/recommendedVideo/${videoId}`);
        if (response.ok) {
          const data = await response.json();
          setVideoList(data);
        } else {
          console.error('Failed to fetch videos:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
  
    console.log('User id:', userId);
    
    fetchRecommendedVideos();
    
}, [userId]);

  return (
    <>
      {videoList.map((video) => (
        <Singlevideo
          video={video} key={video._id}
        />
      ))}
    </>
  );
}

export default LeftVideos;
