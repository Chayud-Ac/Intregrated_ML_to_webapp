import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
// import Login from "./components/Login";
// import Prediction from "./components/Prediction";
import "./styles/fonts.css";
import "./App.css"; // Import your CSS file

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/predict" element={<Prediction />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
