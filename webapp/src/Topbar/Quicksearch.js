import React from 'react';
import './Quicksearch.css';

// Quicksearch component to display a navigation bar with quick access links
function Quicksearch() {
    return (
        <nav className="nav nav-pills nav-fill nav-pills-container">
            {/* Each <a> tag represents a navigation link for quick search */}
            <button className="nav-link active" href="#">Sports</button>
            <button className="nav-link active" href="#">Music</button>
            <button className="nav-link active" href="#">News</button>
            <button className="nav-link active" href="#">Food</button>
            <button className="nav-link active" href="#">Politics</button>
            <button className="nav-link active" href="#">Comedy</button>
            <button className="nav-link active" href="#">Nature</button>
            <button className="nav-link active" href="#">Mixes</button>
            <button className="nav-link active" href="#">Lives</button>
            <button className="nav-link active" href="#">Animated</button>
        </nav>
    );
}

export default Quicksearch;
