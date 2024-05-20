import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import TumorPrediction from "./components/TumorPrediction";
import ProtectedComponent from "./components/ProtectedComponent";
import Database from "./components/Database";
import DiabetesPrediction from "./components/DiabetesPrediction";
import "./styles/fonts.css";
import "./App.css"; // Import your CSS file

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/Database" element={<Database />} />
          <Route path="/login" element={<Login />} />
          <Route path="/TumorPrediction" element={<TumorPrediction />} />
          <Route path="/predict-diabetes" element={<DiabetesPrediction />} />
          <Route path="/protected" component={ProtectedComponent} />
          <Route path="/" element={<Register />} />
          {/* <Route path="/predict" element={<Prediction />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
