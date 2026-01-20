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
        borderBottom: "1px solid rgba(212, 175, 55, 0.3)",
        background: "#0a0503",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)"
      }}
    >
      <div className='container-fluid py-2'>
        <div className="d-block d-md-flex justify-content-between text-white align-items-center">
          <div className='fw-bold d-md-block d-flex justify-content-between'>
            <img
              src={logo}
              alt="Mango Logo"
              width={100}
              className='m-auto'
            />
          </div>
          <div
            className='fw-bold'
            style={{
              fontSize: "14px",
              color: "#d4af37",
              letterSpacing: "0.3px"
            }}
          >
            Welcome to Mango Bot
          </div>
          <div className='fw-bold' style={{ fontSize: "13px", color: "#cccccc" }}>
            <span style={{ fontSize: "14px", color: "#d4af37" }}>
              {time.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
            <span className='ms-2' style={{ fontSize: "14px" }}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
