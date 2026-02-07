import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dealers from "./components/Dealers/Dealers.jsx";
import Dealer from "./components/Dealers/Dealer.jsx";   // ✅ ADDED

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

        {/* HOME → redirect */}
        <Route
          path="/"
          element={
            userName ? (
              <Navigate to="/dealers" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* DEALERS PAGE */}
        <Route
          path="/dealers"
          element={
            userName ? (
              <Dealers userName={userName} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ✅ SINGLE DEALER PAGE (ADDED) */}
        <Route
          path="/dealer/:id"
          element={
            userName ? (
              <Dealer />
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
              <Navigate to="/dealers" />
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
              <Navigate to="/dealers" />
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
