import React, { useState } from "react";
import axios from "axios";
import WebFont from "webfontloader";

WebFont.load({
  google: {
    families: ["Roboto:100,300,400,500,700,900", "Noto+Sans+Thai:100..900"],
  },
});

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "", // Updated field name
    last_name: "", // Updated field name
    role: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData); // Log the form data being sent
    try {
      const response = await axios.post(
        "http://localhost:8000/api/register/",
        formData
      );
      console.log(response.data);
      setError(null); // Clear error if the request is successful
    } catch (error) {
      console.error("Error Response:", error.response); // Log the error response
      // Check if the error response has a data attribute
      if (error.response && error.response.data) {
        console.log("Error Data:", error.response.data); // Log detailed error data
        setError(error.response.data);
      } else {
        setError("An error occurred");
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

  return (
    <div style={formStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>
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
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
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
        <input
          type="password"
          name="password2"
          value={formData.password2}
          onChange={handleChange}
          placeholder="Confirm Password"
          style={inputStyle}
        />
        <input
          type="text"
          name="first_name" // Updated field name
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          style={inputStyle}
        />
        <input
          type="text"
          name="last_name" // Updated field name
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          style={inputStyle}
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{ ...inputStyle, appearance: "none" }}
        >
          <option value="">Select Role</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#004494")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0056b3")}
        >
          Register
        </button>
        {renderErrorMessages()}
      </form>
    </div>
  );
};

export default Register;
