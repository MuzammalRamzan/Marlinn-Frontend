import React, { useEffect, useState } from 'react';
import logo from "../../assets/mango-logo.png";

function Nav() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        borderBottom: "2px solid #d4af37",
        background: "linear-gradient(to bottom, rgba(44, 24, 16, 0.8), rgba(26, 15, 8, 0.9))",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
      }}
    >
      <div className='container-fluid py-3'>
        <div className="d-block d-md-flex justify-content-between text-white align-items-center">
          <div className='fw-bold d-md-block d-flex justify-content-between'>
            <img
              src={logo}
              alt="Mango Logo"
              width={120}
              className='m-auto'
              style={{
                filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))'
              }}
            />
          </div>
          <div
            className='fw-bold'
            style={{
              fontSize: "16px",
              color: "#d4af37",
              letterSpacing: "0.5px"
            }}
          >
            Welcome to Mango Bot
          </div>
          <div className='fw-bold' style={{ fontSize: "14px", color: "#ffffff" }}>
            <span style={{ fontSize: "16px", color: "#d4af37" }}>
              {time.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
            <span className='ms-2' style={{ fontSize: "16px", color: "#ffffff" }}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
