import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Css styles/Register.css"

const Register = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
    const navigate = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault();
    
      const registerDto = { UserName: userName, Email: email, Password: password };
    
      axios.post("https://goldfish-app-ebu3p.ondigitalocean.app/api/accounts", registerDto)
        .then((response) => {
          navigate("/Login"); 
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            setErrorMessage(error.response.data);
          } else {
            setErrorMessage("Password must be at least 6 characters long, including an uppercase letter, a lowercase letter, a number, and a special character. ");
          }
        });
    };
    
  
    return (
      <div className="register-container">
        <h2>Register</h2>
  
        {errorMessage && <p className="register-error-message">*{errorMessage}</p>}
  
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              id="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email: </label>
            <input
                 style={{ marginLeft: '28px' }}
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>

      </div>
    );
};

export default Register;