import React, {  useEffect,useContext,useState } from 'react';
import LeftVideos from './LeftVideos';
import Videodisplay from './Videodisplay';
import SearchBar from '../Topbar/SearchBar';
import Menu from '../Topbar/Menu';
import { useParams } from 'react-router-dom';
import Usericon from '../Topbar/Usericon';
import {jwtDecode} from 'jwt-decode';
import { UserContext } from '../contexts/UserContext';

function Videowatch({  darkMode }) {
  
  const { id,creator } = useParams();
  const { setuserConnect, connectedUser, setconnectedUser} = useContext(UserContext);
  const [recommendationUpdated, setRecommendationUpdated] = useState(false);

  // Function to check JWT in local storage and connect the user
  const checkJWT = async () => {
    let token = localStorage.getItem('jwtToken');
    if (!token) {
      token = localStorage.getItem('jwtTokenBackup');
    }

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        // Check if the token is expired
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decodedToken.exp > currentTime) {
          // Token is valid, fetch user details
          const response = await fetch(`http://localhost:8000/api/users/${decodedToken.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const userDetails = await response.json();
            setuserConnect(true);
            setconnectedUser(userDetails); // Set the connected user state with the fetched user details
            console.log('User connected1:', userDetails);
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
    const updateRecommendation = async (userId, videoId) => {
        try {
          const response = await fetch(`http://localhost:8000/api/users/${encodeURIComponent(userId)}/updateRecommend/${encodeURIComponent(videoId)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            console.error('Failed to update recommendation');
          } else {
            setRecommendationUpdated(true);  // Mark the update as completed
          }
  
        } catch (error) {
          console.error('Error updating recommendation:', error);
        }
      };
      
      console.log('User connected2:', connectedUser);
    if (!connectedUser) {
      checkJWT();
    }
    if (connectedUser && id) {
      console.log('User id ', connectedUser._id, 'video id' , id);
      updateRecommendation(connectedUser._id, id);
    }
  
  }, [connectedUser, checkJWT]);

  const [filter, setFilter] = useState('')
 

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-3">
          
          {recommendationUpdated && <LeftVideos videoId={id} userId={connectedUser._id} />} {/* Only render LeftVideos after update */}
          </div>
          <div className="col-9">
            <div className="row align-items-center mb-3">
              <div className="col-auto">
                <Menu/>
              </div>
              <div className="col-auto">
                <Usericon/>
              </div>
              <div className="col">
                <SearchBar darkMode={darkMode} setFilter={setFilter} />
              </div>
            </div>
                <Videodisplay id={id} creator={creator} darkMode={darkMode}/>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Videowatch;
