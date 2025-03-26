import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/auth";
import Dashboard from "./components/dashboard";
import Landing from "./components/landing";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);

  const handleLogin = (userIdentity) => {
    setIdentity(userIdentity);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIdentity(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Dashboard logout={handleLogout} identity={identity} />
            ) : (
              <Landing />
            )
          }
        />
        <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={<Dashboard logout={handleLogout} identity={identity} />}
        />
      </Routes>
    </Router>
  );
}

export default App;