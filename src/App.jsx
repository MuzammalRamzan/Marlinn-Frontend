import "./App.css";
import Hero from "./Compounent/Hero/Hero";
import LoginPage from "./Compounent/LoginPage/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "./assets/mango-logo.png";
import Admin from "./Compounent/Admin/Admin";

function App() {
  const [showInitialContent, setShowInitialContent] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // Start fade out effect
      setTimeout(() => {
        setShowInitialContent(false); // Hide content after fade-out
      }, 1000); // Match this duration to the CSS animation time
    }, 2000); // Show for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showInitialContent ? (
        <div
          className={`initial-content text-white ${
            fadeOut ? "fade-out" : ""
          }`}
        >
          <div className="text-center">
            <img src={logo} alt="Mango Logo" width={350} style={{
              filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.5))',
              animation: 'pulse 2s infinite'
            }} />
          </div>
        </div>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/user" element={<Hero />} />
            {/* <Route path="/AdminPanil" element={<Admin />} /> */}
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
