import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

function App() {

  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if already logged in (session check)
  useEffect(() => {
    fetch("/djangoapp/getuser")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUserName(data.userName);
        } else {
          setUserName(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setUserName(null);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await fetch("/djangoapp/logout", {
      method: "POST"
    });
    setUserName(null);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            userName ? (
              <div style={{ textAlign: "center", marginTop: "100px" }}>
                <h2>Welcome {userName}</h2>
                <button onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            userName ? (
              <Navigate to="/" />
            ) : (
              <Login setUserName={setUserName} />
            )
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            userName ? (
              <Navigate to="/" />
            ) : (
              <Register />
            )
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
