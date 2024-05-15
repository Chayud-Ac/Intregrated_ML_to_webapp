import React, { useState } from "react";
import axios from "axios";
import WebFont from "webfontloader";

WebFont.load({
  google: {
    families: ["Roboto:100,300,400,500,700,900", "Noto+Sans+Thai:100..900"],
  },
});

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // New state for success messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData); // Log the form data being sent
    try {
      const response = await axios.post(
        "http://localhost:8000/api/token/",
        formData
      );
      console.log(response.data);
      setError(null); // Clear error if the request is successful
      setSuccess("Login successful!"); // Set success message
      // Store the tokens in localStorage or cookies
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
    } catch (error) {
      console.error("Error Response:", error.response); // Log the error response
      // Check if the error response has a data attribute
      if (error.response && error.response.data) {
        console.log("Error Data:", error.response.data); // Log detailed error data
        setError(error.response.data);
        setSuccess(null); // Clear success message
      } else {
        setError("An error occurred");
        setSuccess(null); // Clear success message
      }
    }
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "400px",
    margin: "50px auto",
    padding: "40px",
    backgroundColor: "white",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    borderRadius: "8px",
  };

  const inputStyle = {
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#0056b3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  // Helper function to render error messages
  const renderErrorMessages = () => {
    if (!error) return null;

    // If error is an object, display each key and value
    if (typeof error === "object" && error !== null) {
      return (
        <ul style={{ color: "red" }}>
          {Object.entries(error).map(([key, value]) => (
            <li key={key}>
              {key}: {Array.isArray(value) ? value.join(", ") : value}
            </li>
          ))}
        </ul>
      );
    }

    // Otherwise, display the error as a string
    return <p style={{ color: "red" }}>{error}</p>;
  };

  // Helper function to render success messages
  const renderSuccessMessage = () => {
    if (!success) return null;

    return <p style={{ color: "green" }}>{success}</p>;
  };

  return (
    <div style={formStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          style={inputStyle}
        />
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#004494")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0056b3")}
        >
          Login
        </button>
        {renderErrorMessages()}
        {renderSuccessMessage()}
      </form>
    </div>
  );
};

export default Login;
