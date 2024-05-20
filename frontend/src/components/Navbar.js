import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import WebFont from "webfontloader";

WebFont.load({
  google: {
    families: ["Roboto:100,300,400,500,700,900", "Noto+Sans+Thai:100..900"],
  },
});

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="navStyle">
      <Link to="/" className="linkStyle">
        Database
      </Link>
      <div>
        <Link to="/login" className="linkStyle">
          Login
        </Link>
        <Link to="/register" className="linkStyle">
          Register
        </Link>
        <div
          className={`dropdownStyle ${dropdownVisible ? "show" : ""}`}
          onClick={toggleDropdown}
          ref={dropdownRef}
        >
          <div className="predictionContainerStyle">
            <span className="linkStyle">Prediction</span>
          </div>
          <div className="dropdownContentStyle">
            <Link
              to="/TumorPrediction"
              className="dropdownLinkStyle"
              onClick={closeDropdown}
            >
              Brain Tumor
            </Link>
            <Link
              to="/predict-diabetes"
              className="dropdownLinkStyle"
              onClick={closeDropdown}
            >
              Diabetes Classification
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
