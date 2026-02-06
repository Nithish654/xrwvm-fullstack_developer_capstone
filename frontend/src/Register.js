import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {

    const response = await fetch("/djangoapp/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName: userName,
        password: password,
        email: email
      })
    });

    const data = await response.json();

    if (data.status === "User created successfully") {
      navigate("/login");
    } else {
      setMessage("User already exists");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUserName(e.target.value)}
      />
      <br /><br />

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleRegister}>
        Register
      </button>

      <p style={{color:"red"}}>{message}</p>

      <p>
        Already have an account?{" "}
        <span
          style={{color:"blue", cursor:"pointer"}}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Register;
