import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../Css styles/Menu.css';
import axios from 'axios';

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

      setAccessToken(localStorage.getItem("accessToken"));
      
    }, [accessToken]); 


    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };

    const handleLogout = () => {
      axios
        .post(
          "https://goldfish-app-ebu3p.ondigitalocean.app/api/logout", 
          {},  // Empty body if no data needs to be sent
          {
            withCredentials: true,  // Ensures cookies are sent
          }
        )
        .then(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("Role");
          setAccessToken("");
          navigate("/");
        })
        .catch((error) => {
          console.error("Logout failed:", error);
        });
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
          <li><Link to="/"><i className="fas fa-home"></i> Home</Link></li>
          <li><Link to="/AllSubjects"><i className="fas fa-book"></i> Subjects</Link></li>

          <div className="menu-links-right">
          {!accessToken ? (
            <>
              <li><Link to="/Register"><i className="fas fa-user-plus"></i> Register</Link></li>
              <li><Link to="/Login"><i className="fas fa-sign-in-alt"></i> Login</Link></li>
            </>
          ) : (
            <li>
              <button onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </li>
          )}
          </div>

        </ul>
      </nav>
    );
};

export default Menu;