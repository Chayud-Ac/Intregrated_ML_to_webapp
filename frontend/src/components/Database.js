import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Database.css"; // Import custom CSS

const Database = () => {
  const [database, setDatabase] = useState("BrainTumorPrediction");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      let url = "";
      if (database === "BrainTumorPrediction") {
        url = "http://localhost:8000/api/predictions_brain_tumor/";
      } else {
        url = "http://localhost:8000/api/predictions_diabetes/";
      }

      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Please log in to view this page.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedData = response.data.sort((a, b) => {
          if (database === "BrainTumorPrediction") {
            return (b.score || 0) - (a.score || 0);
          } else {
            return (
              (b.prediction_probability || 0) - (a.prediction_probability || 0)
            );
          }
        });
        setData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response && error.response.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [database, navigate]);

  return (
    <div className="container">
      <div>
        <select
          id="databaseSelect"
          className="form-select"
          value={database}
          onChange={(e) => setDatabase(e.target.value)}
        >
          <option value="BrainTumorPrediction">Brain Tumor Prediction</option>
          <option value="DiabetesPrediction">Diabetes Prediction</option>
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Age</th>
            <th>Medical History</th>
            {database === "BrainTumorPrediction" ? (
              <>
                <th>Prediction Class</th>
                <th>Score</th>
              </>
            ) : (
              <>
                <th>Gender</th>
                <th>Hypertension</th>
                <th>Heart Disease</th>
                <th>Smoking History</th>
                <th>BMI</th>
                <th>HbA1c Level</th>
                <th>Blood Glucose Level</th>
                <th>Diabetes Prediction</th>
                <th>Prediction Probability</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record.id}>
              <td>{record.patient?.name || "N/A"}</td>
              <td>{record.patient?.age || "N/A"}</td>
              <td>{record.patient?.medical_history || "N/A"}</td>
              {database === "BrainTumorPrediction" ? (
                <>
                  <td>{record.prediction_class}</td>
                  <td>
                    {record.score !== undefined
                      ? record.score.toFixed(2)
                      : "N/A"}
                  </td>
                </>
              ) : (
                <>
                  <td>{record.gender}</td>
                  <td>{record.hypertension ? "Yes" : "No"}</td>
                  <td>{record.heart_disease ? "Yes" : "No"}</td>
                  <td>{record.smoking_history}</td>
                  <td>{record.bmi}</td>
                  <td>{record.HbA1c_level}</td>
                  <td>{record.blood_glucose_level}</td>
                  <td>{record.diabetes_prediction}</td>
                  <td>
                    {record.prediction_probability !== undefined
                      ? record.prediction_probability.toFixed(2)
                      : "N/A"}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Database;
