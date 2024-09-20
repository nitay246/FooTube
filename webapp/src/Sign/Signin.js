import { Link } from 'react-router-dom';
import './Sign.css';
import React, { useState, useEffect,useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

function Signin({ darkMode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {userConnect, setuserConnect, connectedUser, setconnectedUser} = useContext(UserContext);
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
     
      if (response.ok) {
        const data = await response.json();
        const { user, token } = data;
        console.log('message from signin' ,user);

        // Store the token in local storage
        localStorage.setItem('jwtToken', token);
        console.log(token)
        setError('');
        setuserConnect(true);
        setconnectedUser(user);
        console.log("message from sign in in web", connectedUser)
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid username or password');
      }
    } catch (error) {
      console.log(error)
      setError('An error occurred. Please try again.');
    }
  };

  const handleDarkModeToggle = () => {
    const event = new Event('toggleDarkMode');
    window.dispatchEvent(event);
  };

  useEffect(() => {
    console.log('userConnect:', userConnect);
    console.log('connectedUser:', connectedUser);
  }, [userConnect, connectedUser]);

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-7 p-0 bg-body-tertiary rounded mt-5">
            <form
              id="registration-form"
              className="cardreg p-4 shadow-lg"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="d-flex justify-content-end">
                <button className="btn btn-dark ms-2" type="button" style={{ whiteSpace: 'nowrap' }} onClick={handleDarkModeToggle}>
                  <i className={darkMode ? 'bi bi-sun' : 'bi bi-moon-stars-fill'}></i>
                  {darkMode ? ' Light Mode' : ' Dark Mode'}
                </button>
              </div>

              <div className="d-flex justify-content-center align-items-center flex-column mb-3 text-center">
                <h2 className="mb-3">Sign In</h2>
                <div className="sign-in-message">Sign in to like videos, comment, and subscribe.</div>
              </div>

              <div className="validinput">{error === "Username not found" ? <p style={{ color: 'red' }}>{error}</p> : "Enter your name"}</div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  id="floatingInput"
                  onChange={(e) => { setUsername(e.target.value) }}
                  placeholder="text"
                  required
                />
                <label htmlFor="floatingInput">Username</label>
              </div>

              <div className="validinput">{error === "Incorrect password" ? <p style={{ color: 'red' }}>{error}</p> : "Enter your password"}</div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="floatingPassword"
                  onChange={(e) => { setPassword(e.target.value) }}
                  placeholder="Password"
                  required
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>

              {error && <div className="alert alert-danger" style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</div>}
              {userConnect && <div className="alert alert-success" style={{ color: 'green', textAlign: 'center', marginTop: '1rem' }}><strong>You signed in successfully.</strong> Click the Home button</div>}
              <div className="d-flex justify-content-between">
                {!userConnect && <button className="btn btn-sign" type="submit" id="sign-in-button">Sign In</button>}
                <Link to='/'><button className="btn btn-sign">Home</button></Link>
                {!userConnect && <Link to='/signup'><button className="btn btn-sign" type="button" id="register-button">Sign Up</button></Link>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signin;
