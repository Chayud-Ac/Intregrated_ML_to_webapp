import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Prediction from "./components/Prediction";
import ProtectedComponent from "./components/ProtectedComponent";
import Home from "./components/Home";
import DiabetesPrediction from "./components/DiabetesPrediction";
import "./styles/fonts.css";
import "./App.css"; // Import your CSS file

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/predict" element={<Prediction />} />
          <Route path="/predict-diabetes" element={<DiabetesPrediction />} />
          <Route path="/protected" component={ProtectedComponent} />
          <Route path="/" exact component={Home} />
          {/* <Route path="/predict" element={<Prediction />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
