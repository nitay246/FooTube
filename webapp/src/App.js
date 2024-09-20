import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DarkModeProvider, useDarkMode } from './DarkModeContext';
import Signup from './Sign/Signup';
import Mainpage from './Mainpage';
import Signin from './Sign/Signin';
import Videowatch from './Videowatch/Videowatch';
import Addingvideo from './UserVideos/Addingvideo';
import Myvideos from './UserVideos/Myvideos';
import AppProvider from './contexts/AppProvider';

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <AppProvider>
        <AppContent />
        </AppProvider>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

function AppContent() {
  
  const { darkMode } = useDarkMode();
  
  return (
    <Routes> {/* Defining routes */}
      <Route path='/' element={<Mainpage darkMode={darkMode}/>} /> {/* Route for the main page */}
      <Route path='/signup' element={<Signup darkMode={darkMode} />} /> {/* Route for the signup page */}
      <Route path='/signin' element={<Signin darkMode={darkMode} />} /> {/* Route for the signin page */}
      <Route path='/Addingvideo' element={<Addingvideo darkMode={darkMode}/>} /> {/* Route for adding a video */}
      <Route path="/videowatch/:id/:creator" element={<Videowatch  darkMode={darkMode} key="uniquevalue" />} /> {/* Route for watching a video */}
      <Route path='/Myvideos/:id' element={<Myvideos darkMode={darkMode}/>} />
    </Routes>
  );
}

export default App;

