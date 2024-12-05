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
          "http://localhost:5097/api/logout", 
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
          <li><Link to="/">Home</Link></li>
          <li><Link to="/AllSubjects">Subjects</Link></li>

          <div className="menu-links-right">
          {!accessToken ? (
            <>
              <li><Link to="/Register">Register</Link></li>
              <li><Link to="/Login">Login</Link></li>
            </>
          ) : (
            <li>
              <button onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
          </div>

        </ul>
      </nav>
    );
};

export default Menu;