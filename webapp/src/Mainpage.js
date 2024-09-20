import React, { useEffect,useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode
import SearchBar from './Topbar/SearchBar';
import Videolist from './videoItem/Videolist';
import Quicksearch from './Topbar/Quicksearch';
import Menu from './Topbar/Menu';
import Usericon from './Topbar/Usericon';
import { UserContext } from './contexts/UserContext';
import { VideoProvider } from './contexts/VideoContext';



function Mainpage({darkMode}) {
  const {setuserConnect, connectedUser, setconnectedUser} = useContext(UserContext);
  
  // Function to check JWT in local storage and connect the user
  const checkJWT = async () => {
    const token = localStorage.getItem('jwtToken');
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
          } else {
            console.log('Failed to fetch user details');
          }
        } else {
          // Token is expired
          console.log('Token is expired');
          localStorage.removeItem('jwtToken');
        }
      } catch (error) {
        console.log('Invalid token:', error);
        localStorage.removeItem('jwtToken');
      }
    }
  };

  // Use effect to run the check on component mount
  useEffect(() => {
    if (!connectedUser) {
      checkJWT();
    }
  }, [connectedUser, checkJWT]);


  const [filter, setFilter] = useState('')
console.log(filter)

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
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

      <div className="row">
        <Quicksearch darkMode={darkMode} />
      </div>
    <div className="row m-4">
      <VideoProvider filter={filter}>
        <Videolist />
        </VideoProvider>
      </div>
    </div>
  );
}

export default Mainpage;
