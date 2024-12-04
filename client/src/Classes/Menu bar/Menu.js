import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../Css styles/Menu.css';

const Menu = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <nav className="menu">
        <div className="menu-header">
          <h1 className="menu-logo">OSLS</h1> {/* Online Student Learing Site*/}
          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>
        </div>
        <ul className={`menu-links ${isOpen ? 'open' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/AllSubjects">Subjects</Link></li>
        </ul>
      </nav>
    );
};

export default Menu;