import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SideNav = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        className="btn btn-light position-fixed top-0 left-0 m-3"
        onClick={toggleNav}
      >
        {isOpen ? 'Stäng meny' : 'Öppna meny'}
      </button>

      <div
        className={`position-fixed bg-dark text-white vh-100 transition ${
          isOpen ? 'd-block' : 'd-none'
        }`}
        style={{ width: '250px', top: '0', left: '0', zIndex: '1000' }} 
      >
        <nav className="p-3">
          <button className="btn btn-light mb-3" onClick={toggleNav}>
            Stäng Meny
          </button>
          <ul className="list-unstyled">
            {token && (
              <li>
                <Link to="/chat" className="d-block p-2 text-white" onClick={toggleNav}>
                  Chat
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideNav;
