import React from 'react';
import LeftMenu from '../LeftMenu/LeftMenu';
import './Menu.css'

function Menu() {
    return (
        <>
            {/* Button to toggle the offcanvas menu */}
            <button className="btn menu-button p-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
                <i className="bi bi-list"></i>
            </button>

            {/* Offcanvas menu element */}
            <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Menu</h5>
                    {/* Button to close the offcanvas menu */}
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    {/* Render the LeftMenu component with props */}
                    <LeftMenu/>
                </div>
            </div>
        </>
    );
}

export default Menu;
