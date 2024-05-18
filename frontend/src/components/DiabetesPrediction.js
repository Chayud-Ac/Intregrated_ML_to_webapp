import React, { useState } from "react";
import axios from "axios";

const DiabetesPrediction = () => {
  const [formData, setFormData] = useState({
    patient_name: "",
    age: "",
    hypertension: "",
    heart_disease: "",
    bmi: "",
    HbA1c_level: "",
    blood_glucose_level: "",
    gender: "",
    smoking_history: "",
    medical_history: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null); // State to manage error messages

  const formStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    maxWidth: "800px",
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
    width: "100%",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    gridColumn: "span 2",
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#0056b3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/predict_diabetes/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(response.data);
      setError(null); // Clear error if the request is successful
    } catch (error) {
      console.error("Error Response:", error.response); // Log the error response
      if (error.response && error.response.data) {
        if (error.response.data.code === "token_not_valid") {
          setError("Token is invalid or expired. Please log in again.");
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        } else {
          setError(error.response.data);
        }
      } else {
        setError("An error occurred");
      }
    }
  };

  const renderErrorMessages = () => {
    if (!error) return null;

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

    return <p style={{ color: "red" }}>{error}</p>;
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "0px" }}>
      <div style={formStyle}>
        <h2
          style={{
            gridColumn: "span 2",
            textAlign: "center",
            marginBottom: "0px",
          }}
        >
          Diabetes Prediction
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <input
            type="text"
            name="patient_name"
            value={formData.patient_name}
            onChange={handleChange}
            placeholder="Patient Name"
            style={inputStyle}
            required
          />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            style={inputStyle}
            required
          />
          <select
            name="hypertension"
            value={formData.hypertension}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Hypertension</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <select
            name="heart_disease"
            value={formData.heart_disease}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Heart Disease</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <input
            type="number"
            name="bmi"
            value={formData.bmi}
            onChange={handleChange}
            placeholder="BMI"
            step="0.1"
            style={inputStyle}
            required
          />
          <input
            type="number"
            name="HbA1c_level"
            value={formData.HbA1c_level}
            onChange={handleChange}
            placeholder="HbA1c Level"
            step="0.1"
            style={inputStyle}
            required
          />
          <input
            type="number"
            name="blood_glucose_level"
            value={formData.blood_glucose_level}
            onChange={handleChange}
            placeholder="Blood Glucose Level"
            style={inputStyle}
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select
            name="smoking_history"
            value={formData.smoking_history}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Smoking History</option>
            <option value="No Info">No Info</option>
            <option value="current">Current</option>
            <option value="ever">Ever</option>
            <option value="former">Former</option>
            <option value="never">Never</option>
            <option value="not current">Not Current</option>
          </select>
          <textarea
            name="medical_history"
            value={formData.medical_history}
            onChange={handleChange}
            placeholder="Medical History"
            style={{ ...inputStyle, gridColumn: "span 2" }}
            required
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#004494")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#0056b3")}
          >
            Predict
          </button>
          {renderErrorMessages()}
        </form>
        {result && (
          <div
            style={{
              gridColumn: "span 2",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <h3>Prediction Result</h3>
            <p>Diabetes: {result.diabetes}</p>
            <p>Probability: {result.probability}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiabetesPrediction;
