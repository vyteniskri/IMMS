import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Css styles/Login.css"

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const loginDto = { UserName: userName, Password: password };
  
    axios.post("http://localhost:5097/api/login", loginDto, { withCredentials: true })
      .then((response) => {
        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken);

        const payload = accessToken.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        localStorage.setItem("Role", role);

        navigate("/"); 
        window.location.reload();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
      });
  };
  

  return (
    <div className="login-container">
      <h2>Login</h2>

      {errorMessage && <p className="login-error-message">*{errorMessage}</p>}

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
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      <p>Don't have an account? <a href="/Register">Register</a></p>
    </div>
  );
};

export default Login;
