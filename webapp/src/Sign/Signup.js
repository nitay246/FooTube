import { Link } from 'react-router-dom'; 
import { useState } from 'react'; 
import './Sign.css'; 

function Signup({ darkMode }) {
  const handleDarkModeToggle = () => {
    const event = new Event('toggleDarkMode');
    window.dispatchEvent(event);
  };

  const [formData, setFormData] = useState({
    username: "",
    displayname: "",
    password: "",
    confirmpassword: "",
    img: null,
  });

  const [signedUp, setsignedUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        event.target.value = '';
        return;
      }
      setFormData({
        ...formData,
        img: URL.createObjectURL(file)
      });
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Function to read the file as base64
    const readFileAsBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };
    
    if (!formData.username.trim()) {
      setErrorMessage("Username is required.");
      return;
    }

    if (!formData.displayname.trim()) {
      setFormData((prevFormData) => ({ ...prevFormData, displayname: prevFormData.username }));
    }

    if (formData.password.length < 8) {
      setErrorMessage("The password must contain at least 8 characters.");
      return;
    }

    const letterPattern = /[a-zA-Z]/;
    const numberPattern = /[0-9]/;
    const hasLetter = letterPattern.test(formData.password);
    const hasNumber = numberPattern.test(formData.password);

    if (!hasLetter || !hasNumber) {
      setErrorMessage("Password must contain letters and numbers.");
      return;
    }

    if (formData.password !== formData.confirmpassword) {
      setErrorMessage("Password and Confirm Password must match.");
      return;
    }
    // Convert the selected image to base64
    let base64Image = "";
    if (document.getElementById('profile-picture').files[0]) {
      base64Image = await readFileAsBase64(document.getElementById('profile-picture').files[0]);
    } else {
      setErrorMessage("Please select an image.");
      return;
    }
    if (!formData.img) {
      setErrorMessage("Please select an image.");
      return;
    }
    const userData = {
      username: formData.username,
      password: formData.password,
      displayname: formData.displayname,
      img: base64Image
    };
    try {
      let response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        setsignedUp(true);
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          setErrorMessage(errorData.error || 'Username is already taken. Please choose a different name');
        } else {
          setErrorMessage(errorData.error || 'Failed to sign up.');
        }
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 p-0 bg-body-tertiary rounded">
            <form id="registration-form" onSubmit={handleSubmit} className="cardreg p-4 shadow-lg needs-validation" noValidate>
              <div className="d-flex justify-content-end">
                <button className="btn btn-dark ms-2" type="button" style={{ whiteSpace: 'nowrap' }} onClick={handleDarkModeToggle}>
                  <i className={darkMode ? 'bi bi-sun' : 'bi bi-moon-stars-fill'}></i>
                  {darkMode ? ' Light Mode' : ' Dark Mode'}
                </button>
              </div>
              <div className="d-flex justify-content-center align-items-center flex-column mb-3 text-center">
                <h2 className="mb-0">Sign Up</h2>
              </div>

              <div className="validinput">Enter your name</div>
              <div className="form-floating mb-3">
                <input type="text" name="username" className="form-control" id="floatingInput" onChange={handleChange} placeholder="text" required />
                <label className="float" htmlFor="floatingInput">Username</label>
              </div>

              <div className="validinput">Enter a display name</div>
              <div className="form-floating mb-3">
                <input type="text" name="displayname" className="form-control" id="floatingInput" onChange={handleChange} placeholder="text" required />
                <label htmlFor="floatingInput">Display name</label>
              </div>

              <div className="validinput">The password must be a minimum of 8 characters in length and contain at least one alphabetical character</div>
              <div className="form-floating mb-3">
                <input type="password" name="password" className="form-control" id="floatingPassword" onChange={handleChange} placeholder="Password" required />
                <label htmlFor="floatingPassword">Password</label>
              </div>

              <div className="validinput">Enter the password again</div>
              <div className="form-floating mb-3">
                <input type="password" name="confirmpassword" className="form-control" id="floatingPassword" onChange={handleChange} placeholder="Password" required />
                <label htmlFor="floatingPassword">Confirm Password</label>
              </div>

              <div className="mb-3">
                <label htmlFor="profile-picture" className="form-label">Profile Picture</label>
                <input className="form-control" name="img" type="file" id="profile-picture" onChange={handleImageChange} required />
                {formData.img && <img src={formData.img} alt="Selected" style={{ maxWidth: '60%', maxHeight: '100px' }} />}
              </div>

              {errorMessage && <div className="alert alert-danger" style={{ color: 'red'}}>{errorMessage}</div>}
              {signedUp && <div className="alert alert-success m-2" style={{ color: 'Green', textAlign: 'center'}}><strong>You signed up successfully!</strong> to connect, click the Sign In button.</div>}
              <div className="d-flex justify-content-between">
                {!signedUp && <button className="btn btn-sign" type="submit" id="register-button">Sign Up</button>}
                <div>
                  {signedUp && <div><Link to='/signin'><button className="btn btn-sign mt-2" type="button" id="register-button">Sign In</button></Link></div>}
                </div>
                <Link to='/'><button className="btn btn-sign">Home</button></Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
