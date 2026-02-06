import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUserName }) {

  const [userName, setLocalUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {

    const response = await fetch("/djangoapp/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName: userName,
        password: password
      })
    });

    const data = await response.json();

    if (data.status === "Authenticated") {
      // 🔥 Update global state in App.js
      setUserName(userName);

      // 🔥 Redirect to home
      navigate("/");
    } else {
      setMessage("Invalid Credentials");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={userName}
        onChange={(e) => setLocalUserName(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>
        Login
      </button>

      <p style={{color:"red"}}>{message}</p>

      <p>
        Don't have an account?{" "}
        <span
          style={{color:"blue", cursor:"pointer"}}
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>
    </div>
  );
}

export default Login;
