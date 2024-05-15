import React from "react";
import { Link } from "react-router-dom";
import WebFont from "webfontloader";

WebFont.load({
  google: {
    families: ["Roboto:100,300,400,500,700,900", "Noto+Sans+Thai:100..900"],
  },
});

const Navbar = () => {
  const navStyle = {
    padding: "10px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgb(24, 38, 78)",
    color: "white",
    borderRadius: "4px",
    marginBottom: "20px",
    fontFamily: "Roboto, Noto Sans Thai, sans-serif", // Set font family here
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "16px",
    padding: "8px 20px",
    fontFamily: "Roboto, Noto Sans Thai, sans-serif", // Set font family here
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>
        Home
      </Link>
      <div>
        <Link to="/login" style={linkStyle}>
          Login
        </Link>
        <Link to="/register" style={linkStyle}>
          Register
        </Link>
        <Link to="/predict" style={linkStyle}>
          Prediction
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
