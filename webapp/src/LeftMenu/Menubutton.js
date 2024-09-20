import { Link } from 'react-router-dom'; // Import the Link component from react-router-dom

// Functional component for a menu button
function Menubutton({ description, link, icon, onClick }) {
    return (
        // Link component that navigates to the provided link
        <Link to={link} onClick={onClick} className="list-group-item d-flex align-items-center">
            {/* Icon element with the provided class name */}
            <i className={icon}></i>
            {/* Description of the menu button */}
            <span className="w-100 m-2 ms-3">{description}</span>
        </Link>
    );
}

export default Menubutton; // Export the Menubutton component as the default export
