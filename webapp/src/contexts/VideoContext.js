// contexts/VideoContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const VideoContext = createContext();

export const VideoProvider = ({ children, userId = null, filter = null }) => {
  const [videoList, setVideolist] = useState([]);
  const navigate = useNavigate();
  
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
    return `${hours}:${minutes}          ${day}/${month}/${year}`;
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        let url;
        let options;

        if (filter && !userId) {
          url = 'http://localhost:8000/api/videos/filter';
          options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filter })
          };
        } else {
          url = userId
            ? `http://localhost:8000/api/users/${userId}/videos`
            : 'http://localhost:8000/api/videos';
          options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          };
        }

        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data)
        setVideolist(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchData();
  }, [userId, filter, navigate]);

  const deleteVideo = (id) => {
    const updatedVideos = videoList.filter((video, _id) => _id !== id);
    setVideolist(updatedVideos);
    navigate('/');
  };

  return (
    <VideoContext.Provider value={{ videoList, setVideolist, deleteVideo,formatDate }}>
      {children}
    </VideoContext.Provider>
  );
};