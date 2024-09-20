import React, { useRef } from 'react';
import './Searchbar.css';

// SearchBar component for displaying a search input and dark mode toggle button
function SearchBar({ darkMode, setFilter = null }) { // Fix props destructuring here
  // Function to handle dark mode toggle
  const handleDarkModeToggle = () => {
    const event = new Event('toggleDarkMode'); // Create a new event for dark mode toggle
    window.dispatchEvent(event); // Dispatch the event
  };

  const searchBox = useRef(null);

  const search = function() {
    setFilter(searchBox.current.value); // Call setFilter with the search input value
  };

  return (
    <>
      {/* SearchBar */}
      <form className="d-flex p-4">
        {/* Search input field */}
        <input
         ref={searchBox} onKeyUp={search} className="form-control me-2" type="search" placeholder="Search" />
        {/* Search button */}
        <button className="btn btn-outline-red" type="button" style={{ whiteSpace: 'nowrap' }} onClick={search}>
          <i className="bi bi-search"></i> Search
        </button>
        {/* Dark mode toggle button */}
        <button className="btn btn-dark ms-2" type="button" style={{ whiteSpace: 'nowrap' }} onClick={handleDarkModeToggle}>
          <i className={darkMode ? 'bi bi-sun' : 'bi bi-moon-stars-fill'}></i>
          {darkMode ? '   Light Mode' : '   Dark Mode'}
        </button>
      </form>
    </>
  );
}

export default SearchBar;
