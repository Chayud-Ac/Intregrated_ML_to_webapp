import React, { useState, useCallback } from "react";
import axios from "axios";
import WebFont from "webfontloader";
import { useDropzone } from "react-dropzone";

WebFont.load({
  google: {
    families: ["Roboto:100,300,400,500,700,900", "Noto+Sans+Thai:100..900"],
  },
});

const Prediction = () => {
  const [formData, setFormData] = useState({
    patient_name: "",
    age: "",
    medical_history: "",
    original_image_file: null, // store the original image
    resized_image_file: null, // store the resized image for display
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resizeImage = (file, maxWidth, maxHeight, callback) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height *= maxWidth / width));
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width *= maxHeight / height));
          height = maxHeight;
        }
      }

      // Create a canvas element to resize the image
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Convert the canvas to a Blob and call the callback with the new Blob
      canvas.toBlob(callback, "image/jpeg", 0.95);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    // Store the original file
    setFormData((prevState) => ({
      ...prevState,
      original_image_file: file,
    }));

    // Resize the image for display
    resizeImage(file, 200, 200, (blob) => {
      setFormData((prevState) => ({
        ...prevState,
        resized_image_file: blob,
      }));
      setImagePreview(URL.createObjectURL(blob));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    const data = new FormData();
    data.append("patient_name", formData.patient_name);
    data.append("age", formData.age);
    data.append("medical_history", formData.medical_history);
    data.append("image_file", formData.original_image_file); // Send the original image file

    try {
      const response = await axios.post(
        "http://localhost:8000/api/predict_brain_tumor/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPrediction(response.data);
      setError(null); // Clear error if the request is successful
    } catch (error) {
      console.error("Error Response:", error.response); // Log the error response
      if (error.response && error.response.data) {
        setError("Token is invalid or expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        setError("An error occurred");
      }
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    padding: "40px",
  };

  const formContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "400px",
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*",
  });

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed #ccc",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            width: "512px",
            height: "512px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input {...getInputProps()} />
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Selected"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "8px",
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
          ) : (
            <p>Drag & drop an image here, or click to select one</p>
          )}
        </div>
      </div>
      <div style={formContainerStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Make a Prediction
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
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
          <textarea
            name="medical_history"
            value={formData.medical_history}
            onChange={handleChange}
            placeholder="Medical History"
            style={inputStyle}
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
        {prediction && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h3>Prediction Results</h3>
            <p>Prediction Class: {prediction.prediction}</p>
            <p>Prediction Score: {prediction.score}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prediction;
